# Field Attendance System - User Stories

**Version:** 3.1  
**Last Updated:** February 2, 2026  
**Project:** Field Attendance System  
**Status:** In Development

## Overview
This document lists all implemented and planned features of the Field Attendance System organized as user stories. The system provides geolocation-based attendance tracking with automatic proximity validation and manager approval workflows.

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 3.1 | Feb 2, 2026 | Added US-067 (dedicated office management page), updated multi-office to 1-4 offices | Product Team |
| 3.0 | Feb 1, 2026 | Added 23 new planned stories (US-044 to US-066) for Reporting, Multi-Office, and Leave Management | Product Team |
| 2.1 | Jan 31, 2026 | Added US-043 (expandable/collapsible dashboard cards) | Product Team |
| 2.0 | Jan 31, 2026 | Added 9 new stories (US-033 to US-041) for clock-in time, employee status, and daily dashboard | Product Team |
| 1.2 | Jan 31, 2026 | Added US-032 (full name field support) | Product Team |
| 1.1 | Jan 31, 2026 | Added US-031 (employee view office location) | Product Team |
| 1.0 | Jan 31, 2026 | Initial release - 30 user stories documented | Product Team |

## Progress Summary

- **Total User Stories:** 67
- **Completed:** 40 (60%)
- **Partially Completed:** 1 (1%) - US-031 (Backend ready, UI display missing)
- **Backend Only (No UI):** 2 (3%) - US-011, US-012 (Leave management UI missing)
- **In Progress:** 0
- **Planned:** 24 (36%)
- **Blocked:** 0

---

## Quick Reference - User Stories by Role

