# Field Attendance System - User Stories

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Project:** Field Attendance System  
**Status:** Production Ready

## Overview
This document lists all implemented features of the Field Attendance System organized as user stories. The system provides geolocation-based attendance tracking with automatic proximity validation and manager approval workflows.

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.1 | Jan 31, 2026 | Added US-031 (employee view office location) | Product Team |
| 1.0 | Jan 31, 2026 | Initial release - 30 user stories documented | Product Team |

## Progress Summary

- **Total User Stories:** 31
- **Completed:** 31 (100%)
- **In Progress:** 0
- **Planned:** 0
- **Blocked:** 0

---

## Quick Reference - User Stories by Role

### 👤 Employee Features (7 stories)
- [x] **US-001** - User can log in to the system with username and password to access role-specific features
- [x] **US-004** - Employee can clock in using GPS location to automatically record attendance with location verification
- [x] **US-005** - System automatically validates employee location and approves/pends attendance based on proximity to office
- [x] **US-006** - Employee can submit leave requests with start date, end date, and reason for manager approval
- [x] **US-027** - Employee can use browser geolocation to automatically capture current location without manual entry
- [x] **US-028** - Employee can view their location on an interactive map to visually confirm location data
- [x] **US-031** - Employee can view office location settings to see where they need to be for attendance approval

### 👨‍💼 Manager Features (12 stories)
- [x] **US-001** - Manager can log in to the system with username and password to access administrative features
- [x] **US-007** - Manager can configure office location coordinates and allowed radius for attendance validation
- [x] **US-008** - Manager can view all employee attendance records to monitor attendance patterns and history
- [x] **US-009** - Manager can view pending clock-in requests to review attendance from employees outside allowed radius
- [x] **US-010** - Manager can approve or reject pending clock-in requests for manual attendance validation
- [x] **US-011** - Manager can view all employee leave requests to review and manage time-off requests
- [x] **US-012** - Manager can approve or reject leave requests to manage team availability and time-off
- [x] **US-013** - Manager can view a list of all employees to see who has system access and their roles
- [x] **US-014** - Manager can create new employee accounts to provide system access for new staff
- [x] **US-015** - Manager can update employee information including username, password, or role
- [x] **US-016** - Manager can delete employee accounts to remove access for staff who have left
- [x] **US-028** - Manager can view office location on an interactive map to visually confirm office location settings

### ⚙️ System Features (12 stories)
- [x] **US-002** - System provides API for user registration to add new employees and managers
- [x] **US-003** - System automatically creates default admin account on first startup for initial setup
- [x] **US-017** - System uses JWT tokens for authentication to secure API endpoints with stateless sessions
- [x] **US-018** - System restricts manager routes based on user role to protect administrative features
- [x] **US-019** - System protects routes with authentication middleware to ensure only logged-in users can access endpoints
- [x] **US-020** - System protects frontend routes with guards to redirect unauthorized users to login
- [x] **US-021** - System stores user information securely for authentication and authorization
- [x] **US-022** - System stores clock-in records with location and status for attendance tracking
- [x] **US-023** - System stores leave requests with dates and approval status for time-off management
- [x] **US-024** - System stores office location settings for proximity validation
- [x] **US-025** - System automatically creates and updates database schema on startup
- [x] **US-026** - System calculates accurate distance between GPS coordinates using Haversine formula
- [x] **US-029** - System loads configuration from environment variables for different deployment environments
- [x] **US-030** - System allows cross-origin requests from frontend for proper communication

---
2: Employee Attendance Features

### US-031: Employee View Office Location
**As an** employee  
**I want to** view the configured office location settings  
**So that** I know where I need to be for my attendance to be automatically approved

**Acceptance Criteria:**
- Employee can access office location information
- Display office name, coordinates, and allowed radius
- No authentication required for this endpoint (or uses employee token)
- Information helps employee understand proximity requirements

**Status:** ✅ Implemented  
**Routes:** `GET /api/office-location`  
**Note:** Available to all authenticated users, not just managers

---

## Epic 
## Epic 1: Authentication & Authorization

### US-001: User Login
**As a** user (employee or manager)  
**I want to** log in to the system with my username and password  
**So that** I can access my role-specific features securely

**Acceptance Criteria:**
- User can enter username and password
- System validates credentials against database
- On successful login, JWT token is generated with 24-hour expiry
- Token includes user ID and role information
- User role determines access to features (employee vs manager)
- Invalid credentials display error message

