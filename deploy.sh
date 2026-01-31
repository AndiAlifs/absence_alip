#!/bin/bash
# Deployment script for VPS
# Run this script on your VPS after uploading the code

set -e  # Exit on error

echo "========================================="
echo "Field Attendance System Deployment"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Configuration
APP_DIR="/var/www/attendance"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
SERVICE_NAME="attendance"

echo "Step 1: Installing system dependencies..."
sudo apt update
sudo apt install -y mysql-server nginx

echo ""
echo "Step 2: Configuring MySQL..."
read -p "Enter MySQL root password (will be created if first time): " -s MYSQL_ROOT_PASS
echo ""
read -p "Enter database name [attendance_db]: " DB_NAME
DB_NAME=${DB_NAME:-attendance_db}
read -p "Enter database user [attendance_user]: " DB_USER
DB_USER=${DB_USER:-attendance_user}
read -p "Enter database password: " -s DB_PASS
echo ""

# Create database and user
sudo mysql -u root -p"$MYSQL_ROOT_PASS" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "Database configured successfully!"

echo ""
echo "Step 3: Configuring backend..."
cd "$BACKEND_DIR"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
GIN_MODE=release
EOF

echo "Environment file created!"

echo ""
echo "Step 4: Building backend..."
go mod tidy
go build -o attendance-server main.go

if [ $? -eq 0 ]; then
    echo "Backend built successfully!"
else
    echo "Backend build failed!"
    exit 1
fi

echo ""
echo "Step 5: Installing systemd service..."
sudo cp "$APP_DIR/attendance.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME

echo "Checking service status..."
sleep 2
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo "Backend service is running!"
else
    echo "Backend service failed to start. Check logs with: sudo journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi

echo ""
echo "Step 6: Building frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build -- --configuration production

if [ $? -eq 0 ]; then
    echo "Frontend built successfully!"
else
    echo "Frontend build failed!"
    exit 1
fi

echo ""
echo "Step 7: Configuring Nginx..."
read -p "Enter your domain name (or press Enter to use IP address): " DOMAIN

if [ -z "$DOMAIN" ]; then
    DOMAIN="_"
    echo "Using IP-based configuration"
else
    echo "Using domain: $DOMAIN"
fi

# Update nginx config with domain
sed "s/YOUR_DOMAIN_OR_IP/$DOMAIN/g" "$APP_DIR/nginx.conf" | sudo tee /etc/nginx/sites-available/attendance > /dev/null

# Enable site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo "Nginx configured successfully!"
else
    echo "Nginx configuration test failed!"
    exit 1
fi

echo ""
echo "Step 8: Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
echo "y" | sudo ufw enable

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Your application is now running at:"
if [ "$DOMAIN" = "_" ]; then
    echo "http://$(curl -s ifconfig.me)"
else
    echo "http://$DOMAIN"
fi
echo ""
echo "Default login credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "Important: Change the admin password after first login!"
echo ""
echo "Useful commands:"
echo "  View backend logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  Restart backend: sudo systemctl restart $SERVICE_NAME"
echo "  Restart nginx: sudo systemctl restart nginx"
echo ""

# SSL setup option
if [ "$DOMAIN" != "_" ]; then
    echo "========================================="
    echo "SSL Certificate Setup (Recommended)"
    echo "========================================="
    read -p "Would you like to install SSL certificate now? (y/n): " INSTALL_SSL
    
    if [ "$INSTALL_SSL" = "y" ] || [ "$INSTALL_SSL" = "Y" ]; then
        echo "Installing Certbot..."
        sudo apt install -y certbot python3-certbot-nginx
        
        echo "Obtaining SSL certificate..."
        sudo certbot --nginx -d "$DOMAIN"
        
        echo ""
        echo "SSL certificate installed!"
        echo "Your site is now accessible at: https://$DOMAIN"
    else
        echo ""
        echo "To install SSL later, run:"
        echo "  sudo apt install certbot python3-certbot-nginx"
        echo "  sudo certbot --nginx -d $DOMAIN"
    fi
fi

echo ""
echo "Setup complete! 🎉"
