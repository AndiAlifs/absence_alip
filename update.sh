#!/bin/bash
# Quick update script for code changes
# Run this on your VPS after pushing new changes

set -e

APP_DIR="/var/www/attendance"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "========================================="
echo "Updating Field Attendance System"
echo "========================================="
echo ""

# Check what to update
echo "What would you like to update?"
echo "1) Backend only"
echo "2) Frontend only"
echo "3) Both backend and frontend"
read -p "Enter choice [1-3]: " CHOICE

case $CHOICE in
    1|3)
        echo ""
        echo "Updating backend..."
        cd "$BACKEND_DIR"
        
        # Pull latest code if using git
        if [ -d .git ]; then
            git pull
        fi
        
        # Rebuild
        go mod tidy
        go build -o attendance-server main.go
        
        # Restart service
        sudo systemctl restart attendance
        
        echo "Backend updated and restarted!"
        
        # Show logs
        echo ""
        echo "Recent logs:"
        sudo journalctl -u attendance -n 20 --no-pager
        ;;
esac

case $CHOICE in
    2|3)
        echo ""
        echo "Updating frontend..."
        cd "$FRONTEND_DIR"
        
        # Pull latest code if using git
        if [ -d .git ]; then
            git pull
        fi
        
        # Rebuild
        npm install
        npm run build -- --configuration production
        
        # Reload nginx
        sudo systemctl reload nginx
        
        echo "Frontend updated!"
        ;;
esac

echo ""
echo "========================================="
echo "Update complete!"
echo "========================================="
echo ""
echo "Useful commands:"
echo "  Backend logs: sudo journalctl -u attendance -f"
echo "  Backend status: sudo systemctl status attendance"
echo "  Nginx status: sudo systemctl status nginx"
