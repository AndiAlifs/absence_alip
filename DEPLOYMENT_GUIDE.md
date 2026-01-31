# Deployment Guide - Tencent Cloud Lighthouse VPS

## Prerequisites
- VPS running Ubuntu 20.04/22.04 or similar
- Root or sudo access
- Domain name (optional but recommended for SSL)
- Your VPS IP address

## Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
# or
ssh ubuntu@YOUR_VPS_IP
```

## Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install Node.js (for building Angular)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Go 1.21+
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installations
go version
node --version
npm --version
mysql --version
nginx -v
```

## Step 3: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation
# Set root password and answer Y to all security questions

# Login to MySQL
sudo mysql -u root -p

# In MySQL console, run:
CREATE DATABASE attendance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Prepare Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/attendance
sudo chown -R $USER:$USER /var/www/attendance
cd /var/www/attendance
```

## Step 5: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
cd /var/www/attendance
git clone YOUR_REPOSITORY_URL .
```

**Option B: Using SCP from your local machine**
```bash
# On your local machine (Windows PowerShell):
scp -r c:\projects\absence_alip\* root@YOUR_VPS_IP:/var/www/attendance/
```

**Option C: Using FTP/SFTP client like FileZilla**
- Connect to your VPS
- Upload all files to `/var/www/attendance/`

## Step 6: Configure Backend

```bash
cd /var/www/attendance/backend

# Create production environment file
cat > .env << 'EOF'
DB_USER=attendance_user
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=attendance_db
JWT_SECRET=YOUR_RANDOM_JWT_SECRET_HERE
GIN_MODE=release
EOF

# Generate a random JWT secret
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# Install Go dependencies
go mod tidy

# Build the application
go build -o attendance-server main.go

# Test the server (Ctrl+C to stop)
./attendance-server
```

If the server starts successfully and shows "Server starting on port 8080...", proceed to next step.

## Step 7: Create Systemd Service (Auto-start Backend)

```bash
sudo nano /etc/systemd/system/attendance.service
```

Paste the following content:
```ini
[Unit]
Description=Field Attendance System Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/attendance/backend
ExecStart=/var/www/attendance/backend/attendance-server
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/attendance

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable attendance

# Start the service
sudo systemctl start attendance

# Check status
sudo systemctl status attendance

# View logs if needed
sudo journalctl -u attendance -f
```

## Step 8: Build Frontend

```bash
cd /var/www/attendance/frontend

# Install dependencies
npm install

# Update API URL (see environment.prod.ts section below)
# Then build for production
npm run build

# The build output will be in dist/ folder
```

## Step 9: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/attendance
```

Paste the following configuration:

**If using domain name:**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    # Frontend
    location / {
        root /var/www/attendance/frontend/dist/frontend;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**If using IP address only:**
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Frontend
    location / {
        root /var/www/attendance/frontend/dist/frontend;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:
```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Enable attendance site
sudo ln -s /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 10: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (IMPORTANT - don't lock yourself out!)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 11: SSL Certificate (Optional but Recommended)

If you have a domain name, install Let's Encrypt SSL:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Follow the prompts
# Certbot will automatically configure nginx for HTTPS
```

## Step 12: Test Your Deployment

1. Open browser and go to `http://YOUR_VPS_IP` or `http://YOUR_DOMAIN.com`
2. You should see the login page
3. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### Backend not starting:
```bash
# Check service logs
sudo journalctl -u attendance -n 50

# Check if port 8080 is in use
sudo netstat -tulpn | grep 8080

# Test database connection
mysql -u attendance_user -p attendance_db
```

### Frontend not loading:
```bash
# Check nginx error logs
sudo tail -f /var/nginx/error.log

# Verify build files exist
ls -la /var/www/attendance/frontend/dist/frontend/
```

### API calls failing:
```bash
# Check nginx access logs
sudo tail -f /var/log/nginx/access.log

# Test backend directly
curl http://localhost:8080/api/login
```

### CORS errors:
Update CORS origins in [backend/main.go](backend/main.go) to include your domain/IP

## Maintenance Commands

```bash
# Restart backend
sudo systemctl restart attendance

# Restart nginx
sudo systemctl restart nginx

# View backend logs
sudo journalctl -u attendance -f

# Update application
cd /var/www/attendance
git pull  # if using git
sudo systemctl restart attendance
```

## Update Workflow

When you make changes to your code:

**Backend changes:**
```bash
cd /var/www/attendance/backend
go build -o attendance-server main.go
sudo systemctl restart attendance
```

**Frontend changes:**
```bash
cd /var/www/attendance/frontend
npm run build
sudo systemctl restart nginx
```

## Security Recommendations

1. **Change default admin password** immediately after first login
2. **Use strong database password**
3. **Enable SSL/HTTPS** (required for geolocation to work properly)
4. **Keep system updated**: `sudo apt update && sudo apt upgrade`
5. **Regular backups** of database:
   ```bash
   mysqldump -u attendance_user -p attendance_db > backup_$(date +%Y%m%d).sql
   ```
6. **Monitor logs** regularly for suspicious activity

## Important Notes

- Geolocation requires HTTPS in production (browsers block geolocation on HTTP)
- Make sure your VPS has at least 1GB RAM for smooth operation
- Consider setting up automated backups for your database
- Monitor disk space: `df -h`
