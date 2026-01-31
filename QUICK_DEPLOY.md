# Quick Deployment Reference

## Pre-Deployment Checklist

1. **Your VPS Details:**
   - IP Address: `___________________`
   - Domain (optional): `___________________`
   - SSH User: `___________________`

2. **Database Credentials to Choose:**
   - Database Name: `attendance_db` (recommended)
   - Database User: `attendance_user` (recommended)
   - Database Password: `___________________` (choose strong password)

## Quick Deploy Steps

### 1. Connect to VPS
```bash
ssh root@YOUR_VPS_IP
# or
ssh ubuntu@YOUR_VPS_IP
```

### 2. One-Command Setup (Choose One Method)

**Method A: Using the automated script (Easiest)**
```bash
# Create app directory
sudo mkdir -p /var/www/attendance
sudo chown -R $USER:$USER /var/www/attendance

# Upload your code to /var/www/attendance
# Then run:
cd /var/www/attendance
chmod +x deploy.sh
./deploy.sh
```

**Method B: Manual step-by-step**
Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### 3. Upload Code to VPS

**Option A: Using SCP (from Windows PowerShell)**
```powershell
scp -r c:\projects\absence_alip\* root@YOUR_VPS_IP:/var/www/attendance/
```

**Option B: Using Git**
```bash
# On VPS:
cd /var/www/attendance
git clone YOUR_REPO_URL .
```

**Option C: Using WinSCP/FileZilla**
- Download WinSCP: https://winscp.net/
- Connect to your VPS
- Upload all files to `/var/www/attendance/`

## Post-Deployment

### Access Your Application
- **HTTP:** `http://YOUR_VPS_IP`
- **With Domain:** `http://yourdomain.com`
- **With SSL:** `https://yourdomain.com`

### Default Login
- Username: `admin`
- Password: `admin123`
- **⚠️ CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!**

### Essential Commands

```bash
# View backend logs
sudo journalctl -u attendance -f

# Restart backend
sudo systemctl restart attendance

# Restart nginx
sudo systemctl restart nginx

# Check service status
sudo systemctl status attendance
sudo systemctl status nginx

# Database backup
mysqldump -u attendance_user -p attendance_db > backup.sql

# Database restore
mysql -u attendance_user -p attendance_db < backup.sql
```

## Updating After Code Changes

```bash
# On VPS:
cd /var/www/attendance
chmod +x update.sh
./update.sh
```

## Important Security Notes

### 1. SSL Certificate (Required for Geolocation!)
Browsers require HTTPS for geolocation API. Install SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. Change Default Passwords
- Admin password in the app
- MySQL root password
- Database user password

### 3. Firewall Configuration
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 4. CORS Configuration
If you use a domain name, update [backend/main.go](backend/main.go):
```go
AllowOrigins: []string{
    "http://localhost:4200",           // Development
    "https://yourdomain.com",          // Production
    "http://yourdomain.com"            // Production HTTP
},
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
sudo journalctl -u attendance -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8080

# Test database connection
mysql -u attendance_user -p attendance_db
```

### Frontend Not Loading
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify build output exists
ls -la /var/www/attendance/frontend/dist/
```

### API Calls Failing (404)
- Check nginx configuration for proxy_pass
- Verify backend is running: `sudo systemctl status attendance`
- Check CORS origins in backend/main.go

### Geolocation Not Working
- **Must use HTTPS** - install SSL certificate
- Check browser console for errors
- Ensure user grants location permission

## File Locations on VPS

```
/var/www/attendance/              # Main app directory
├── backend/
│   ├── attendance-server         # Compiled binary
│   └── .env                      # Environment config
├── frontend/
│   └── dist/frontend/            # Built Angular app
├── deploy.sh                     # Initial deployment script
└── update.sh                     # Update script

/etc/nginx/sites-available/attendance   # Nginx config
/etc/systemd/system/attendance.service  # Systemd service
/var/log/nginx/                        # Nginx logs
```

## Performance Optimization

### Enable Nginx Caching
Add to nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    # ... other proxy settings
}
```

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_attendance_user_date ON attendances(user_id, clock_in_time);
CREATE INDEX idx_leave_user_status ON leave_requests(user_id, status);
```

## Monitoring

### Set Up Log Rotation
```bash
sudo nano /etc/logrotate.d/attendance
```

Add:
```
/var/log/attendance/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

### Resource Monitoring
```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
htop  # Install with: sudo apt install htop
```

## Backup Strategy

### Automated Daily Backup Script
```bash
#!/bin/bash
# /root/backup.sh

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u attendance_user -pYOUR_PASSWORD attendance_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploaded files if any
# tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/attendance/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

## Support

If you encounter issues:
1. Check the logs first
2. Verify all services are running
3. Test each component separately
4. Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed steps