**Status:** ✅ Implemented  
**Routes:** `POST /api/login`  
**Components:** [login.component.ts](frontend/src/app/components/login/login.component.ts)

---

### US-002: User Registration
**As a** system administrator  
**I want to** register new users via API  
**So that** employees and managers can be added to the system

**Acceptance Criteria:**
- Accept username, password, and role (employee/manager)
- Password is hashed using bcrypt before storage
- Username must be unique
- Default role is 'employee' if not specified
- Return success message on registration

**Status:** ✅ Implemented (API only, no UI)  
**Routes:** `POST /api/register`  
**Note:** Currently accessible via API only (cURL/Postman)

---

### US-003: Default Admin User
**As a** system  
**I want to** automatically create a default admin account on first startup  
**So that** there is always an initial manager to configure the system

**Acceptance Criteria:**
- Check if admin user exists on startup
- If not, create admin user with credentials (admin:admin123)
- Admin user has 'manager' role
- Logged during application startup

**Status:** ✅ Implemented  
**Implementation:** [main.go](backend/main.go) `seedAdminUser()`

---

## Epic 2: Employee Attendance Features

### US-004: Clock-In with Geolocation
**As an** employee  
**I want to** clock in using my current GPS location  
**So that** my attendance is automatically recorded with location verification

**Acceptance Criteria:**
- System requests browser geolocation permission
- Current latitude and longitude are captured
- Location is displayed on an embedded map
- Coordinates are sent to backend for validation
- User receives confirmation message after successful clock-in

**Status:** ✅ Implemented  
**Routes:** `POST /api/clock-in`  
**Components:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts)

---

### US-005: Automatic Proximity Validation
**As a** system  
**I want to** automatically validate employee location against office location  
**So that** attendance is approved only when employee is within allowed radius

**Acceptance Criteria:**
- Retrieve configured office location (latitude, longitude, radius)
- Calculate distance using Haversine formula
- If distance ≤ allowed radius → status = "approved" (auto-approved)
- If distance > allowed radius → status = "pending" (requires manager approval)
- Distance is stored in meters with clock-in record
- Employee receives appropriate message based on validation result

**Status:** ✅ Implemented  
**Implementation:** [attendance.go](backend/handlers/attendance.go) `ClockIn()`  
**Distance Calculation:** [distance.go](backend/utils/distance.go)

---

### US-006: Submit Leave Request
**As an** employee  
**I want to** submit a leave request with start date, end date, and reason  
**So that** I can request time off for approval

**Acceptance Criteria:**
- Form accepts start date, end date, and reason (text)
- Dates are validated (YYYY-MM-DD format)
- Leave request is saved with status = "pending"
- User receives confirmation message
- Form is cleared after successful submission

**Status:** ✅ Implemented  
**Routes:** `POST /api/leave`  
**Components:** [leave-request.component.ts](frontend/src/app/components/leave-request/leave-request.component.ts)

---

## Epic 3: Manager Administrative Features

### US-007: Configure Office Location
**As a** manager  
**I want to** set the office location coordinates and allowed radius  
**So that** the system can validate employee clock-ins based on proximity

**Acceptance Criteria:**
- Manager can input office name (optional)
- Manager can input latitude and longitude coordinates
- Manager can set allowed radius in meters
- Manager can use "Current Location" button to auto-fill coordinates
- Manager can select location from interactive map picker
- System displays current office location with embedded map
- Only one office location is maintained (singleton pattern)
- Settings are persisted to database

**Status:** ✅ Implemented  
**Routes:** `GET /api/admin/office-location`, `POST /api/admin/office-location`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-008: View All Attendance Records
**As a** manager  
**I want to** view all employee attendance records  
**So that** I can monitor attendance patterns and history

**Acceptance Criteria:**
- Display all clock-in records from all employees
- Show employee name, clock-in time, location, distance, and status
- Records include user details (via preloaded relation)
- Records are displayed in a tabular format

**Status:** ✅ Implemented  
**Routes:** `GET /api/admin/records`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-009: View Pending Clock-Ins
**As a** manager  
**I want to** view all pending clock-in requests  
**So that** I can review and approve/reject attendance from employees outside the allowed radius

**Acceptance Criteria:**
- Filter and display only attendance records with status = "pending"
- Show employee name, clock-in time, location, and distance from office
- Records are ordered by clock-in time (most recent first)
- Include employee details for context

