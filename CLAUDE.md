# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NYAMPE** (Nyaman Manajemen Presensi Elektronik) — a GPS-based attendance tracking system. Employees clock in with browser geolocation; the backend validates their distance against office radii and either auto-approves or queues for manager review.

Stack: Go 1.24+ (Gin + GORM) backend, Angular 16 frontend, MySQL 8.0+, JWT auth.

## Commands

### Backend
```bash
cd backend
go mod tidy          # Install dependencies
go run main.go       # Dev server on :8080 (auto-migrates schema + seeds data)
go build -o attendance-server main.go  # Production build
```

**Environment variables** (`.env` in `backend/`):
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` (defaults: `root`, `password`, `127.0.0.1`, `3306`, `attendance_db`)
- `MYSQL_DSN` — full DSN string (overrides all DB_* vars)
- `JWT_SECRET` — fallback: `"super-secret-key-default"`

### Frontend
```bash
cd frontend
npm install
npm start            # ng serve on :4200
ng build             # Production build → dist/
ng test              # Unit tests via Karma
```

### Database
```sql
CREATE DATABASE attendance_db;
```
Schema auto-migrates on every backend startup. Reference SQL in [backend/migration.sql](backend/migration.sql).

## Architecture

### Request Flow
```
Browser (Angular :4200)
  → ApiService (auto-adds JWT Bearer header)
  → Go backend (:8080)
  → AuthMiddleware → (ManagerMiddleware for admin routes) → Handler
  → GORM → MySQL
```

### Backend Layout (`backend/`)
- `main.go` — entry point, route registration, CORS, calls `seed.RunAll()` on startup
- `auth/jwt.go` — `GenerateToken()`, `AuthMiddleware()`, `ManagerMiddleware()`
- `database/db.go` — MySQL connection, DSN assembly from env vars
- `models/models.go` — all 5 core models (see below)
- `handlers/` — one file per domain: `auth.go`, `attendance.go`, `admin.go`, `office_management.go`, leave, employees, reports
- `seed/` — seeding runs on every startup (idempotent checks prevent duplicates)
- `utils/distance.go` — Haversine distance calculation (always **meters**)

### Frontend Layout (`frontend/src/app/`)
- `services/api.service.ts` — single HTTP wrapper, all backend calls go through here
- `auth.guard.ts` — checks `localStorage.getItem('token')`; redirects to `/login`
- `components/` — one folder per feature; role-based routing (employee → `/clock-in`, manager → `/admin`)
- `OfficeManagementComponent` is a **standalone** component — it must be in `imports`, NOT `declarations` in `app.module.ts`
- `ManagerDashboardComponent` uses an **inline template** (large HTML in the `.ts` file, no `.html` file)

### Data Models (in `models/models.go`)
| Model | Key fields |
|---|---|
| `User` | `Role` enum (`employee`\|`manager`), `IsSuperAdmin bool`, `OfficeID` (reference only) |
| `Attendance` | `Status` enum (`approved`\|`pending`\|`rejected`), `ApprovedOfficeID *uint` (nullable), `DistanceMeters decimal(10,2)`, `IsLate bool`, `MinutesLate int` |
| `OfficeLocation` | `Latitude decimal(10,8)`, `Longitude decimal(11,8)`, `AllowedRadiusMeters decimal(10,2)`, `ClockInTime varchar(5)` ("HH:MM") |
| `ManagerOffice` | Junction table; max 4 offices per manager enforced at application level, not DB |
| `LeaveRequest` | `Status` enum (`pending`\|`approved`\|`rejected`) |

## Critical Business Logic

### Clock-In Validation (the core flow)
Located in `handlers/attendance.go` `ClockIn()`:

1. Fetch **all** of the employee's manager's assigned offices via `ManagerOffice` JOIN
2. Loop through each office, calculate Haversine distance
3. **Short-circuit**: break on first office within radius → `status="approved"`, record `approved_office_id`
4. If outside all offices → `status="pending"` (manager must manually approve)
5. Calculate lateness against closest office's `ClockInTime`

**Key invariants to preserve when modifying:**
- Employees are validated against their **manager's offices**, not `User.OfficeID`
- `ApprovedOfficeID` is only set when auto-approved (nil when pending)
- Distances are always in **meters** — never kilometers

### Permission System
- Super admin = `role='manager' AND is_super_admin=true`
- Regular managers can only edit/view their **assigned** offices (`ManagerOffice` JOIN check)
- Super admins can operate on **any** office

### Adding a New Manager Route
1. Register in `admin` group in `main.go`: `admin.GET("/endpoint", handlers.YourHandler)`
2. Handler retrieves caller: `userID := c.MustGet("userID").(uint)`
3. Add method to `ApiService` in the frontend
4. Use Indonesian for user-facing error messages: `gin.H{"error": "Pesan dalam Bahasa Indonesia"}`

## Seeded Credentials (auto-created on startup)
- Super admins: `admin`/`admin`, `admin2`/`admin2`
- Employees: `karyawan1`–`karyawan5` / same as username
- **No registration UI** — create users via `POST /api/register` (Postman/cURL)

## Common Gotchas
- **CORS** is hardcoded in `main.go` for `localhost:4200` and `43.163.107.154` — add new origins there
- **Geolocation testing**: use browser DevTools → Sensors → Location to override coordinates
- `OfficeID` on `User` is for display/reference only; clock-in validation ignores it
- `ManagerOffice` constraints (min 1, max 4) are enforced in handler code, not as DB constraints
- JWT tokens expire after 24h; no refresh token mechanism exists
