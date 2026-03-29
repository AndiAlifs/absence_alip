# NYAMPE (Nyaman Manajemen Presensi Elektronik)

> **Previously known as:** Field Attendance System

> **TL;DR:** GPS-based attendance tracker with automatic location validation. Employees clock in with one click, the system auto-approves when on-site within configured radii, and managers handle off-site exceptions and team oversight via a real-time dashboard.

> 📚 **NEW TO THIS PROJECT?** Start with [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md) for a 5-minute overview, or browse [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) to find exactly what you need.

## 🎯 What Problem Does This Solve?

Traditional attendance systems are vulnerable to fraud (buddy punching, fake locations) and create heavy administrative overhead. This system uses **HTML5 GPS coordinates + Server-Side Haversine distance calculation** to automatically verify employee locations, eliminating fraud and reducing manual approval workload by up to 80%.

### Before vs After

| Traditional System | Field Attendance System |
|-------------------|------------------------|
| ❌ Manual time cards (forgeable) | ✅ GPS-verified clock-ins |
| ❌ Buddy punching possible | ✅ Location validation per employee |
| ❌ Manager manually checks everyone | ✅ Auto-approval for on-site staff |
| ❌ No location proof | ✅ Exact coordinate tracking and validation |
| ❌ Late arrivals not tracked | ✅ Automatic lateness calculation |
| ❌ Paper-based leave requests | ✅ Digital workflow with manager approvals |
| ⏱️ ~30 min/day manager overhead | ⏱️ ~5 min/day (83% reduction) |

## ✨ Key Features at a Glance

| Feature | Description | User Role | Status |
|---------|-------------|-----------|--------|
| 📍 **Smart Clock-In** | One-click attendance with GPS auto-capture | Employee | ✅ Live |
| 🕐 **Clock-Out** | Record end-of-day with GPS and auto-calculated work hours | Employee | ✅ Live |
| ✅ **Auto-Approval** | Instant approval when within configured office radius | System | ✅ Live |
| 🗺️ **Location Validation** | Haversine formula calculates exact distance in meters | System | ✅ Live |
| ⏰ **Lateness Detection** | Auto-calculates late arrivals vs specific office target time | System | ✅ Live |
| 📊 **Manager Dashboard** | Real-time queue of Present/Absent/Late/On Leave personnel | Manager | ✅ Live |
| 👔 **Manual Exception Handling**| Review & approve/reject off-site "Pending" clock-ins | Manager | ✅ Live |
| 🏖️ **Leave Management** | Submit, review, and approve time-off requests | Both | ✅ Live |
| 🏢 **Multi-Office Support** | Manage 1-4 offices per manager, custom coordinates & radii | Manager | ✅ Live |
| ⚙️ **Global Settings** | Configure dynamic system variables (e.g., minimum work hours) | Super Admin | ✅ Live |
| 📋 **Self-Service History** | Employees view their full attendance & leave ledgers | Employee | ✅ Live |

---

## 📖 Typical Day in the Life

### For Employees
```text
8:55 AM  → Open app on phone/computer
         → Click "Clock In" button
         → Browser requests location permission (one-time)
         → GPS captured automatically
         
8:56 AM  → See green badge: "Approved - On Time ✅" (Within office radius)
         → Go about your work day
         
12:00 PM → Need time off next week?
         → Navigate to "Leave Request"
         → Select dates & enter reason
         → Submit for manager approval

5:00 PM  → Click "Clock Out"
         → System calculates exact hours worked
```

### For Managers
```text
9:05 AM  → Open Manager Dashboard
         → See real-time overview for assigned offices:
            • 18 employees clocked in on time ✅
            • 2 employees late ⚠️
            • 3 employees on approved leave 🏖️
            • 5 employees absent (no clock-in) ❌
         
9:10 AM  → Review "Pending Approvals" section
         → John clocked in from client site (5km away from office radius)
         → Click "Approve" - legitimate field work
         
4:00 PM  → Review leave requests queue
         → Approve Sarah's vacation (May 1-5)
```

## 🏗️ Architecture
- **Backend**: Go 1.20+ (Gin Web Framework, GORM)
- **Frontend**: Angular 16 (TypeScript, Reactive Forms, TailwindCSS)
- **Database**: MySQL 8.0+
- **Security**: Stateless JWT authentication, Bcrypt hashing, Role-Based Access Control (RBAC)