**Status:** ✅ Implemented  
**Routes:** `GET /api/admin/pending-clockins`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-010: Approve or Reject Clock-In
**As a** manager  
**I want to** approve or reject pending clock-in requests  
**So that** I can manually validate attendance when employees are outside the allowed radius

**Acceptance Criteria:**
- Manager can approve pending clock-in (status changes to "approved")
- Manager can reject pending clock-in (status changes to "rejected")
- Only pending clock-ins can be updated
- Success/error message is displayed after action
- List refreshes to show updated status

**Status:** ✅ Implemented  
**Routes:** `PATCH /api/admin/clockin/:id`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-011: View All Leave Requests
**As a** manager  
**I want to** view all employee leave requests  
**So that** I can review and manage time-off requests

**Acceptance Criteria:**
- Display all leave requests from all employees
- Show employee name, start date, end date, reason, and status
- Include pending, approved, and rejected requests
- Requests include user details for context

**Status:** ✅ Implemented  
**Routes:** `GET /api/admin/leaves`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-012: Approve or Reject Leave Request
**As a** manager  
**I want to** approve or reject employee leave requests  
**So that** I can manage team availability and time-off

**Acceptance Criteria:**
- Manager can approve leave request (status changes to "approved")
- Manager can reject leave request (status changes to "rejected")
- System validates leave request exists
- Success message is displayed after action
- List refreshes to show updated status

**Status:** ✅ Implemented  
**Routes:** `PATCH /api/admin/leave/:id`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-013: View All Employees
**As a** manager  
**I want to** view a list of all employees in the system  
**So that** I can see who has access and their roles

**Acceptance Criteria:**
- Display all users (employees and managers)
- Show user ID, username, and role
- Role is displayed with visual distinction (badge/tag)
- List is presented in a table format

**Status:** ✅ Implemented  
**Routes:** `GET /api/admin/employees`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-014: Create New Employee
**As a** manager  
**I want to** create new employee accounts  
**So that** new staff can access the system

**Acceptance Criteria:**
- Form accepts username, password (minimum 6 characters), and role
- Username must be unique
- Password is hashed before storage
- Role can be 'employee' or 'manager'
- Success/error message is displayed
- Employee list refreshes after creation

**Status:** ✅ Implemented  
**Routes:** `POST /api/admin/employees`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-015: Update Employee Information
**As a** manager  
**I want to** update employee username, password, or role  
**So that** I can maintain accurate user information

**Acceptance Criteria:**
- Manager can update username (must remain unique)
- Manager can update password (hashed before storage)
- Manager can change role between 'employee' and 'manager'
- All fields are optional (only provided fields are updated)
- System validates employee exists
- Success/error message is displayed

**Status:** ✅ Implemented  
**Routes:** `PUT /api/admin/employees/:id`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

### US-016: Delete Employee
**As a** manager  
**I want to** delete employee accounts  
**So that** I can remove access for staff who have left

**Acceptance Criteria:**
- Manager can delete an employee by ID
- System validates employee exists before deletion
- Confirmation prompt is shown before deletion
- Success/error message is displayed
- Employee list refreshes after deletion

**Status:** ✅ Implemented  
**Routes:** `DELETE /api/admin/employees/:id`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

## Epic 4: Security & Access Control

### US-017: JWT-based Authentication
**As a** system  
**I want to** use JWT tokens for authentication  
**So that** API endpoints are secured and user sessions are stateless

**Acceptance Criteria:**
- JWT token is generated on successful login
- Token includes user ID and role as claims
- Token expires after 24 hours
- Token is sent with all protected API requests
- Invalid/expired tokens are rejected with 401 status

**Status:** ✅ Implemented  
**Implementation:** [jwt.go](backend/auth/jwt.go)

---

### US-018: Role-Based Access Control
**As a** system  
**I want to** restrict manager routes to users with 'manager' role  
**So that** only authorized users can access administrative features

**Acceptance Criteria:**
- Manager routes require valid JWT token
- Manager routes additionally check for role = "manager"
- Non-manager users receive 403 Forbidden error
- Employee users can only access employee routes

**Status:** ✅ Implemented  
**Implementation:** [jwt.go](backend/auth/jwt.go) `ManagerMiddleware()`

---

### US-019: Route Protection with Middleware
**As a** system  
**I want to** protect routes with authentication middleware  
**So that** only logged-in users can access protected endpoints

**Acceptance Criteria:**
- All routes under `/api` (except login/register) require authentication
- Middleware validates JWT token from Authorization header
- User ID and role are extracted and stored in request context
- Invalid tokens return 401 Unauthorized

