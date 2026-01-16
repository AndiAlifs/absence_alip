# Field Attendance System

A professional web application for tracking employee attendance and leave requests.

## Architecture
- **Backend**: Go (Gin Gonic, GORM, MySQL)
- **Frontend**: Angular (TypeScript, Reactive Forms)
- **Database**: MySQL

## Prerequisites
Before running the application, ensure you have the following installed:
- [Go](https://go.dev/dl/) (version 1.20+)
- [Node.js & npm](https://nodejs.org/) (LTS version)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- Angular CLI: Install globally via `npm install -g @angular/cli`

---

## Step-by-Step Setup Guide

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, DBeaver, or command line).
2. Create a new database named `attendance_db`:
   ```sql
   CREATE DATABASE attendance_db;
   ```
3. (Optional) The backend is configured to auto-migrate the schema, but you can also manually run the script provided in `backend/migration.sql` to set up the tables.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Go dependencies:
   ```bash
   go mod tidy
   ```
3. Set environment variables (Optional). By default, the app connects to `root:password@tcp(127.0.0.1:3306)/attendance_db`. 
   To customize this, set the `MYSQL_DSN` environment variable:
   - **Linux/Mac**: `export MYSQL_DSN="your_user:your_password@tcp(127.0.0.1:3306)/attendance_db?charset=utf8mb4&parseTime=True&loc=Local"`
   - **Windows (PowerShell)**: `$env:MYSQL_DSN="your_user:your_password@tcp(127.0.0.1:3306)/attendance_db?charset=utf8mb4&parseTime=True&loc=Local"`
   
   *Note: Make sure your MySQL user has access to the database.*

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
   (This runs `ng serve`). The application will be available at `http://localhost:4200`.

---

## Usage Instructions

### Registration & Roles
Since the database starts empty, you need to create users. The application provides a Registration endpoint, but the frontend currently redirects to Login. You can use an API tool (like Postman or curl) or the `Register` UI if you implemented it (the current code focuses on Login).

**To Register a Manager (via cURL):**
```bash
curl -X POST http://localhost:8080/api/register \
   -H "Content-Type: application/json" \
   -d '{"username": "admin", "password": "password123", "role": "manager"}'
```

**To Register an Employee (via cURL):**
```bash
curl -X POST http://localhost:8080/api/register \
   -H "Content-Type: application/json" \
   -d '{"username": "john_doe", "password": "password123", "role": "employee"}'
```

### Logging In
1. Open your browser to `http://localhost:4200`.
2. Log in with the credentials you just created.
   - **Employees** will be directed to the Clock-In page.
   - **Managers** will be directed to the Manager Dashboard.

### Features
- **Clock In**: Automatically captures your browser's geolocation (Latitude/Longitude) and saves the timestamp.
- **Leave Request**: Submit a leave request with start/end dates and a reason.
- **Manager Dashboard**: View all clock-in records with links to Google Maps. View and approve/reject leave requests.