### 👤 Employee Features (19 stories)
- [x] [**US-001**](#us-001-user-login) - User can log in to the system with username and password to access role-specific features
- [x] [**US-004**](#us-004-clock-in-with-geolocation) - Employee can clock in using GPS location to automatically record attendance with location verification
- [x] [**US-005**](#us-005-automatic-proximity-validation) - System automatically validates employee location and approves/pends attendance based on proximity to office
- [x] [**US-006**](#us-006-submit-leave-request) - Employee can submit leave requests with start date, end date, and reason for manager approval
- [x] [**US-027**](#us-027-browser-geolocation-integration) - Employee can use browser geolocation to automatically capture current location without manual entry
- [x] [**US-028**](#us-028-map-visualization) - Employee can view their location on an interactive map to visually confirm location data
- [ ] [**US-031**](#us-031-employee-view-office-location) - Employee can view office location settings to see where they need to be for attendance approval (⚠️ Partially Implemented - Backend ✅, UI Display ❌)
- [x] [**US-035**](#us-035-employee-view-todays-attendance-status) - Employee can view their attendance record for today to check their status
- [x] [**US-036**](#us-036-employee-see-attendance-time-status) - Employee can see if they are on time, late, or pending approval for today's attendance
- [x] [**US-037**](#us-037-employee-see-todays-leave-status) - Employee can see their leave status for today (approved, pending, or not on leave)
- [x] [**US-038**](#us-038-employee-see-absence-pending-status) - Employee can see if they are marked absent pending approval
- [ ] [**US-044**](#us-044-employee-view-personal-attendance-history) - Employee can view attendance history for past periods to track performance
- [ ] [**US-045**](#us-045-employee-optional-clock-out) - Employee can optionally clock out at end of day to track work hours
- [ ] [**US-046**](#us-046-employee-view-leave-balance) - Employee can view remaining leave balance by type to plan time off
- [ ] [**US-047**](#us-047-employee-submit-leave-with-type) - Employee can submit leave requests with specific leave type (annual, sick, etc.)
- [ ] [**US-048**](#us-048-employee-view-work-hours-summary) - Employee can view total work hours for current month
- [ ] [**US-049**](#us-049-employee-view-location-history) - Employee can view their clock-in locations on map for past records
- [ ] [**US-050**](#us-050-employee-see-assigned-office) - Employee can see which office locations they can clock in from
- [ ] [**US-051**](#us-051-employee-browser-notification-reminder) - Employee receives browser notification if not clocked in by official time

### 👨‍💼 Manager Features (32 stories)
- [x] [**US-001**](#us-001-user-login) - Manager can log in to the system with username and password to access administrative features
- [x] [**US-007**](#us-007-configure-office-location) - Manager can configure office location coordinates and allowed radius for attendance validation
- [x] [**US-008**](#us-008-view-all-attendance-records) - Manager can view all employee attendance records to monitor attendance patterns and history
- [x] [**US-009**](#us-009-view-pending-clock-ins) - Manager can view pending clock-in requests to review attendance from employees outside allowed radius
- [x] [**US-010**](#us-010-approve-or-reject-clock-in) - Manager can approve or reject pending clock-in requests for manual attendance validation
- [ ] [**US-011**](#us-011-view-all-leave-requests) - Manager can view all employee leave requests to review and manage time-off requests (⚠️ Backend Only - UI Missing)
- [ ] [**US-012**](#us-012-approve-or-reject-leave-request) - Manager can approve or reject leave requests to manage team availability and time-off (⚠️ Backend Only - UI Missing)
- [x] [**US-013**](#us-013-view-all-employees) - Manager can view a list of all employees to see who has system access and their roles
- [x] [**US-014**](#us-014-create-new-employee) - Manager can create new employee accounts to provide system access for new staff
- [x] [**US-015**](#us-015-update-employee-information) - Manager can update employee information including username, password, or role
- [x] [**US-016**](#us-016-delete-employee) - Manager can delete employee accounts to remove access for staff who have left
- [x] [**US-028**](#us-028-map-visualization) - Manager can view office location on an interactive map to visually confirm office location settings
- [x] [**US-033**](#us-033-manager-set-clock-in-time) - Manager can set official clock-in time to determine late arrivals
- [x] [**US-039**](#us-039-manager-view-daily-attendance-dashboard) - Manager can view daily attendance dashboard showing today's status for all employees
- [x] [**US-040**](#us-040-manager-see-employees-who-clocked-in) - Manager can see which employees have clocked in today (on time or late)
- [x] [**US-041**](#us-041-manager-see-employees-on-leave) - Manager can see which employees are on approved leave for today
- [x] [**US-042**](#us-042-manager-see-absent-employees) - Manager can see which employees are absent (haven't clocked in and not on leave)
- [x] [**US-043**](#us-043-expandablecollapsible-dashboard-cards) - Manager can expand/collapse dashboard cards to manage screen space efficiently
- [ ] [**US-052**](#us-052-manager-generate-monthly-attendance-report) - Manager can generate comprehensive monthly attendance reports
- [ ] [**US-053**](#us-053-manager-export-attendance-data) - Manager can export attendance data to Excel/CSV format
- [ ] [**US-054**](#us-054-manager-view-employee-performance-metrics) - Manager can view individual employee attendance performance metrics
- [ ] [**US-055**](#us-055-manager-view-location-tracking-report) - Manager can view employee location tracking and patterns report
- [ ] [**US-056**](#us-056-manager-configure-leave-types) - Manager can configure different leave types and annual quotas
- [ ] [**US-057**](#us-057-manager-view-leave-balance-report) - Manager can view all employees' leave balances by type
- [ ] [**US-058**](#us-058-manager-manage-multiple-offices) - Manager can create and manage 1-4 office locations
- [ ] [**US-059**](#us-059-manager-assign-employees-to-office) - Manager can assign employees to specific office locations
- [ ] [**US-060**](#us-060-manager-view-office-specific-reports) - Manager can filter reports by office location
- [ ] [**US-061**](#us-061-manager-view-pending-approvals-notification) - Manager sees browser notification for pending approvals
- [ ] [**US-062**](#us-062-manager-view-work-hours-report) - Manager can view total work hours report for all employees
- [ ] [**US-063**](#us-063-manager-set-leave-balance-per-employee) - Manager can manually adjust leave balance for specific employees
- [ ] [**US-067**](#us-067-manager-dedicated-office-management-page) - Manager has dedicated page for comprehensive office management

### ⚙️ System Features (16 stories)
- [x] [**US-002**](#us-002-user-registration) - System provides API for user registration to add new employees and managers
- [x] [**US-003**](#us-003-default-admin-user) - System automatically creates default admin account on first startup for initial setup
- [x] [**US-017**](#us-017-jwt-based-authentication) - System uses JWT tokens for authentication to secure API endpoints with stateless sessions
- [x] [**US-018**](#us-018-role-based-access-control) - System restricts manager routes based on user role to protect administrative features
- [x] [**US-019**](#us-019-route-protection-with-middleware) - System protects routes with authentication middleware to ensure only logged-in users can access endpoints
- [x] [**US-020**](#us-020-frontend-route-guards) - System protects frontend routes with guards to redirect unauthorized users to login
- [x] [**US-021**](#us-021-user-data-model) - System stores user information securely for authentication and authorization
- [x] [**US-022**](#us-022-attendance-data-model) - System stores clock-in records with location and status for attendance tracking
- [x] [**US-023**](#us-023-leave-request-data-model) - System stores leave requests with dates and approval status for time-off management
- [x] [**US-024**](#us-024-office-location-data-model) - System stores office location settings for proximity validation
- [x] [**US-025**](#us-025-database-auto-migration) - System automatically creates and updates database schema on startup
- [x] [**US-026**](#us-026-haversine-distance-calculation) - System calculates accurate distance between GPS coordinates using Haversine formula
- [x] [**US-029**](#us-029-environment-based-configuration) - System loads configuration from environment variables for different deployment environments
- [x] [**US-030**](#us-030-cors-configuration) - System allows cross-origin requests from frontend for proper communication
- [x] [**US-032**](#us-032-employee-full-name-support) - System stores employee full names in addition to usernames for better identification
- [x] [**US-034**](#us-034-system-calculate-late-arrival) - System calculates if employee is late based on configured clock-in time
- [ ] [**US-064**](#us-064-system-calculate-work-hours) - System calculates work hours between clock-in and clock-out times
- [ ] [**US-065**](#us-065-system-multi-manager-access-control) - System allows managers to handle 1-4 offices with proper access control
- [ ] [**US-066**](#us-066-system-browser-notification-api) - System uses browser Notification API for employee reminders
- [x] [**US-032**](#us-032-employee-full-name-support) - System stores employee full names in addition to usernames for better identification
- [x] [**US-034**](#us-034-system-calculate-late-arrival) - System calculates if employee is late based on configured clock-in time

---
2: Employee Attendance Features

### US-031: Employee View Office Location
**As an** employee  
**I want to** view the configured office location settings  
**So that** I know where I need to be for my attendance to be automatically approved

**Acceptance Criteria:**
- [x] Employee can access office location information via API
- [x] Backend endpoint returns office name, coordinates, allowed radius, and clock-in time
- [x] Authentication required for this endpoint (uses employee token)
- [x] Data is loaded in clock-in component for distance calculation
- [ ] **INCOMPLETE:** Display office location information visibly in employee UI
- [ ] **INCOMPLETE:** Show office name, coordinates, and allowed radius to employee
- [ ] **INCOMPLETE:** Help employee understand proximity requirements before clock-in

**Status:** ⚠️ Partially Implemented (Backend ✅, Frontend UI Display ❌)  
**Routes:** `GET /api/office-location`  
**Components:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts)  
**Implementation Details:**
- ✅ Backend: `GetOfficeLocation()` handler in [office.go](backend/handlers/office.go) returns office data
- ✅ Frontend Service: `getOfficeLocation()` method in [api.service.ts](frontend/src/app/services/api.service.ts)
- ✅ Data Loading: Clock-in component loads office location via `loadOfficeLocation()`
- ✅ Internal Use: Data used for distance calculation and validation
- ❌ **Missing UI Display:** Office location information not shown to employees in the UI
- ❌ Employees cannot see office name, coordinates, radius, or clock-in time

**What Works:**
- Employee API call successfully retrieves office location data
- Distance from office is calculated and shown in confirmation dialog when outside radius
- Office location data is used internally for proximity validation

**What's Missing:**
- No visible information card showing office location details to employees
- Employees cannot proactively see where they need to be before attempting clock-in
- No display of office name, exact coordinates, allowed radius, or official clock-in time

**To Complete:**
Add an information card in the clock-in page template that displays:
```
📍 Office Location Information
- Office Name: [name]
- Coordinates: [latitude], [longitude]
- Allowed Radius: [radius] meters
- Official Clock-In Time: [clock_in_time]
- Your Distance: [calculated on location capture]
```

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

### US-035: Employee View Today's Attendance Status
**As an** employee  
**I want to** view my attendance record for today  
**So that** I can check if I have clocked in and see my current status

**Acceptance Criteria:**
- Employee can access their today's attendance record
- Display shows clock-in time if already clocked in
- Shows "Not Clocked In" if employee hasn't clocked in yet
- Display includes distance from office and location coordinates
- Shows approval status (approved, pending, rejected)
- Easy to access from employee dashboard

**Status:** ✅ Implemented  
**Priority:** Important  
**Depends On:** US-034  
**Routes:** `GET /api/my-attendance/today`  
**Components:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts)  
**Technical Details:**
- Backend filters attendance records by user ID and today's date
- Returns single record with all fields including is_late and minutes_late
- Frontend displays status card with color-coded badges
- Shows late status with red badge when applicable

---

### US-036: Employee See Attendance Time Status
**As an** employee  
**I want to** see if I am on time or late for today's attendance  
**So that** I know my attendance compliance status

**Acceptance Criteria:**
- System compares clock-in time with configured office time
- Display shows "On Time" if clocked in before or at official time
- Display shows "Late" with minutes/hours late if after official time
- Shows "Pending Approval" if attendance is pending manager review
- Status is clearly visible with color coding (green/yellow/red)
- Works in conjunction with today's attendance view

**Status:** ✅ Implemented  
**Priority:** Important  
**Depends On:** US-033, US-035  
**Implementation:** Integrated with clock-in component showing late status with color coding

---

### US-037: Employee See Today's Leave Status
**As an** employee  
**I want to** see my leave status for today  
**So that** I know if my time off has been approved or is still pending

**Acceptance Criteria:**
- System checks if today falls within any leave request date range
- Display shows "On Approved Leave" if leave is approved for today
- Display shows "Leave Pending" if leave request is pending approval
- Display shows "Not on Leave" if no leave request for today
- Shows leave reason and date range
- Integrated with today's status dashboard

**Status:** ✅ Implemented  
**Priority:** Important  
**Routes:** `GET /api/my-leave/today`  
**Components:** [clock-in.component.ts](frontend/src/app/components/clock-in/clock-in.component.ts)  
**Technical Details:**
- Backend uses SQL date range query: "? BETWEEN start_date AND end_date"
- Checks both approved and pending leave requests
- Frontend displays status card with green (approved) or yellow (pending) badges
- Shows leave reason and full date range for context

---

### US-038: Employee See Absence Pending Status
**As an** employee  
**I want to** see if I'm marked as absent pending approval  
**So that** I understand my attendance status when I haven't clocked in from office location

**Acceptance Criteria:**
- System shows "Absent - Pending Approval" if employee has pending clock-in from outside radius
- Shows "Absent" if employee hasn't clocked in and it's past official time
- Shows "On Leave" if employee has approved leave for today
- Shows "Clocked In" if attendance is recorded and approved
- Clear messaging about what action is needed (if any)

**Status:** ✅ Implemented  
**Priority:** Important  
**Depends On:** US-035, US-036, US-037  
**Implementation:** Integrated with today's status display in clock-in component

---

## Epic 2 (continued): Employee Attendance Features

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

## Epic 3: Time & Schedule Management

### US-033: Manager Set Clock-In Time
**As a** manager  
**I want to** set the official clock-in time for the office  
**So that** the system can determine if employees are late

**Acceptance Criteria:**
- Manager can set official clock-in time (e.g., 09:00 AM)
- Time is stored in office settings (related to OfficeLocation)
- Only one official time is maintained (can be updated)
- Time format is HH:MM (24-hour format)
- Setting is used to calculate late arrivals
- Default time can be set during initial setup

**Status:** ✅ Implemented  
**Priority:** Critical  
**Routes:** Integrated with `POST /api/admin/office-location`, `GET /api/office-location`  
**Data Model:** Added `clock_in_time` field (VARCHAR(5)) to OfficeLocation model

---

### US-034: System Calculate Late Arrival
**As a** system  
**I want to** automatically calculate if an employee is late based on clock-in time  
**So that** attendance compliance can be tracked accurately

**Acceptance Criteria:**
- System retrieves configured clock-in time from settings
- Compares actual clock-in time with official time
- Calculates minutes/hours late
- Stores late status with attendance record
- Late calculation considers only time, not date
- Grace period can be configured (optional: e.g., 5 minutes)

**Status:** ✅ Implemented  
**Priority:** Critical  
**Depends On:** US-033  
**Implementation:** [attendance.go](backend/handlers/attendance.go) - ClockIn function with time comparison logic  
**Data Model:** Added `is_late` (boolean) and `minutes_late` (integer) to Attendance model  
**Technical Details:**
- Parses office clock_in_time using Go time.Parse("15:04")
- Compares with actual clock-in time from attendance record
- Automatically calculates minute difference when late
- Both fields stored in database for historical tracking

---

## Epic 4: Manager Administrative Features

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
- [x] Backend endpoint returns all leave requests with user details
- [ ] **MISSING:** Frontend method to fetch leave requests (`getAllLeaveRequests()` in api.service.ts)
- [ ] **MISSING:** UI section in manager dashboard to display leave requests
- [ ] **MISSING:** Table showing employee name, start date, end date, reason, and status
- [ ] **MISSING:** Display pending, approved, and rejected requests

**Status:** ⚠️ Backend Only (No UI)  
**Routes:** `GET /api/admin/leaves` ✅ (Backend ready)  
**Backend:** [admin.go](backend/handlers/admin.go) - `GetAllLeaveRequests()` ✅  
**Frontend:** ❌ Not implemented  

**What Works:**
- ✅ Backend API endpoint exists and returns all leave requests
- ✅ Leave data includes user details via Preload("User")

**What's Missing:**
- ❌ No `getAllLeaveRequests()` method in `api.service.ts`
- ❌ No Leave Requests section in manager dashboard
- ❌ No UI table/list to display leave requests
- ❌ Manager cannot see leave requests in the dashboard

**To Complete:**
1. Add `getAllLeaveRequests()` method to api.service.ts
2. Add Leave Requests section to manager-dashboard.component.ts
3. Create table showing all leave requests with status badges
4. Make section expandable/collapsible like other dashboard cards
5. Add refresh functionality

---

### US-012: Approve or Reject Leave Request
**As a** manager  
**I want to** approve or reject employee leave requests  
**So that** I can manage team availability and time-off

**Acceptance Criteria:**
- [x] Backend validates leave request exists
- [x] Backend updates status to "approved" or "rejected"
- [x] API method exists in frontend service
- [ ] **MISSING:** UI buttons to approve/reject leave requests
- [ ] **MISSING:** Leave request list/table in manager dashboard
- [ ] **MISSING:** Success message display
- [ ] **MISSING:** List refresh after status update

**Status:** ⚠️ Backend Only (No UI)  
**Routes:** `PATCH /api/admin/leave/:id` ✅ (Backend ready)  
**Backend:** [admin.go](backend/handlers/admin.go) - `UpdateLeaveStatus()` ✅  
**API Service:** [api.service.ts](frontend/src/app/services/api.service.ts) - `updateLeaveStatus()` ✅  
**Frontend UI:** ❌ Not implemented  

**What Works:**
- ✅ Backend endpoint for updating leave status
- ✅ API service method `updateLeaveStatus(id, status)` exists
- ✅ Backend validates leave request exists
- ✅ Backend returns success message

**What's Missing:**
- ❌ No Leave Requests section in manager dashboard UI
- ❌ No approve/reject buttons in the interface
- ❌ Manager cannot actually approve/reject leaves through UI
- ❌ No visual feedback when status changes
- ❌ Depends on US-011 implementation first

**To Complete:**
1. Implement US-011 first (display leave requests)
2. Add Approve/Reject buttons to each leave request row
3. Call `updateLeaveStatus()` on button click
4. Show success/error messages
5. Refresh leave requests list after update
6. Add confirmation dialog for reject action

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
- Form accepts username, full name (optional), password (minimum 6 characters), and role
- Username must be unique
- Full name can be provided for better employee identification
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
**I want to** update employee username, full name, password, or role  
**So that** I can maintain accurate user information

**Acceptance Criteria:**
- Manager can update username (must remain unique)
- Manager can update full name for better identification
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

### US-043: Expandable/Collapsible Dashboard Cards
**As a** manager  
**I want to** expand and minimize dashboard cards (except today's insight)  
**So that** I can focus on relevant information and manage screen space efficiently

**Acceptance Criteria:**
- All dashboard cards except "Today Insight" can be expanded/collapsed
- Expand/collapse state is indicated by an icon (chevron/arrow)
- Click on card header to toggle expand/collapse
- Collapsed cards show only the header/title
- Expanded cards show full content
- State persists during current session (optional: save preference to localStorage)
- Smooth animation when expanding/collapsing
- Default state: all cards expanded
- Responsive behavior on mobile devices

**Status:** ✅ Implemented  
**Priority:** Nice-to-Have  
**Type:** UI/UX Enhancement  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

---

## Epic 5: Daily Attendance Dashboard

### US-039: Manager View Daily Attendance Dashboard
**As a** manager  
**I want to** view a daily attendance dashboard for today  
**So that** I can see at-a-glance which employees are present, late, absent, or on leave

**Acceptance Criteria:**
- Dashboard shows all employees under manager's supervision
- Display defaults to today's date
- Shows summary counts: Total employees, Present, Late, On Leave, Absent
- Table view with employee name, status, clock-in time (if applicable)
- Status categories: "Present (On Time)", "Present (Late)", "On Leave", "Absent"
- Auto-refreshes or has manual refresh button
- Can be filtered by status category

**Status:** ✅ Implemented  
**Priority:** Critical  
**Depends On:** US-033, US-034  
**Routes:** `GET /api/admin/daily-attendance`  
**Components:** [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)  
**Implementation:** [admin.go](backend/handlers/admin.go) - GetDailyAttendanceDashboard function  
**Technical Details:**
- Aggregates data from Users, Attendance, and LeaveRequests tables
- Creates status map categorizing each employee as: present_ontime, present_late, on_leave, or absent
- Includes summary statistics in response header
- Frontend displays 4 color-coded summary cards with gradient backgrounds
- Shows detailed employee list for each category in expandable sections

---

### US-040: Manager See Employees Who Clocked In
**As a** manager  
**I want to** see which employees have clocked in today  
**So that** I can monitor attendance in real-time

**Acceptance Criteria:**
- List shows all employees who have clocked in for today
- Displays clock-in time for each employee
- Shows if employee is on time or late (with minutes late)
- Shows approval status (approved/pending/rejected)
- Displays distance from office location
- Sorted by clock-in time (earliest first)
- Includes employee full name and username

**Status:** ✅ Implemented  
**Priority:** Important  
**Depends On:** US-039  
**Implementation:** Integrated with daily attendance dashboard  
**Technical Details:**
- Present employees shown in two separate lists: On Time and Late
- On Time list shows employees with is_late = false
- Late list shows employees with is_late = true and displays minutes_late
- Each entry includes full name, clock-in time, and status badge
- Color coding: Green for on-time, Yellow for late
- Data sourced from present_ontime and present_late arrays in dashboard response

---

### US-041: Manager See Employees On Leave
**As a** manager  
**I want to** see which employees are on approved leave for today  
**So that** I can account for planned absences

**Acceptance Criteria:**
- List shows all employees with approved leave for today
- Displays leave date range (start and end date)
- Shows leave reason
- Only shows approved leaves (not pending or rejected)
- Clearly distinguishes from absent employees
- Shows total count of employees on leave

**Status:** ✅ Implemented  
**Priority:** Important  
**Depends On:** US-039  
**Implementation:** Integrated with daily attendance dashboard  
**Technical Details:**
- Backend filters for approved leave requests where today falls within date range
- Returns employee name, leave reason, start_date, and end_date
- Frontend displays in dedicated "On Leave" section with blue color coding
- Shows leave duration and reason for each employee
- Count displayed in summary card at top of dashboard
- Excludes pending or rejected leave requests from display

---

### US-042: Manager See Absent Employees
**As a** manager  
**I want to** see which employees are absent (haven't clocked in and not on leave)  
**So that** I can follow up on unplanned absences

**Acceptance Criteria:**
- List shows employees who haven't clocked in for today
- Excludes employees on approved leave
- Shows last attendance date for context
- Updates in real-time as employees clock in
- Shows total count of absent employees
- Allows manager to contact or mark employee
- Clear distinction between "Not Yet Clocked In" (early morning) vs "Absent" (past official time)

**Status:** ✅ Implemented  
**Priority:** Critical  
**Depends On:** US-039, US-033  
**Implementation:** Integrated with daily attendance dashboard  
**Technical Details:**
- Backend identifies absent employees by process of elimination:
  - Gets all employees from database
  - Removes those who clocked in today
  - Removes those on approved leave today
  - Remaining employees are marked absent
- Frontend displays in dedicated "Absent" section with red color coding
- Shows employee full name for each absent person
- Count displayed in summary card at top of dashboard
- List updates dynamically as employees clock in during the day

---

## Epic 6: Reporting & Analytics (New - Planned)

### US-044: Employee View Personal Attendance History
**As an** employee  
**I want to** view my attendance history for the past 30, 60, or 90 days  
**So that** I can track my attendance record and identify patterns

**Acceptance Criteria:**
- Employee can select time period (30/60/90 days or custom date range)
- Display list of all attendance records with date, clock-in time, status
- Show late arrivals with minutes late
- Display location distance from office
- Include summary metrics: total days, on-time %, late %
- Optional: Chart/graph visualization of attendance patterns
- Can filter by status (approved, pending, rejected)

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 3-5 days  
**Routes (Proposed):** `GET /api/my-attendance/history?period=30|60|90&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

---

### US-045: Employee Optional Clock-Out
**As an** employee  
**I want to** optionally clock out at the end of my work day with geolocation  
**So that** my total work hours can be tracked accurately

**Acceptance Criteria:**
- Clock-out button available after employee has clocked in
- Captures clock-out time and location (lat/long)
- Validates location against office radius (optional - can clock out from anywhere)
- Cannot clock out without first clocking in
- Can only clock out once per day
- Displays confirmation message after successful clock-out
- Shows calculated work hours after clock-out

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Work Hours Tracking  
**Estimated Effort:** 2-3 days  
**Routes (Proposed):** `POST /api/clock-out`  
**Technical Notes:**
- Add to Attendance model: `clock_out_time`, `clock_out_latitude`, `clock_out_longitude`, `work_hours_decimal`
- Calculate work hours as difference between clock-in and clock-out
- Optional: Support half-day if clock-out before certain time

---

### US-046: Employee View Leave Balance
**As an** employee  
**I want to** view my remaining leave balance by leave type  
**So that** I can plan my time off effectively

**Acceptance Criteria:**
- Display leave balance for each leave type (annual, sick, emergency, etc.)
- Show total allocated days and remaining days
- Display used days for current year
- Show pending leave requests that would affect balance
- Update in real-time when leave is approved
- Clear visual representation (progress bars or charts)

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Leave Management  
**Estimated Effort:** 3-4 days  
**Dependencies:** US-056 (Leave Types Configuration)  
**Routes (Proposed):** `GET /api/my-leave/balance`  
**Technical Notes:**
- Requires new `leave_balances` table with user_id, leave_type_id, allocated, used, remaining
- Auto-calculate remaining = allocated - used
- Reset annually based on company policy

---

### US-047: Employee Submit Leave with Type
**As an** employee  
**I want to** submit leave requests with specific leave type (annual, sick, emergency, etc.)  
**So that** my leave is categorized correctly and deducted from appropriate balance

**Acceptance Criteria:**
- Leave request form includes leave type dropdown
- System validates sufficient leave balance before submission
- Prevents submission if balance insufficient (with clear error message)
- Shows projected balance after leave request
- Leave types populated from manager configuration
- Includes start date, end date, leave type, and reason

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Leave Management  
**Estimated Effort:** 2-3 days  
**Dependencies:** US-056 (Leave Types), US-046 (Leave Balance)  
**Routes (Proposed):** Modify `POST /api/leave` to include `leave_type_id`

---

### US-048: Employee View Work Hours Summary
**As an** employee  
**I want to** view my total work hours for the current month  
**So that** I can track my working time and verify payroll

**Acceptance Criteria:**
- Display total work hours for current month
- Show breakdown by week
- List individual daily work hours
- Show days where clock-out was missing (incomplete records)
- Include average daily work hours
- Option to view previous months
- Export summary as PDF or Excel

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 3-4 days  
**Dependencies:** US-045 (Clock-Out)  
**Routes (Proposed):** `GET /api/my-work-hours?month=YYYY-MM`

---

### US-049: Employee View Location History
**As an** employee  
**I want to** view my clock-in locations on a map for past attendance records  
**So that** I can verify my location data

**Acceptance Criteria:**
- Display interactive map with markers for each clock-in location
- Each marker shows date, time, and distance from office
- Can filter by date range
- Color-coded markers based on approval status (green=approved, yellow=pending, red=rejected)
- Shows office location for reference
- Can click marker to see detailed information
- Option to view as list or map

**Status:** 📋 Planned  
**Priority:** Low  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 4-5 days  
**Dependencies:** US-044 (Attendance History)  
**Technical Notes:**
- Reuse existing Leaflet map integration
- Add clustering for multiple markers

---

### US-050: Employee See Assigned Office
**As an** employee  
**I want to** see which office locations I can clock in from  
**So that** I know where to clock in for automatic approval

**Acceptance Criteria:**
- Display primary assigned office name, address, and coordinates
- **Show ALL office locations managed by employee's manager (1-4 offices)**
- Show all valid office locations on map with markers
- Display allowed radius for auto-approval for each office
- Show official clock-in time for each office
- Label primary office vs other valid offices
- Message: "You can clock in from any of these locations for auto-approval"
- If unassigned, show message to contact manager

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** Multi-Office Management  
**Estimated Effort:** 3 days  
**Dependencies:** US-058 (Multi-Office), US-059 (Employee Assignment)  
**Routes (Proposed):** `GET /api/my-offices` (plural - returns all valid offices for employee, max 4)

---

### US-051: Employee Browser Notification Reminder
**As an** employee  
**I want to** receive a browser notification if I haven't clocked in by official time  
**So that** I don't forget to record my attendance

**Acceptance Criteria:**
- Request notification permission on first login
- Send browser notification at official clock-in time if not clocked in
- Notification includes message: "Reminder: Please clock in for attendance"
- Click notification to navigate to clock-in page
- Option to enable/disable notifications in user settings
- Respects browser notification settings
- Only sends if browser tab is open or service worker active

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** User Experience Enhancement  
**Estimated Effort:** 2-3 days  
**Technical Notes:**
- Use browser Notification API (no third-party service)
- Implement service worker for background notifications
- Check current time vs office clock-in time
- Query if user has attendance record for today

---

## Epic 7: Manager Reporting & Analytics (New - Planned)

### US-052: Manager Generate Monthly Attendance Report
**As a** manager  
**I want to** generate comprehensive monthly attendance reports for all employees  
**So that** I can analyze attendance patterns and make data-driven decisions

**Acceptance Criteria:**
- Select month and year for report generation
- Report includes for each employee:
  - Total working days
  - Days present (on-time and late)
  - Days late with average lateness
  - Days absent
  - Days on leave
  - Attendance rate percentage
- Summary statistics for entire team
- Visual charts: attendance trends, late arrival patterns
- Export to PDF or Excel format
- Can filter by office location (if multi-office)
- Can filter by specific employees or departments

**Status:** 📋 Planned  
**Priority:** Critical  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 5-7 days  
**Routes (Proposed):** `GET /api/admin/reports/monthly-attendance?month=YYYY-MM&office_id=X`  
**Technical Notes:**
- Generate report server-side for better performance
- Use library like `excelize` (Go) for Excel export
- Cache report results for common queries

---

### US-053: Manager Export Attendance Data
**As a** manager  
**I want to** export attendance data to Excel/CSV format  
**So that** I can perform custom analysis or integrate with payroll systems

**Acceptance Criteria:**
- Export all attendance records or filtered subset
- Include all fields: employee name, date, clock-in time, clock-out time, work hours, status, distance, location
- Support Excel (.xlsx) and CSV formats
- Include leave requests in separate sheet/file
- Can select date range for export
- Can filter by employee, office, or status
- Downloaded file named with timestamp: "Attendance_Export_YYYY-MM-DD.xlsx"

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 3-4 days  
**Routes (Proposed):** `GET /api/admin/export/attendance?format=xlsx|csv&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

---

### US-054: Manager View Employee Performance Metrics
**As a** manager  
**I want to** view individual employee attendance performance metrics  
**So that** I can identify top performers and address attendance issues

**Acceptance Criteria:**
- Select employee to view detailed performance
- Display metrics:
  - Attendance rate (% of working days)
  - On-time rate (% of clock-ins before official time)
  - Average lateness (in minutes)
  - Total late days this month/year
  - Leave usage (days used vs allocated)
  - Pending approvals
  - Location compliance (% within office radius)
- Historical trend charts (last 3-6 months)
- Comparison with team average
- Highlight improvements or declines
- Option to export employee-specific report

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 4-5 days  
**Routes (Proposed):** `GET /api/admin/employee/:id/performance?period=30|60|90`

---

### US-055: Manager View Location Tracking Report
**As a** manager  
**I want to** view employee location tracking patterns and statistics  
**So that** I can monitor field work and ensure location accuracy

**Acceptance Criteria:**
- View all employee clock-in locations on interactive map
- Filter by date range, employee, or office
- Color-coded markers by approval status
- Show statistics:
  - Average distance from office
  - % within radius vs outside radius
  - Most common clock-in locations
  - Unusual location patterns (outliers)
- Heatmap view showing clock-in density
- Export location data with coordinates
- Privacy note displayed (location tracking purpose)

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 5-6 days  
**Routes (Proposed):** `GET /api/admin/reports/location-tracking?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`  
**Technical Notes:**
- Use Leaflet heatmap plugin
- Implement clustering for performance with many markers

---

### US-056: Manager Configure Leave Types
**As a** manager  
**I want to** configure different leave types (annual, sick, emergency, unpaid) with annual quotas  
**So that** leave can be categorized and tracked separately

**Acceptance Criteria:**
- Create new leave types with name, description, color code
- Set annual quota (default days allocated per employee per year)
- Mark if leave type requires manager approval or auto-approved
- Set if leave type is paid or unpaid
- Mark if leave type requires documentation/proof
- Enable/disable leave types
- Cannot delete leave type if it has been used in leave requests
- System comes with default leave types:
  - Annual Leave (12 days)
  - Sick Leave (12 days)
  - Emergency Leave (3 days)
  - Unpaid Leave (unlimited)

**Status:** 📋 Planned  
**Priority:** Critical  
**Epic:** Leave Management  
**Estimated Effort:** 3-4 days  
**Routes (Proposed):** 
- `GET /api/admin/leave-types`
- `POST /api/admin/leave-types`
- `PUT /api/admin/leave-types/:id`
- `DELETE /api/admin/leave-types/:id`  
**Technical Notes:**
- Add `leave_types` table: id, name, description, annual_quota, requires_approval, is_paid, color, is_active
- Update LeaveRequest model to include `leave_type_id`

---

### US-057: Manager View Leave Balance Report
**As a** manager  
**I want to** view all employees' leave balances by type  
**So that** I can monitor leave usage and plan team coverage

**Acceptance Criteria:**
- Display table with all employees and their leave balances
- Columns for each leave type showing: allocated, used, remaining
- Sort by employee name, department, or remaining balance
- Filter by leave type or office location
- Highlight employees with low remaining balance (warning threshold)
- Show pending leave requests that would affect balance
- Export to Excel/CSV
- Annual reset function for new year

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Leave Management  
**Estimated Effort:** 4-5 days  
**Dependencies:** US-056 (Leave Types)  
**Routes (Proposed):** `GET /api/admin/reports/leave-balances`

---

### US-061: Manager View Pending Approvals Notification
**As a** manager  
**I want to** see browser notification when new pending approvals arrive  
**So that** I can review and respond promptly

**Acceptance Criteria:**
- Browser notification when new pending clock-in created
- Browser notification when new leave request submitted
- Notification shows employee name and type (clock-in or leave)
- Click notification to navigate to pending approvals section
- Notification count badge on manager dashboard
- Option to enable/disable notifications
- Checks for new approvals every 5 minutes
- Only shows if manager dashboard is open

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** User Experience Enhancement  
**Estimated Effort:** 2-3 days  
**Technical Notes:**
- Use browser Notification API (no third-party service)
- Polling or WebSocket for real-time updates
- Store last check timestamp to detect new records

---

### US-062: Manager View Work Hours Report
**As a** manager  
**I want to** view total work hours report for all employees  
**So that** I can monitor productivity and approve overtime

**Acceptance Criteria:**
- Select date range for report (week, month, custom)
- Display for each employee:
  - Total work hours
  - Average daily work hours
  - Days with overtime (>8 hours)
  - Days with undertime (<8 hours)
  - Incomplete records (missing clock-out)
- Summary statistics for team total hours
- Filter by office location
- Export to Excel for payroll processing
- Highlight employees with excessive overtime

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Reporting & Analytics  
**Estimated Effort:** 4-5 days  
**Dependencies:** US-045 (Clock-Out), US-064 (Work Hours Calculation)  
**Routes (Proposed):** `GET /api/admin/reports/work-hours?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

---

### US-063: Manager Set Leave Balance Per Employee
**As a** manager  
**I want to** manually adjust leave balance for specific employees  
**So that** I can handle special cases or corrections

**Acceptance Criteria:**
- View current leave balance for employee by type
- Add or subtract days from specific leave type
- Provide reason for manual adjustment (audit trail)
- Cannot set negative balance
- Adjustment immediately reflects in employee's balance
- Adjustment logged with manager name, date, reason
- View adjustment history for employee
- Common use cases: carry-forward unused leave, compensation for extra work, correction of errors

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** Leave Management  
**Estimated Effort:** 3 days  
**Dependencies:** US-056, US-057  
**Routes (Proposed):** 
- `POST /api/admin/employees/:id/leave-balance/adjust`
- `GET /api/admin/employees/:id/leave-balance/history`  
**Technical Notes:**
- Add `leave_balance_adjustments` table for audit trail
- Recalculate remaining balance after each adjustment

---

## Epic 8: Multi-Office Management (New - Planned)

### US-058: Manager Manage Multiple Offices
**As a** manager  
**I want to** create and manage multiple office locations (HQ, branches, remote sites)  
**So that** employees at different locations can clock in appropriately

**Acceptance Criteria:**
- Create multiple office locations with:
  - Office name
  - Address (optional)
  - Latitude and longitude
  - Allowed radius (meters)
  - Official clock-in time
  - Time zone (for multi-region support)
- Edit existing office locations
- Delete office (only if no employees or managers assigned)
- Set one office as default
- View all offices in list and on map
- Each office has unique ID
- **Manager can be assigned to 1-4 office locations (minimum 1, maximum 4)**
- Manager can switch between their assigned offices in dashboard
- Manager must have at least one office assigned

**Status:** 📋 Planned  
**Priority:** Critical  
**Epic:** Multi-Office Management  
**Estimated Effort:** 4-5 days  
**Routes (Proposed):**
- `GET /api/admin/offices` - Returns all offices (super admin) or manager's assigned offices
- `POST /api/admin/offices` - Create office (super admin only)
- `PUT /api/admin/offices/:id` - Update office (if manager has access)
- `DELETE /api/admin/offices/:id` - Delete office (super admin only)
- `GET /api/admin/my-offices` - Get current manager's assigned offices  
**Technical Notes:**
- Modify OfficeLocation model to remove singleton constraint
- Add `manager_offices` junction table (manager_id, office_id) with constraints:
  - Minimum 1 office per manager (at least one required)
  - Maximum 4 offices per manager
  - CHECK constraint: COUNT(office_id) BETWEEN 1 AND 4 per manager_id
- Add office management UI to manager dashboard
- Migration script to convert existing office location to first multi-office record

---

### US-059: Manager Assign Employees to Office
**As a** manager  
**I want to** assign employees to specific office locations  
**So that** their attendance is validated against the correct office coordinates

**Acceptance Criteria:**
- Assign employee to primary office during creation or editing
- Bulk assign multiple employees to same office
- Reassign employee from one office to another
- View employee list grouped by office
- Employee assigned to one primary office
- **Employee gets auto-approved if within radius of ANY office their manager manages**
- Unassigned employees use default office or cannot clock in
- Assignment change takes effect immediately
- Show office assignment in employee details
- Manager can only assign employees to offices they manage

**Status:** 📋 Planned  
**Priority:** Critical  
**Epic:** Multi-Office Management  
**Estimated Effort:** 3-4 days  
**Dependencies:** US-058 (Multi-Office)  
**Routes (Proposed):**
- Modify `POST /api/admin/employees` and `PUT /api/admin/employees/:id` to include `office_id`
- `PATCH /api/admin/employees/bulk-assign` for bulk assignment  
**Technical Notes:**
- Add `office_id` foreign key to User model (employee's primary office)
- **CRITICAL: Update attendance ClockIn logic to check employee location against ALL offices their manager has access to**
- Auto-approve if within radius of any manager's office (not just primary office)
- Store which office location was used for approval in attendance record

---

### US-060: Manager View Office-Specific Reports
**As a** manager  
**I want to** filter all reports and dashboards by office location  
**So that** I can analyze performance per branch or site

**Acceptance Criteria:**
- Office filter dropdown available on all report pages
- Daily attendance dashboard can filter by office
- Monthly reports can be generated per office
- Leave balance report can filter by office
- Location tracking report defaults to office-specific view
- "All Offices" option to view aggregated data
- Office filter selection persists during session
- Report titles indicate selected office

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Multi-Office Management  
**Estimated Effort:** 3-4 days  
**Dependencies:** US-058, US-059  
**Technical Notes:**
- Add office_id query parameter to all report endpoints
- Frontend: Add office selector component to manager dashboard
- Store selected office in session storage

---

## Epic 9: System Enhancements (New - Planned)

### US-064: System Calculate Work Hours
**As a** system  
**I want to** automatically calculate work hours between clock-in and clock-out times  
**So that** work hours tracking is accurate and automated

**Acceptance Criteria:**
- Calculate work hours when employee clocks out
- Store as decimal value (e.g., 8.5 hours)
- Subtract break time if configured (e.g., 1 hour lunch break)
- Handle cases where clock-out is next day (overnight shifts)
- Mark records with missing clock-out as "incomplete"
- Recalculate if clock-out time is updated
- Use attendance record's clock-in and clock-out timestamps

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** System Enhancement  
**Estimated Effort:** 2-3 days  
**Dependencies:** US-045 (Clock-Out)  
**Technical Notes:**
- Add `work_hours_decimal` field to Attendance model
- Add `break_duration_minutes` to OfficeLocation model (default: 60)
- Formula: work_hours = (clock_out - clock_in - break_duration) / 60

---

### US-065: System Multi-Manager Access Control
**As a** system  
**I want to** support managers assigned to up to 4 offices with proper access control  
**So that** managers can handle multiple branches while maintaining security

**Acceptance Criteria:**
- **Manager must be assigned to 1-4 office locations (minimum: 1, maximum: 4)**
- Manager can view/manage employees from ALL their assigned offices
- Manager sees combined attendance, leave requests, and reports from all managed offices
- Super admin role can view all offices and employees
- Manager assigned to office(s) during account creation or by super admin
- Cannot remove manager's last office (must have at least 1)
- Reports and dashboards show data from all manager's assigned offices
- Pending approvals show from all manager's assigned offices
- Manager can approve attendance/leave only for employees in their managed offices
- Office selector in dashboard to filter view by specific office (when managing multiple)
- **Attendance auto-approval works if employee within radius of ANY of manager's offices (up to 4)**

**Status:** 📋 Planned  
**Priority:** Critical  
**Epic:** Multi-Office Management  
**Estimated Effort:** 5-6 days  
**Dependencies:** US-058, US-059  
**Technical Notes:**
- Add `manager_offices` junction table (manager_id, office_id) with constraints:
  - CHECK: COUNT(office_id) >= 1 (minimum 1 office required)
  - CHECK: COUNT(office_id) <= 4 (maximum 4 offices allowed)
  - Validation in application layer before database insert/delete
- Add `is_super_admin` boolean to User model
- Update all manager endpoints to filter by office access using JOIN on manager_offices
- Middleware to check manager's office permissions
- **ClockIn handler: Loop through all manager's offices (up to 4) to check proximity before setting status to 'pending'**

---

### US-066: System Browser Notification API
**As a** system  
**I want to** use browser Notification API for employee and manager reminders  
**So that** users receive timely alerts without third-party services

**Acceptance Criteria:**
- Request notification permission on first dashboard visit
- Store permission status in user preferences
- Send notifications for:
  - Employee: clock-in reminder at official time
  - Manager: new pending approvals
- Notifications only sent if permission granted
- Service worker for background notifications (optional)
- Fallback to in-app notifications if browser doesn't support
- Respect user's browser notification settings
- Clear notification when user interacts with dashboard

**Status:** 📋 Planned  
**Priority:** Medium  
**Epic:** System Enhancement  
**Estimated Effort:** 3-4 days  
**Technical Notes:**
- Use `Notification API` (Web API standard)
- Check `Notification.permission` status
- Implement notification service in Angular
- Optional: Service worker for offline notification queueing

---

## Epic 10: Office Management UI/UX (New - Planned)

### US-067: Manager Dedicated Office Management Page
**As a** manager  
**I want to** access a dedicated office management page separate from the dashboard  
**So that** I can comprehensively manage 1-4 office locations without cluttering the dashboard

**Acceptance Criteria:**
- **Separate page/route:** `/admin/offices` (not embedded in dashboard)
- Navigation link from manager dashboard to Office Management
- Office Management page includes:
  - **Office List View:** Table/cards showing all manager's assigned offices (1-4)
  - **Add New Office:** Button to create office (super admin only)
  - **Edit Office:** Form to update office details (name, coordinates, radius, clock-in time)
  - **Assign to Manager:** Assign/unassign offices to managers (1-4 limit enforced)
  - **View on Map:** Interactive map showing all offices with markers
  - **Office Statistics:** Employees assigned, attendance records, pending approvals per office
- Dashboard only shows office selector dropdown (no detailed configuration)
- Uses interactive map for selecting coordinates (Leaflet)
- Form validation:
  - Prevents removing manager's last office
  - Prevents assigning more than 4 offices to a manager
  - Validates required fields (name, coordinates, radius)
- Breadcrumb navigation: Dashboard > Office Management
- Responsive design for mobile devices

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Multi-Office Management  
**Estimated Effort:** 5-6 days  
**Dependencies:** US-058 (Multi-Office Database)  
**Routes (Frontend):** `/admin/offices`  
**Routes (Backend):** Same as US-058 APIs  
**Components (Proposed):**
- `office-management.component.ts` - Main office management page
- `office-form.component.ts` - Add/edit office form
- `office-list.component.ts` - List of offices
- `office-map.component.ts` - Map view of all offices  
**Technical Notes:**
- Remove office configuration section from `manager-dashboard.component.ts`
- Keep only office selector dropdown in dashboard for filtering
- Lazy load office management module for better performance
- Use Angular reactive forms for validation
- Integrate Leaflet map with click-to-select coordinates

**UI Layout Suggestion:**
```
┌─────────────────────────────────────────────────────────┐
│  Office Management                    [+ Add New Office] │
├─────────────────────────────────────────────────────────┤
│  My Assigned Offices: 2 of 4                            │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐                       │
│ │ Office A    │  │ Office B    │                       │
│ │ 123 Main St │  │ 456 Park Av │                       │
│ │ 50m radius  │  │ 100m radius │                       │
│ │ 25 employees│  │ 18 employees│                       │
│ │ [Edit] [Map]│  │ [Edit] [Map]│                       │
│ └─────────────┘  └─────────────┘                       │
├─────────────────────────────────────────────────────────┤
│  Map View (All Offices)                                 │
│  [Interactive Leaflet Map with office markers]          │
└─────────────────────────────────────────────────────────┘
```

---

## Epic 11: Security & Access Control

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

### US-032: Employee Full Name Support
**As a** system  
**I want to** store employee full names in addition to usernames  
**So that** users can be identified by their real names instead of just usernames

**Acceptance Criteria:**
- User model includes optional FullName field (varchar 255)
- Full name can be provided during employee creation
- Full name can be updated via employee update endpoint
- Full name is stored and returned in API responses
- System works correctly with or without full name (optional field)

**Status:** ✅ Implemented  
**Implementation:** [models.go](backend/models/models.go), [admin.go](backend/handlers/admin.go)

---

## Epic 12: Data Models & Persistence

### US-021: User Data Model
**As a** system  
**I want to** store user information securely  
**So that** authentication and authorization can be performed

**Schema:**
- ID (primary key)
- Username (unique, required)
- FullName (varchar 255, optional)
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

## Epic 13: Geolocation & Distance Calculation

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

## Epic 14: System Configuration

### US-030: CORS Configuration
**As a** system  
**I want to** allow cross-origin requests from frontend  
**So that** API communication works properly

**Acceptance Criteria:**
- CORS middleware configured
- Allows requests from localhost:4200 (development)
- Allows requests from production domain
- Supports preflight requests

**Status:** ✅ Implemented  
**Implementation:** [main.go](backend/main.go)

---

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

**Total User Stories:** 32  
**Implemented:** 32 (100%)  
**Pending:** 0  

**Epics Breakdown:**
1. ✅ Authentication & Authorization - 4 stories (100%)
2. ✅ Employee Attendance Features - 4 stories (100%)
3. ✅ Manager Administrative Features - 10 stories (100%)
4. ✅ Security & Access Control - 4 stories (100%)
5. ✅ Data Models & Persistence - 6 stories (100%)
6. ✅ Geolocation & Distance Calculation - 3 stories (100%)
7. ✅ System Configuration - 2 stories (100%)

**Features by Priority:**
- **Critical (Must-Have):** 19 stories - All implemented ✅
- **Important (Should-Have):** 9 stories - All implemented ✅
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
- **Nice-to-Have:** 5 stories - 4 implemented ✅, 1 planned 🔄

---

## Implementation Roadmap

### **Phase 1: Leave Management Foundation** (Priority: Critical)
**Estimated Timeline:** 2-3 weeks  
**User Stories:**
1. US-056: Manager Configure Leave Types (3-4 days)
2. US-046: Employee View Leave Balance (3-4 days)
3. US-047: Employee Submit Leave with Type (2-3 days)
4. US-057: Manager View Leave Balance Report (4-5 days)
5. US-063: Manager Set Leave Balance Per Employee (3 days)

**Business Value:**
- Enables proper leave tracking and categorization
- Reduces manual leave balance management
- Provides transparency for employees and managers
- Foundation for payroll integration

---

### **Phase 2: Multi-Office Support** (Priority: Critical)
**Estimated Timeline:** 2-3 weeks  
**User Stories:**
1. US-058: Manager Manage Multiple Offices - 1 to 4 offices per manager (4-5 days)
2. US-059: Manager Assign Employees to Office (3-4 days)
3. US-050: Employee See Assigned Office - Shows all manager's offices (3 days)
4. US-060: Manager View Office-Specific Reports (3-4 days)
5. US-065: System Multi-Manager Access Control - 1-4 offices constraint (5-6 days)
6. US-067: Manager Dedicated Office Management Page (5-6 days)

**Business Value:**
- Supports business expansion to multiple locations
- Enables decentralized management
- Accurate location validation per office
- Scalable architecture for growth

---

### **Phase 3: Reporting & Analytics** (Priority: High)
**Estimated Timeline:** 3-4 weeks  
**User Stories:**
1. US-052: Manager Generate Monthly Attendance Report (5-7 days)
2. US-053: Manager Export Attendance Data (3-4 days)
3. US-054: Manager View Employee Performance Metrics (4-5 days)
4. US-055: Manager View Location Tracking Report (5-6 days)
5. US-044: Employee View Personal Attendance History (3-5 days)

**Business Value:**
- Data-driven decision making
- Performance monitoring and improvement
- Payroll integration support
- Compliance and audit trail

---

### **Phase 4: Work Hours Tracking** (Priority: High)
**Estimated Timeline:** 1-2 weeks  
**User Stories:**
1. US-045: Employee Optional Clock-Out (2-3 days)
2. US-064: System Calculate Work Hours (2-3 days)
3. US-048: Employee View Work Hours Summary (3-4 days)
4. US-062: Manager View Work Hours Report (4-5 days)

**Business Value:**
- Accurate work hours for payroll
- Overtime tracking and management
- Employee productivity insights
- Fair compensation verification

---

### **Phase 5: User Experience Enhancements** (Priority: Medium)
**Estimated Timeline:** 1-2 weeks  
**User Stories:**
1. US-066: System Browser Notification API (3-4 days)
2. US-051: Employee Browser Notification Reminder (2-3 days)
3. US-061: Manager View Pending Approvals Notification (2-3 days)
4. US-049: Employee View Location History (4-5 days)

**Business Value:**
- Improved user engagement
- Reduced forgotten clock-ins
- Faster manager response time
- Better user satisfaction

---

## Success Metrics

### Leave Management
- **Target:** 90% of leave requests categorized by type
- **Metric:** Reduction in manual leave balance tracking time by 80%
- **KPI:** Employee satisfaction with leave transparency

### Multi-Office Support
- **Target:** Support for 4 office locations per manager
- **Metric:** Each office has dedicated manager (or shared across max 4)
- **KPI:** Accurate attendance validation per office location

### Reporting & Analytics
- **Target:** Monthly reports generated in <5 seconds
- **Metric:** 100% of managers use reports for decision-making
- **KPI:** Reduced time spent on manual attendance tracking by 70%

### Work Hours Tracking
- **Target:** 80% clock-out adoption rate (since optional)
- **Metric:** Accurate payroll data for 95% of employees
- **KPI:** Reduced payroll processing errors

---

## Future Considerations (Beyond Current Scope)

### Additional Features to Consider Later:
- **Mobile App:** Native iOS/Android apps for better geolocation and offline support
- **Biometric Integration:** Face recognition or fingerprint for identity verification
- **Shift Management:** Support for different shift schedules and rotating shifts
- **Holiday Calendar:** Automatic handling of public holidays and company events
- **Department Management:** Organize employees by departments for better reporting
- **Approver Hierarchy:** Multi-level approval workflow for leave requests
- **Integration APIs:** REST APIs for payroll system integration
- **Audit Logs:** Comprehensive audit trail for all system changes
- **Employee Self-Service:** Portal for employees to update personal information
- **Performance Reviews:** Integration with HR performance management

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
  "full_name": "string", // optional
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
  "full_name": "string", // optional
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
---

## 🏢 Epic 10: Office Management UI/UX (New - Planned)

### US-067: Manager Dedicated Office Management Page
**As a** manager  
**I want to** access a dedicated office management page separate from the dashboard  
**So that** I can comprehensively manage 1-4 office locations without cluttering the dashboard

**Acceptance Criteria:**
- **Separate page/route:** `/admin/offices` (not embedded in dashboard)
- Navigation link from manager dashboard to Office Management
- Office Management page includes:
  - **Office List View:** Table/cards showing all manager's assigned offices (1-4)
  - **Add New Office:** Button to create office (super admin only)
  - **Edit Office:** Form to update office details (name, coordinates, radius, clock-in time)
  - **Assign to Manager:** Assign/unassign offices to managers (1-4 limit enforced)
  - **View on Map:** Interactive map showing all offices with markers
  - **Office Statistics:** Employees assigned, attendance records, pending approvals per office
- Dashboard only shows office selector dropdown (no detailed configuration)
- Uses interactive map for selecting coordinates (Leaflet)
- Form validation:
  - Prevents removing manager's last office
  - Prevents assigning more than 4 offices to a manager
  - Validates required fields (name, coordinates, radius)
- Breadcrumb navigation: Dashboard > Office Management
- Responsive design for mobile devices

**Status:** 📋 Planned  
**Priority:** High  
**Epic:** Multi-Office Management  
**Estimated Effort:** 5-6 days  
**Dependencies:** US-058 (Multi-Office Database)  
**Routes (Frontend):** `/admin/offices`  
**Routes (Backend):** Same as US-058 APIs  
**Components (Proposed):**
- `office-management.component.ts` - Main office management page
- `office-form.component.ts` - Add/edit office form
- `office-list.component.ts` - List of offices
- `office-map.component.ts` - Map view of all offices  
**Technical Notes:**
- Remove office configuration section from `manager-dashboard.component.ts`
- Keep only office selector dropdown in dashboard for filtering
- Lazy load office management module for better performance
- Use Angular reactive forms for validation
- Integrate Leaflet map with click-to-select coordinates

**UI Layout Suggestion:**
```
┌─────────────────────────────────────────────────────────┐
│  Office Management                    [+ Add New Office] │
├─────────────────────────────────────────────────────────┤
│  My Assigned Offices: 2 of 4                            │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐                       │
│ │ Office A    │  │ Office B    │                       │
│ │ 123 Main St │  │ 456 Park Av │                       │
│ │ 50m radius  │  │ 100m radius │                       │
│ │ 25 employees│  │ 18 employees│                       │
│ │ [Edit] [Map]│  │ [Edit] [Map]│                       │
│ └─────────────┘  └─────────────┘                       │
├─────────────────────────────────────────────────────────┤
│  Map View (All Offices)                                 │
│  [Interactive Leaflet Map with office markers]          │
└─────────────────────────────────────────────────────────┘
```

---