**Status:** ✅ Implemented  
**Implementation:** [jwt.go](backend/auth/jwt.go) `AuthMiddleware()`

---

### US-020: Frontend Route Guards
**As a** system  
**I want to** protect frontend routes with guards  
**So that** unauthorized users are redirected to login

**Acceptance Criteria:**
- Check for JWT token in localStorage
- Redirect to login page if token is missing
- Allow navigation if token exists
- Role-based routing (employees → /clock-in, managers → /admin)

**Status:** ✅ Implemented  
**Implementation:** [auth.guard.ts](frontend/src/app/auth.guard.ts)

---

## Epic 5: Data Models & Persistence

### US-021: User Data Model
**As a** system  
**I want to** store user information securely  
**So that** authentication and authorization can be performed

**Schema:**
- ID (primary key)
- Username (unique, required)
- PasswordHash (bcrypt hashed, required)
- Role (enum: 'employee' or 'manager', default 'employee')

**Status:** ✅ Implemented  
**Implementation:** [models.go](backend/models/models.go)

---

### US-022: Attendance Data Model
**As a** system  
**I want to** store clock-in records with location and status  
**So that** attendance history can be tracked and validated

**Schema:**
- ID (primary key)
- UserID (foreign key to User)
- ClockInTime (timestamp)
- Latitude (decimal 10,8)
- Longitude (decimal 11,8)
- Status (enum: 'approved', 'pending', 'rejected', default 'approved')
- Distance (decimal 10,2 - distance in meters)
- User relation (preloaded)

**Status:** ✅ Implemented  
**Implementation:** [models.go](backend/models/models.go)

---

### US-023: Leave Request Data Model
**As a** system  
**I want to** store leave requests with dates and approval status  
**So that** time-off can be managed and tracked

**Schema:**
- ID (primary key)
- UserID (foreign key to User)
- StartDate (date)
- EndDate (date)
- Reason (text)
- Status (enum: 'pending', 'approved', 'rejected', default 'pending')
- User relation

**Status:** ✅ Implemented  
**Implementation:** [models.go](backend/models/models.go)

---

### US-024: Office Location Data Model
**As a** system  
**I want to** store office location settings  
**So that** proximity validation can be performed

**Schema:**
- ID (primary key)
- Latitude (decimal 10,8)
- Longitude (decimal 11,8)
- AllowedRadiusMeters (decimal, default 100)
- Name (varchar 255, optional)

**Note:** Singleton pattern - only ID=1 is used

**Status:** ✅ Implemented  
**Implementation:** [models.go](backend/models/models.go)

---

### US-025: Database Auto-Migration
**As a** system  
**I want to** automatically create/update database schema on startup  
**So that** database structure stays in sync with code

**Acceptance Criteria:**
- GORM auto-migration runs on application startup
- All models are migrated
- Existing data is preserved
- Foreign key constraints are created

**Status:** ✅ Implemented  
**Implementation:** [main.go](backend/main.go)

---

## Epic 6: Geolocation & Distance Calculation

### US-026: Haversine Distance Calculation
**As a** system  
**I want to** calculate accurate distance between two GPS coordinates  
**So that** proximity validation is reliable

**Acceptance Criteria:**
- Uses Haversine formula for spherical distance
- Inputs: two sets of latitude/longitude coordinates
- Output: distance in meters
- Accounts for Earth's curvature

**Status:** ✅ Implemented  
**Implementation:** [distance.go](backend/utils/distance.go)

---

### US-027: Browser Geolocation Integration
**As an** employee  
**I want to** automatically get my current location from the browser  
**So that** I don't need to manually enter coordinates

**Acceptance Criteria:**
- Request browser geolocation permission
- Handle permission granted/denied scenarios
- Display current coordinates to user
- Show loading state while fetching location
- Display error message if location unavailable

**Status:** ✅ Implemented  
**Implementation:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts)

---

### US-028: Map Visualization
**As a** user  
**I want to** see my location or office location on a map  
**So that** I can visually confirm the location data

**Acceptance Criteria:**
- Embedded map displays location marker
- Map is interactive (zoom, pan)
- Uses Google Maps embed or similar
- Works for both clock-in and office location settings