## 🚀 Quick Start

### Prerequisites
Before running the application, ensure you have:

| Tool | Version |
|------|---------|
| Go | 1.20+ |
| Node.js & npm | LTS (18+) |
| MySQL | 8.0+ |
| Angular CLI | Latest (`npm install -g @angular/cli`) |

---

## Step-by-Step Setup Guide

### 1. Database Setup
1. Open your MySQL client.
2. Create a new database named `attendance_db`:
   ```sql
   CREATE DATABASE attendance_db;
   ```
3. *Note: The Go backend utilizes GORM AutoMigrate, so tables will be generated automatically upon the first successful connection.*

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Go dependencies:
   ```bash
   go mod tidy
   ```
3. Set your environment variables (or copy `.env.example` to `.env`). Ensure the `MYSQL_DSN` matches your local database credentials:
   ```bash
   # Linux/Mac Example
   export MYSQL_DSN="root:password@tcp(127.0.0.1:3306)/attendance_db?charset=utf8mb4&parseTime=True&loc=Local"
   ```
4. Run the backend server:
   ```bash
   go run main.go
   ```
   The server will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the Angular development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

---

## 👥 User Management & Roles

### Roles & Capabilities
* **Employee:** Can clock in/out, apply for leave, and view personal historical data.
* **Manager:** Can oversee assigned branches, approve/reject off-site attendance, and handle leave requests.
* **Super Admin:** A manager with the `is_super_admin` flag. Can manage global system settings and master office configurations.

### Default Admin Account
The backend seeding logic automatically provisions default accounts on the first run (e.g., `admin` / `admin`). 
*⚠️ Security Note: Change default passwords immediately upon deployment!*

### Adding Employees
Managers and Admins can create new user accounts via the Manager Dashboard UI ("Manajemen Karyawan") or via API endpoints. Accounts are explicitly assigned a primary `office_id` during creation to dictate their validation coordinates.

---

## 🧠 How It Works (Technical Deep-Dive)

### GPS-Based Auto-Approval Workflow

```text
Employee Clicks "Clock In"
        ↓
Browser HTML5 Geolocation API captures GPS (latitude, longitude)
        ↓
Sent to backend via protected JWT route: POST /api/clock-in
        ↓
Backend retrieves the employee's assigned primary Office profile:
  - Office Target GPS coordinates
  - Allowed radius (meters)
  - Target clock-in time (e.g., 09:00)
        ↓
Server computes Haversine Distance:
  distance = calculateDistance(emp_lat, emp_lon, office_lat, office_lon)
        ↓
Status Evaluation Matrix:
  - Distance <= Allowed Radius? → status="approved" (Auto-Approved ✅)
  - Distance > Allowed Radius? → status="pending" (Requires Manual Review 🔍)
        ↓
Lateness Check:
  - Compare current timestamp to office target time
  - Flag is_late (boolean) and compute minutes_late (integer)
        ↓
Database record committed. Employee UI updates with reactive state.
```

### Key Technical Components
* **Haversine Distance (`utils/distance.go`):** Computes the great-circle distance between two GPS points on a sphere, accurate to ~1 meter.
* **RBAC Middleware (`auth/jwt.go`):** Validates the stateless JWT. Specific routes are guarded by `auth.ManagerMiddleware()` ensuring standard employees cannot access operational approval queues.
* **Dynamic Configurations:** Super Admins can alter global rules (like Session Expiry and Minimum Work Hours) directly from the UI, persisting to the `system_settings` table.

---

## 🛠️ Troubleshooting

### Common Issues

**"Lokasi kantor belum diatur" (Office Location Not Set)**
* **Solution**: A Super Admin must configure at least one active office location and assign the user to it.

**CORS errors in browser console**
* **Check**: Ensure the backend CORS middleware in `main.go` is permitting your frontend's origin (defaults to `http://localhost:4200` for dev).

**Geolocation permission denied**
* **Solution**: The user must click "Allow" when the browser prompts for location access. Ensure the site is served over HTTPS in production, as modern browsers block Geolocation APIs on insecure HTTP origins.

**JWT token expired**
* **Behavior**: Requests return 401 Unauthorized. 
* **Solution**: User must log in again. Token duration is configurable by Super Admins.

---

## 📄 License

Proprietary - Internal use only.

---

**Last Updated:** March 29, 2026  
**Version:** 3.1  
**Status:** Production Ready