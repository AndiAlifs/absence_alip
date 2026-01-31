# Field Attendance System - AI Agent Instructions

## Project Overview
A geolocation-based attendance tracking system with automatic proximity validation and manager approval workflows. Backend in Go (Gin + GORM), frontend in Angular 16, MySQL database.

## Architecture & Key Patterns

### Backend Structure (Go)
- **Module name**: `field-attendance-system` (used in all imports)
- **Entry point**: [backend/main.go](backend/main.go) - seeds admin user on startup (`admin:admin123`)
- **Database**: GORM auto-migration on startup; connection configured via env vars with sensible defaults (root:password@127.0.0.1:3306/attendance_db)
- **Auth**: JWT tokens with 24h expiry ([backend/auth/jwt.go](backend/auth/jwt.go)), middleware chain: `AuthMiddleware()` → `ManagerMiddleware()` for admin routes
- **CORS**: Hardcoded to allow `localhost:4200` and production IP `43.163.107.154`

### Frontend Structure (Angular 16)
- **Router**: Role-based navigation - employees → `/clock-in`, managers → `/admin`
- **Auth**: JWT stored in `localStorage`, added to all requests via `ApiService.getHeaders()`
- **API Base URL**: Hardcoded to `http://localhost:8080/api` in [api.service.ts](frontend/src/app/services/api.service.ts)
- **Styling**: TailwindCSS configured

### Core Business Logic: Geolocation Validation
**Critical workflow** in [handlers/attendance.go](backend/handlers/attendance.go):
1. Employee sends `{latitude, longitude}` from browser
2. Backend retrieves `OfficeLocation` settings (lat/long/radius)
3. Haversine distance calculation ([utils/distance.go](backend/utils/distance.go)) determines if within radius
4. **Auto-approval**: distance ≤ `allowed_radius_meters` → `status="approved"`
5. **Pending review**: distance > radius → `status="pending"`, requires manager action

This dual-status pattern is central to the system - always preserve both auto and manual approval paths.

## Database Models ([models/models.go](backend/models/models.go))

### Key Enums (MySQL)
- `User.Role`: `'employee'|'manager'` (default: `'employee'`)
- `Attendance.Status`: `'approved'|'pending'|'rejected'` (default: `'approved'`)
- `LeaveRequest.Status`: `'pending'|'approved'|'rejected'` (default: `'pending'`)

### Relations
- `Attendance.UserID` → `User` (preloaded in admin queries)
- `LeaveRequest.UserID` → `User` (JSON tag `"-"` hides from API)
- `OfficeLocation`: Singleton table (only ID=1 used)

## Development Commands

### Backend
```bash
cd backend
go mod tidy              # Install dependencies
go run main.go           # Start server on :8080
```
**Environment**: Uses `godotenv` - create `.env` with `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`, or override with `MYSQL_DSN`. Set `JWT_SECRET` or defaults to `"super-secret-key-default"`.

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm start                # Runs `ng serve` on :4200
ng build                 # Production build
```

### Database Setup
```sql
CREATE DATABASE attendance_db;
```
Schema auto-migrates. Manual migration available in [backend/migration.sql](backend/migration.sql).

## Route Structure

### Public Routes
- `POST /api/login` - Returns JWT token
- `POST /api/register` - User creation (no frontend UI implemented)

### Employee Routes (requires JWT)
- `POST /api/clock-in` - Geolocation capture with auto-status
- `POST /api/leave` - Leave request submission

### Manager Routes (requires JWT + role="manager")
All under `/api/admin/*`:
- `GET /records` - All attendance with user details
- `GET /leaves` - All leave requests
- `PATCH /leave/:id` - Approve/reject leaves
- `GET /pending-clockins` - Clock-ins needing review
- `PATCH /clockin/:id` - Approve/reject attendance
- `GET|POST /office-location` - Configure office coordinates/radius
- Employee CRUD: `GET|POST /employees`, `PUT|DELETE /employees/:id`

## Code Conventions

### Go
- **Error handling**: Return JSON `{"error": "..."}` with appropriate HTTP status
- **Middleware**: Extract userID/role from JWT, set in context with `c.Set()`
- **Distance**: Always in **meters** (stored as `decimal(10,2)`)
- **Coordinates**: `decimal(10,8)` for latitude, `decimal(11,8)` for longitude

### Angular
- **Guards**: `AuthGuard` checks token existence, redirects to `/login` if missing
- **Date handling**: Use `type="date"` inputs, backend expects `time.Time` JSON format
- **Error messages**: Many use **Indonesian** (e.g., "Lokasi kantor belum diatur")

### Cross-cutting
- **ID fields**: Always `uint` in Go, `number` in TypeScript
- **Time zones**: Backend uses `parseTime=True&loc=Local` in MySQL DSN
- **Foreign keys**: GORM auto-creates constraints, cascade deletes not configured

## Common Modifications

### Adding New Attendance Rules
1. Modify [handlers/attendance.go](backend/handlers/attendance.go) `ClockIn()` function
2. Consider adding fields to `Attendance` model (requires migration)
3. Update `distance` calculation logic or add secondary validation checks

### New Manager Features
1. Add route in [main.go](backend/main.go) under `admin.GET/POST/etc`
2. Create handler in [handlers/admin.go](backend/handlers/admin.go)
3. Add method to [api.service.ts](frontend/src/app/services/api.service.ts)
4. Call from [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

### Changing Office Location Logic
Edit `OfficeLocation` model in [models.go](backend/models/models.go) and handlers in [office.go](backend/handlers/office.go). Currently supports single office only (ID=1 singleton pattern).

## Testing Credentials
Default seeded admin (created on first startup):
- Username: `admin`
- Password: `admin123`
- Role: `manager`

Create additional users via `POST /api/register` (use cURL/Postman - no registration UI).