**Status:** ✅ Implemented  
**Components:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts), [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

## Epic 7: System Configuration

### US-029: Environment-Based Configuration
**As a** system  
**I want to** load configuration from environment variables  
**So that** different environments (dev, prod) can use different settings

**Configuration:**
- Database credentials (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
- JWT secret key (JWT_SECRET)
- Defaults provided for development
- Supports .env file via godotenv

**Status:** ✅ Implemented  
**Implementation:** [db.go](backend/database/db.go), [jwt.go](backend/auth/jwt.go)

---
1  
**Implemented:** 31 (100%)  
**Pending:** 0  

**Epics Breakdown:**
1. ✅ Authentication & Authorization - 4 stories (100%)
2. ✅ Employee Attendance Features - 4 stories (100%)
3. ✅ Manager Administrative Features - 10 stories (100%)
4. ✅ Security & Access Control - 4 stories (100%)
5. ✅ Data Models & Persistence - 5 stories (100%)
6. ✅ Geolocation & Distance Calculation - 3 stories (100%)
7. ✅ System Configuration - 2 stories (100%)

**Features by Priority:**
- **Critical (Must-Have):** 19
---

## Summary Statistics

**Total User Stories:** 30  
**Implemented:** 30 (100%)  
**Pending:** 0  

**Epics Breakdown:**
1. ✅ Authentication & Authorization - 4 stories (100%)
2. ✅ Employee Attendance Features - 3 stories (100%)
3. ✅ Manager Administrative Features - 10 stories (100%)
4. ✅ Security & Access Control - 4 stories (100%)
5. ✅ Data Models & Persistence - 5 stories (100%)
6. ✅ Geolocation & Distance Calculation - 3 stories (100%)
7. ✅ System Configuration - 2 stories (100%)

**Features by Priority:**
- **Critical (Must-Have):** 18 stories - All implemented ✅
- **Important (Should-Have):** 8 stories - All implemented ✅
- **Nice-to-Have:** 4 stories - All implemented ✅

---

## Technical Stack

**Backend:**
- Go (Gin framework)
- GORM (MySQL)
- JWT authentication
- bcrypt password hashing

**Frontend:**
- Angular 16
- TailwindCSS
- Browser Geolocation API
- Reactive Forms

**Database:**
- MySQL

**Security:**
- JWT tokens (24h expiry)
- Role-based access control
- Password hashing (bcrypt)
- CORS protection

---

## Default Credentials

**Admin User (auto-seeded):**
- Username: `admin`
- Password: `admin123`
- Role: `manager`

---

## Notes for Future Features

This document can be extended with additional user stories as new features are requested. Please add new stories following the same format:

```markdown
### US-XXX: Feature Title
**As a** [role]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- Criterion 1
- Criterion 2

**Status:** 🔄 Planned / ✅ Implemented  
**Priority:** Critical / Important / Nice-to-Have  
**Routes:** API endpoints  
**Componoffice-location` | GET | View Office Location | US-031 |
| `/api/ents:** Frontend components
```

---

## Appendix A: Feature Mapping

### Backend Routes Summary
| Route | Method | Feature | User Story |
|-------|--------|---------|------------|
| `/api/login` | POST | User Login | US-001 |
| `/api/register` | POST | User Registration | US-002 |
| `/api/clock-in` | POST | Employee Clock-In | US-004, US-005 |
| `/api/leave` | POST | Leave Request | US-006 |
| `/api/admin/records` | GET | All Attendance Records | US-008 |
| `/api/admin/leaves` | GET | All Leave Requests | US-011 |
| `/api/admin/leave/:id` | PATCH | Update Leave Status | US-012 |
| `/api/admin/pending-clockins` | GET | Pending Clock-Ins | US-009 |
| `/api/admin/clockin/:id` | PATCH | Update Clock-In Status | US-010 |
| `/api/admin/office-location` | GET/POST | Office Location Config | US-007 |
| `/api/admin/employees` | GET/POST | Employee Management | US-013, US-014 |
| `/api/admin/employees/:id` | PUT/DELETE | Employee Update/Delete | US-015, US-016 |

### Frontend Components Summary
| Component | Features | User Stories |
|-----------|----------|--------------|
| `login.component.ts` | User authentication | US-001 |
| `clock-in.component.ts` | Geolocation clock-in | US-004, US-027, US-028 |
| `leave-request.component.ts` | Leave request submission | US-006 |
| `manager-dashboard.component.ts` | All manager features | US-007-016, US-028 |
| `auth.guard.ts` | Route protection | US-020 |
| `api.service.ts` | API communication | All API-based stories |

### Database Tables Summary
| Table | Model | User Stories |
|-------|-------|--------------|
| `users` | User | US-001, US-002, US-021 |
| `attendances` | Attendance | US-004, US-005, US-022 |
| `leave_requests` | LeaveRequest | US-006, US-023 |
| `office_locations` | OfficeLocation | US-007, US-024 |

---

## Appendix B: Testing Checklist

### Authentication Tests
- [ ] Login with valid credentials (employee)
- [ ] Login with valid credentials (manager)
- [ ] Login with invalid credentials
- [ ] JWT token expiry after 24 hours
- [ ] Access protected routes without token
- [ ] Access manager routes as employee

### Employee Features Tests
- [ ] Clock-in within allowed radius (auto-approved)
- [ ] Clock-in outside allowed radius (pending)
- [ ] Clock-in without geolocation permission
- [ ] Submit leave request with valid dates
- [ ] Submit leave request with invalid dates
- [ ] View location on map

### Manager Features Tests
- [ ] Configure office location
- [ ] View all attendance records
- [ ] View pending clock-ins
- [ ] Approve pending clock-in
- [ ] Reject pending clock-in
- [ ] View all leave requests
- [ ] Approve leave request
- [ ] Reject leave request
- [ ] Create new employee
- [ ] Update employee information
- [ ] Delete employee
- [ ] View employee list

### System Tests
- [ ] Database auto-migration on startup
- [ ] Admin user seeding on first run
- [ ] CORS for allowed origins
- [ ] Distance calculation accuracy
- [ ] Environment variable configuration

---

## Appendix C: API Documentation Quick Reference

### Authentication Endpoints

**POST /api/login**
```json
Request:
{
  "username": "string",
  "password": "string"
}

Response:
{
  "token": "jwt_token_string",
  "role": "employee|manager"
}
```

**POST /api/register**
```json
Request:
{
  "username": "string",
  "password": "string",
  "role": "employee|manager" // optional, defaults to employee
}

Response:
{
  "message": "User registered successfully"
}
```

### Employee Endpoints

**POST /api/clock-in** (Requires Auth)
```json
Request:
{
  "latitude": 0.0,
  "longitude": 0.0
}

Response:
{
  "message": "string",
  "data": {...attendance object},
  "distance_meters": 0.0,
  "status": "approved|pending",
  "needs_approval": boolean
}
```

**POST /api/leave** (Requires Auth)
```json
Request:
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-05",
  "reason": "string"
}

Response:
{
  "message": "Leave request submitted",
  "data": {...leave object}
}
```

### Manager Endpoints (Require Auth + Manager Role)

**GET /api/admin/records**
```json
Response:
{
  "data": [{...attendance objects with user info}]
}
```

**GET /api/admin/pending-clockins**
```json
Response:
{
  "data": [{...pending attendance objects}]
}
```

**PATCH /api/admin/clockin/:id**
```json
Request:
{
  "status": "approved|rejected"
}

Response:
{
  "message": "Clock-in status updated successfully",
  "data": {...updated attendance}
}
```

**GET /api/admin/leaves**
```json
Response:
{
  "data": [{...leave request objects}]
}
```

**PATCH /api/admin/leave/:id**
```json
Request:
{
  "status": "approved|rejected"
}

Response:
{
  "message": "Leave status updated",
  "data": {...updated leave}
}
```

**GET /api/admin/office-location**
```json
Response:
{
  "data": {
    "latitude": 0.0,
    "longitude": 0.0,
    "allowed_radius_meters": 100.0,
    "name": "string"
  }
}
```

**POST /api/admin/office-location**
```json
Request:
{
  "latitude": 0.0,
  "longitude": 0.0,
  "allowed_radius_meters": 100.0,
  "name": "string" // optional
}

Response:
{
  "message": "Office location saved successfully",
  "data": {...office location}
}
```

**GET /api/admin/employees**
```json
Response:
{
  "data": [{...user objects}]
}
```

**POST /api/admin/employees**
```json
Request:
{
  "username": "string",
  "password": "string",
  "role": "employee|manager"
}

Response:
{
  "message": "Employee created successfully",
  "data": {...user object}
}
```

**PUT /api/admin/employees/:id**
```json
Request:
{
  "username": "string", // optional
  "password": "string", // optional
  "role": "employee|manager" // optional
}

Response:
{
  "message": "Employee updated successfully",
  "data": {...updated user}
}
```

**DELETE /api/admin/employees/:id**
```json
Response:
{
  "message": "Employee deleted successfully"
}
```
