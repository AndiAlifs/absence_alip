# API Reference - Quick Guide

Quick reference for all backend API endpoints.

**Base URL (Development)**: `http://localhost:8080/api`  
**Base URL (Production)**: `https://your-domain.com/api`

---

## 🔐 Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

### POST /login
**Purpose**: Authenticate user and get JWT token  
**Auth Required**: No  
**Body**:
```json
{
  "username": "admin",
  "password": "admin"
}
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Administrator",
    "role": "manager"
  }
}
```

---

### POST /register
**Purpose**: Create new user account  
**Auth Required**: No (but should be restricted in production)  
**Body**:
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "full_name": "John Doe",
  "role": "employee"  // "employee" or "manager"
}
```
**Response**:
```json
{
  "message": "User registered successfully",
  "user_id": 5
}
```

---

## 📍 Employee Endpoints

### POST /clock-in
**Purpose**: Submit attendance with GPS coordinates  
**Auth Required**: Yes (Employee or Manager)  
**Body**:
```json
{
  "latitude": 31.5204,
  "longitude": 74.3587
}
```
**Response**:
```json
{
  "message": "Clock-in berhasil!",
  "status": "approved",  // or "pending"
  "distance": 45.2,
  "is_late": false,
  "minutes_late": 0
}
```

---

### POST /clock-out
**Purpose**: Submit clock-out with GPS coordinates, calculates work hours  
**Auth Required**: Yes (Employee or Manager)  
**Body**:
```json
{
  "latitude": 31.5204,
  "longitude": 74.3587
}
```
**Response**:
```json
{
  "message": "Berhasil melakukan clock-out",
  "work_hours": "8.50"
}
```
**Notes**: Requires prior clock-in today. Can only clock out once per day.

---

### GET /my-attendance/today
**Purpose**: Get employee's attendance record for today  
**Auth Required**: Yes (Employee or Manager)  
**Response**:
```json
{
  "id": 123,
  "user_id": 5,
  "latitude": 31.5204,
  "longitude": 74.3587,
  "distance_meters": 45.2,
  "status": "approved",
  "is_late": false,
  "minutes_late": 0,
  "clock_in_time": "2026-02-01T08:55:00Z",
  "created_at": "2026-02-01T08:55:00Z"
}
```

---

### GET /my-attendance/history
**Purpose**: Get employee's full attendance history  
**Auth Required**: Yes (Employee or Manager)  
**Query Params** (optional):
- `limit` - Records per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response**:
```json
{
  "data": [
    {
      "id": 123,
      "clock_in_time": "2026-02-01T08:55:00Z",
      "clock_out_time": "2026-02-01T17:05:00Z",
      "status": "approved",
      "is_late": false,
      "distance_meters": 45.2,
      "work_hours": 8.17
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

### GET /my-leave/today
**Purpose**: Check if employee has leave request for today  
**Auth Required**: Yes (Employee or Manager)  
**Response** (if on leave):
```json
{
  "id": 45,
  "user_id": 5,
  "start_date": "2026-02-01",
  "end_date": "2026-02-05",
  "reason": "Family vacation",
  "status": "approved",
  "created_at": "2026-01-25T10:00:00Z"
}
```
**Response** (if not on leave):
```json
{
  "message": "No leave for today"
}
```

---

### GET /my-leave/history
**Purpose**: Get employee's full leave request history  
**Auth Required**: Yes (Employee or Manager)  
**Response**:
```json
[
  {
    "id": 45,
    "start_date": "2026-05-01T00:00:00Z",
    "end_date": "2026-05-05T00:00:00Z",
    "reason": "Family vacation",
    "status": "approved",
    "created_at": "2026-01-25T10:00:00Z"
  }
]
```

---

### POST /leave
**Purpose**: Submit leave request  
**Auth Required**: Yes (Employee or Manager)  
**Body**:
```json
{
  "start_date": "2026-05-01",
  "end_date": "2026-05-05",
  "reason": "Family vacation"
}
```
**Response**:
```json
{
  "message": "Leave request submitted successfully",
  "leave_id": 45,
  "status": "pending"
}
```

---

### GET /office-location
**Purpose**: View configured office location settings (legacy single-office endpoint)  
**Auth Required**: Yes (Employee or Manager)  
**Response**:
```json
{
  "id": 1,
  "office_name": "Main Office",
  "latitude": 31.5204,
  "longitude": 74.3600,
  "allowed_radius_meters": 500,
  "clock_in_time": "09:00"
}
```

---

### GET /my-offices
**Purpose**: Get all active office locations (for employee reference - shows all manager's offices)  
**Auth Required**: Yes (Employee or Manager)  
**Response**:
```json
[
  {
    "id": 1,
    "name": "Kantor Pusat",
    "address": "Jl. Sudirman No. 1",
    "latitude": -3.9985,
    "longitude": 122.5129,
    "allowed_radius_meters": 100,
    "clock_in_time": "08:00",
    "is_active": true
  }
]
```

---

## 👨‍💼 Manager-Only Endpoints

All manager endpoints require `role = "manager"` in JWT token.

### GET /admin/daily-attendance
**Purpose**: Get today's attendance overview for all employees  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
{
  "summary": {
    "total": 28,
    "on_time": 18,
    "late": 2,
    "on_leave": 3,
    "absent": 5,
    "pending": 0
  },
  "employees": [
    {
      "id": 5,
      "username": "john_doe",
      "full_name": "John Doe",
      "status": "ON_TIME",
      "attendance": {
        "clock_in_time": "08:55:00",
        "distance_meters": 45.2,
        "is_late": false
      }
    },
    {
      "id": 6,
      "username": "jane_smith",
      "full_name": "Jane Smith",
      "status": "LATE",
      "attendance": {
        "clock_in_time": "09:15:00",
        "distance_meters": 120.5,
        "is_late": true,
        "minutes_late": 15
      }
    },
    {
      "id": 7,
      "username": "bob_wilson",
      "full_name": "Bob Wilson",
      "status": "ON_LEAVE",
      "leave": {
        "start_date": "2026-02-01",
        "end_date": "2026-02-05",
        "reason": "Sick leave"
      }
    },
    {
      "id": 8,
      "username": "alice_brown",
      "full_name": "Alice Brown",
      "status": "ABSENT"
    }
  ]
}
```

---

### GET /admin/records
**Purpose**: Get all attendance records (paginated)  
**Auth Required**: Yes (Manager only)  
**Query Params** (optional):
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 50)
- `user_id` - Filter by user ID
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (approved/pending/rejected)

**Response**:
```json
{
  "total": 1250,
  "page": 1,
  "limit": 50,
  "records": [
    {
      "id": 123,
      "user": {
        "id": 5,
        "username": "john_doe",
        "full_name": "John Doe"
      },
      "latitude": 31.5204,
      "longitude": 74.3587,
      "distance_meters": 45.2,
      "status": "approved",
      "is_late": false,
      "clock_in_time": "2026-02-01T08:55:00Z",
      "created_at": "2026-02-01T08:55:00Z"
    }
  ]
}
```

---

### GET /admin/pending-clockins
**Purpose**: Get all pending attendance approvals  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
[
  {
    "id": 125,
    "user": {
      "id": 7,
      "username": "field_worker",
      "full_name": "Field Worker"
    },
    "latitude": 31.4504,
    "longitude": 74.2587,
    "distance_meters": 5200.5,
    "status": "pending",
    "clock_in_time": "2026-02-01T09:10:00Z",
    "map_link": "https://maps.google.com/?q=31.4504,74.2587"
  }
]
```

---

### PATCH /admin/clockin/:id
**Purpose**: Approve or reject pending clock-in  
**Auth Required**: Yes (Manager only)  
**URL Params**: `id` - Attendance record ID  
**Body**:
```json
{
  "status": "approved"  // or "rejected"
}
```
**Response**:
```json
{
  "message": "Clock-in approved successfully"
}
```

---

### GET /admin/leaves
**Purpose**: Get all leave requests  
**Auth Required**: Yes (Manager only)  
**Query Params** (optional):
- `status` - Filter by status (pending/approved/rejected)
- `user_id` - Filter by user ID

**Response**:
```json
[
  {
    "id": 45,
    "user_id": 5,
    "username": "john_doe",
    "full_name": "John Doe",
    "start_date": "2026-05-01",
    "end_date": "2026-05-05",
    "reason": "Family vacation",
    "status": "pending",
    "created_at": "2026-01-25T10:00:00Z"
  }
]
```

---

### PATCH /admin/leave/:id
**Purpose**: Approve or reject leave request  
**Auth Required**: Yes (Manager only)  
**URL Params**: `id` - Leave request ID  
**Body**:
```json
{
  "status": "approved"  // or "rejected"
}
```
**Response**:
```json
{
  "message": "Leave request approved successfully"
}
```

---

### GET /admin/office-location
**Purpose**: Get office location configuration  
**Auth Required**: Yes (Manager only)  
**Response**: Same as `/office-location` endpoint

---

### POST /admin/office-location
**Purpose**: Create or update office location settings  
**Auth Required**: Yes (Manager only)  
**Body**:
```json
{
  "office_name": "Main Office",
  "latitude": 31.5204,
  "longitude": 74.3600,
  "allowed_radius_meters": 500,
  "clock_in_time": "09:00"
}
```
**Response**:
```json
{
  "message": "Office location updated successfully",
  "office_id": 1
}
```

---

### GET /admin/employees
**Purpose**: List all employees  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
[
  {
    "id": 5,
    "username": "john_doe",
    "full_name": "John Doe",
    "role": "employee",
    "created_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": 6,
    "username": "jane_smith",
    "full_name": "Jane Smith",
    "role": "employee",
    "created_at": "2026-01-20T14:30:00Z"
  }
]
```

---

### POST /admin/employees
**Purpose**: Create new employee account  
**Auth Required**: Yes (Manager only)  
**Body**:
```json
{
  "username": "new_employee",
  "password": "secure_password",
  "full_name": "New Employee",
  "role": "employee"  // optional, defaults to "employee"
}
```
**Response**:
```json
{
  "message": "Employee created successfully",
  "employee_id": 10
}
```

---

### PUT /admin/employees/:id
**Purpose**: Update employee information  
**Auth Required**: Yes (Manager only)  
**URL Params**: `id` - Employee user ID  
**Body** (all fields optional):
```json
{
  "username": "updated_username",
  "password": "new_password",  // optional - only if changing password
  "full_name": "Updated Name",
  "role": "manager"  // to promote to manager
}
```
**Response**:
```json
{
  "message": "Employee updated successfully"
}
```

---

### DELETE /admin/employees/:id
**Purpose**: Delete employee account  
**Auth Required**: Yes (Manager only)  
**URL Params**: `id` - Employee user ID  
**Response**:
```json
{
  "message": "Employee deleted successfully"
}
```
**Note**: ⚠️ This does NOT cascade delete attendance/leave records (by design for audit trail)

---

## 🏢 Office Management Endpoints (Manager only)

### GET /admin/offices
**Purpose**: Get office list (super admin: all active offices; regular manager: only assigned offices)  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
[
  {
    "id": 1,
    "name": "Kantor Kendari",
    "address": "Jl. Sudirman No. 1, Kendari",
    "latitude": -3.9985,
    "longitude": 122.5129,
    "allowed_radius_meters": 100,
    "clock_in_time": "08:00",
    "is_active": true
  }
]
```

---

### POST /admin/offices
**Purpose**: Create new office location  
**Auth Required**: Yes (Manager only)  
**Body**:
```json
{
  "name": "Kantor Baru",
  "address": "Jl. Merdeka No. 10",
  "latitude": -3.9985,
  "longitude": 122.5129,
  "allowed_radius_meters": 150,
  "clock_in_time": "08:00"
}
```
**Response**:
```json
{
  "message": "Kantor berhasil dibuat",
  "office": { "id": 5, "name": "Kantor Baru", ... }
}
```
**Notes**: Office is automatically assigned to the creating manager.

---

### PUT /admin/offices/:id
**Purpose**: Update existing office location  
**Auth Required**: Yes (Manager only — super admin or manager assigned to that office)  
**URL Params**: `id` - Office ID  
**Body**: Same fields as POST (all optional)  
**Response**:
```json
{
  "message": "Kantor berhasil diperbarui",
  "office": { ... }
}
```

---

### DELETE /admin/offices/:id
**Purpose**: Soft-delete (deactivate) office location  
**Auth Required**: Yes (Manager only)  
**URL Params**: `id` - Office ID  
**Notes**: Enforces minimum 1 active office constraint.  
**Response**:
```json
{
  "message": "Kantor berhasil dinonaktifkan"
}
```

---

### GET /admin/my-offices
**Purpose**: Get the calling manager's assigned offices with count  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
{
  "offices": [ { "id": 1, "name": "Kantor Kendari", ... } ],
  "count": 2
}
```

---

### POST /admin/offices/assign
**Purpose**: Assign an office to a manager (super admin only)  
**Auth Required**: Yes (Super Admin only)  
**Body**:
```json
{
  "manager_id": 2,
  "office_id": 3
}
```
**Response**:
```json
{
  "message": "Kantor berhasil di-assign ke manager"
}
```
**Notes**: Enforces maximum 4 offices per manager. Prevents duplicate assignments.

---

### POST /admin/offices/unassign
**Purpose**: Remove an office assignment from a manager (super admin only)  
**Auth Required**: Yes (Super Admin only)  
**Body**:
```json
{
  "manager_id": 2,
  "office_id": 3
}
```
**Response**:
```json
{
  "message": "Kantor berhasil di-unassign dari manager"
}
```
**Notes**: Enforces minimum 1 office per manager.

---

## ⚙️ System Settings Endpoints (Manager only)

### GET /admin/settings
**Purpose**: Get all system settings as key-value map  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
{
  "settings": {
    "session_duration_hours": "24"
  }
}
```

---

### GET /admin/settings/session-duration
**Purpose**: Get current JWT session duration setting  
**Auth Required**: Yes (Manager only)  
**Response**:
```json
{
  "setting_key": "session_duration_hours",
  "setting_value": "24",
  "description": "Durasi sesi login default (jam)"
}
```

---

### PUT /admin/settings/session-duration
**Purpose**: Update JWT session duration (super admin only)  
**Auth Required**: Yes (Super Admin only)  
**Body**:
```json
{
  "duration_hours": 48
}
```
**Constraints**: `duration_hours` must be between 1 and 168 (1 hour to 7 days)  
**Response**:
```json
{
  "message": "Durasi sesi berhasil diperbarui",
  "duration_hours": 48
}
```

---

## 🔒 Error Responses

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions - Manager role required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error - please try again"
}
```

---

## 🧪 Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Clock-In Example
```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/clock-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"latitude":31.5204,"longitude":74.3587}'
```

### Get Daily Dashboard (Manager)
```bash
curl -X GET http://localhost:8080/api/admin/daily-attendance \
  -H "Authorization: Bearer $TOKEN"
```

### Approve Clock-In (Manager)
```bash
curl -X PATCH http://localhost:8080/api/admin/clockin/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"approved"}'
```

---

## 🧪 Testing with Postman

1. **Import Collection**:
   - Create new collection "Field Attendance"
   - Add environment variables:
     - `base_url` = `http://localhost:8080/api`
     - `token` = (will be set after login)

2. **Login Request**:
   - POST `{{base_url}}/login`
   - Body: Raw JSON
   - In Tests tab, add:
     ```javascript
     pm.environment.set("token", pm.response.json().token);
     ```

3. **Authenticated Requests**:
   - Add to Headers:
     - `Authorization`: `Bearer {{token}}`

---

## 📊 Status Enums

### User Roles
- `employee` - Regular employee (can clock-in, request leave)
- `manager` - Manager (full admin access)

### Attendance Status
- `approved` - Auto-approved (within radius) or manually approved
- `pending` - Awaiting manager review (outside radius)
- `rejected` - Manager rejected the clock-in

### Leave Request Status
- `pending` - Awaiting manager review
- `approved` - Manager approved time-off
- `rejected` - Manager rejected time-off

### Daily Status (Dashboard Only)
- `ON_TIME` - Clocked in before/at official time, within radius
- `LATE` - Clocked in after official time
- `ON_LEAVE` - Has approved leave for today
- `ABSENT` - No clock-in, not on leave
- `PENDING` - Clock-in awaiting approval

---

**Last Updated**: February 1, 2026  
**Version**: 3.0  
**Backend Framework**: Go + Gin  
**Default Port**: 8080

---

**Related Documentation**:
- [README.md](README.md) - Setup guide
- [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md) - Feature overview
- [SYSTEM_FLOW.md](SYSTEM_FLOW.md) - Architecture diagrams
