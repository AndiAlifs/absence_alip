# Field Attendance System
## Product Requirements Document (As Built)

## 1. Document Control
* **Version:** 3.0 (Updated to reflect current production-ready capabilities)
* **Last updated:** 2026-03-29
* **Scope:** Current implementation in this repository
* **Purpose:** Define implemented behavior and separate roadmap-only capabilities

---

## 2. Executive Summary
The Field Attendance System is an internal HR operations platform designed to automate and verify employee attendance across multiple physical locations. The product provides GPS-based verification, dynamic auto-approval workflows, multi-office management, centralized leave request processing, and real-time dashboard visibility for managerial oversight. 

The current product focuses on a hybrid validation model—automatically approving on-site personnel while flagging off-site or distant clock-ins for manual managerial review.

---

## 3. Product Mission
The product exists to improve operational efficiency and minimize attendance fraud by:
* Capturing highly accurate geolocation data during clock-in and clock-out events.
* Enabling low-friction, automatic status progression for compliant employees.
* Measuring late arrivals automatically based on configured office parameters.
* Tracking time-off requests with a seamless approval pipeline.
* Providing role-scoped visibility to both employees (self-service history) and managers (team oversight).

---

## 4. Users and Access Model

### 4.1 Personas
* **Employee:** Records daily attendance, submits leave requests, and views personal attendance and leave history.
* **Manager:** Monitors daily team attendance, manually reviews "Pending" off-site clock-ins, processes leave requests, and oversees specifically assigned office branches (1-4 offices).
* **Super Admin:** Full access including master data management, global system configuration, and master office creation.

### 4.2 Implemented RBAC Model
RBAC is enforced via stateless JWT authentication, with both frontend route/menu guards (`AuthGuard`) and backend authorization middleware (`auth.AuthMiddleware`, `auth.ManagerMiddleware`).
* **Roles:** `employee`, `manager`
* **Sub-Roles:** Managers can possess a boolean `is_super_admin` flag.
* **Scope:** Role-based access ensures employees cannot view peers' data, while managers are restricted to overseeing attendance within their assigned ecosystem. 

### 4.3 Role-Permission Matrix

| Action | Super Admin | Manager | Employee |
| :--- | :---: | :---: | :---: |
| View own attendance/leave history | ✅ | ✅ | ✅ |
| Submit clock-in / clock-out | ✅ | ✅ | ✅ |
| Submit leave request | ✅ | ✅ | ✅ |
| View live team dashboard | ✅ | ✅ | — |
| Approve/Reject off-site clock-ins | ✅ | ✅ | — |
| Approve/Reject leave requests | ✅ | ✅ | — |
| Manage assigned offices | ✅ | ✅ | — |
| Create global office locations | ✅ | — | — |
| Manage global system settings | ✅ | — | — |

---

## 5. Current Scope (Implemented)

### 5.1 Attendance Intake and Lifecycle
* One-click manual clock-in/out via UI leveraging the browser's HTML5 Geolocation API.
* Exact distance is calculated server-side using the Haversine formula (in meters).
* **Supported statuses for Attendance:**
  * Approved
  * Pending
  * Rejected
* **Supported queue actions:**
  * Clock In (Validates GPS, determines status based on radius limit)
  * Clock Out (Calculates total `WorkHours` and updates record)
  * Manager Override (Pending → Approved or Rejected for off-site requests)
* **Lateness Tracking:** Backend auto-calculates `IsLate` boolean and `MinutesLate` integer based on the specific office's required target `ClockInTime`.

### 5.2 Status Transition Matrix (Clock-In)

| Validation Outcome \ Assigned Status | Approved | Pending | Rejected |
| :--- | :---: | :---: | :---: |
| **Distance <= Allowed Radius** | ✅ (Auto) | — | — |
| **Distance > Allowed Radius** | — | ✅ (Auto) | — |
| **Manager Manual Review** | — | — | ✅ (Manual) |
| **Manager Manual Review** | ✅ (Manual) | — | — |

### 5.3 Multi-Office Management
* Organizations can configure multiple physical office profiles.
* Each office has distinct configurations: `Latitude`, `Longitude`, `ClockInTime`, and `AllowedRadiusMeters`.
* Managers are linked to offices via the `ManagerOffice` junction table (typically 1-4 per manager).
* Employees are assigned a primary `OfficeID` which dictates the coordinates used for their daily validation.

### 5.4 Leave Management
* Employees select `StartDate`, `EndDate`, and provide a text `Reason` to apply for time off.
* Request enters a "Pending" queue for the manager.
* Manager approves or rejects via the dashboard UI, changing the status and finalizing the request.

### 5.5 Dashboards and Analytics
* **Manager Live Dashboard:** Actionable queue displaying Present, Absent, Late, and On Leave personnel for the day.
* **Approval Queues:** Dedicated UI tables for processing off-site clock-ins and pending leave.
* **Employee Self-Service:** Displays Today's Dashboard alongside historical ledgers for past attendance validations and leave outcomes.

### 5.6 Platform and UX
* **Frontend:** Angular 16 application with reactive forms and modular routing.
* **Backend:** Go 1.20+ (Gin + GORM) exposing RESTful JSON APIs.
* **Database:** MySQL 8.0+ handling automated schema migrations.
* **Security:** Bcrypt password hashing, configurable JWT token duration (default 24h).

---

## 6. Data Model

### 6.1 Users Table (`users`)

| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | uint | Primary key, auto-increment |
| `username` | string | Unique index, required |
| `full_name` | string(255) | — |
| `password_hash` | string | Bcrypt hash |
| `role` | enum | 'employee', 'manager' |
| `office_id` | uint | Foreign key (Employee's primary office) |
| `is_super_admin` | boolean | Default: false |

### 6.2 Attendance Table (`attendances`)

| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | uint | Primary key |
| `user_id` | uint | Foreign key to users |
| `clock_in_time` | datetime | Required |
| `clock_out_time` | datetime | Nullable |
| `latitude` / `longitude` | decimal | High precision for clock-in |
| `status` | enum | 'approved', 'pending', 'rejected' |
| `distance` | decimal | Meters from target office |
| `work_hours` | decimal | Auto-calculated on out |
| `is_late` | boolean | Evaluated against office start time |
| `minutes_late` | int | Calculated delta |

*(Additional tables include `leave_requests`, `office_locations`, `manager_offices`, and `system_settings`)*

---

## 8. Functional Requirements

### FR-1 Geolocation Validation & Auto-Approval
* Frontend shall capture user device geolocation (Lat/Long) at the exact moment of clock-in via HTML5 APIs.
* Backend shall compute the Haversine distance between the submitted coordinates and the target office coordinates.
* Backend shall automatically mark the attendance status as `approved` if the calculated distance is less than or equal to the office's `AllowedRadiusMeters`.
* Backend shall assign a `pending` status for manual review if the threshold is breached.

---

## 14. Acceptance Baseline for Current Release
The current release is considered aligned with this PRD when all conditions below are met:
* GPS coordinates are successfully captured and securely transmitted to the backend.
* The system correctly differentiates between on-site (auto-approved) and off-site (pending) clock-ins based on configurable office radii.
* Late clock-ins are successfully flagged and quantified based on individual office configurations.
* Managers can successfully approve or reject off-site clock-ins and leave requests through dedicated UI queues.
* Multi-office manager assignments accurately restrict manager dashboard visibility to their respective domains.
* Role and scope checks prevent unauthorized API actions via both frontend routing guards and backend middleware.