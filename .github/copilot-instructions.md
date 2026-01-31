# Field Attendance System - AI Agent Instructions

## Project Overview
A geolocation-based attendance tracking system with automatic proximity validation and manager approval workflows. Backend in Go (Gin + GORM), frontend in Angular 16, MySQL database.

## Architecture & Key Patterns

### Backend Structure (Go)
- **Module name**: `field-attendance-system` (used in all imports)
- **Entry point**: [backend/main.go](backend/main.go) - seeds admin user on startup via `seedAdminUser()`
- **Database**: GORM auto-migration on startup; connection via env vars with defaults (`root:password@127.0.0.1:3306/attendance_db`)
- **Auth**: JWT tokens with 24h expiry ([backend/auth/jwt.go](backend/auth/jwt.go))
  - Middleware chain: `AuthMiddleware()` → `ManagerMiddleware()` for admin routes
  - JWT secret from `JWT_SECRET` env var, fallback to `"super-secret-key-default"`
- **CORS**: Hardcoded to allow `localhost:4200` and production IP `43.163.107.154`

### Frontend Structure (Angular 16)
- **Router**: Role-based navigation - employees → `/clock-in`, managers → `/admin` (no route guards beyond AuthGuard)
- **Auth**: JWT stored in `localStorage`, added to all requests via `ApiService.getHeaders()`
- **API Base URL**: Set via `environment.apiUrl` (defaults to `http://localhost:8080/api`)
- **Styling**: TailwindCSS with utility-first approach
- **Languages**: Mixed English/Indonesian - UI labels in Indonesian, code in English

### Core Business Logic: Geolocation + Lateness Validation
**Critical workflow** in [handlers/attendance.go](backend/handlers/attendance.go):
1. Employee sends `{latitude, longitude}` from browser's geolocation API
2. Backend retrieves `OfficeLocation` settings (lat/long/radius/clock_in_time)
3. **Distance check**: Haversine formula ([utils/distance.go](backend/utils/distance.go)) calculates meters from office
   - Within `allowed_radius_meters` → `status="approved"`
   - Outside radius → `status="pending"` (requires manager approval)
4. **Lateness check**: Compares current time to `OfficeLocation.ClockInTime` (format: `"HH:MM"`)
   - Sets `is_late=true` and `minutes_late` if clock-in after official time
5. Creates `Attendance` record with all calculated fields

**Key pattern**: Dual-status system (auto-approve vs pending) is fundamental - preserve both paths when modifying.

## Database Models ([models/models.go](backend/models/models.go))

### Key Enums (MySQL `ENUM` type)
- `User.Role`: `'employee'|'manager'` (default: `'employee'`)
- `Attendance.Status`: `'approved'|'pending'|'rejected'` (default: `'approved'`)
- `LeaveRequest.Status`: `'pending'|'approved'|'rejected'` (default: `'pending'`)

### Critical Fields
- **Coordinates**: `decimal(10,8)` for latitude, `decimal(11,8)` for longitude (high precision required)
- **Distance**: `decimal(10,2)` in meters (not kilometers)
- **ClockInTime**: `varchar(5)` storing `"HH:MM"` format (e.g., `"09:00"`)

### Relations & Foreign Keys
- `Attendance.UserID` → `User` (preloaded in admin queries via `Preload("User")`)
- `LeaveRequest.UserID` → `User` (JSON tag `"-"` hides user object from API response)
- `OfficeLocation`: **Singleton pattern** - only ID=1 used, must be seeded before clock-ins work

## Development Workflows

### Backend Setup
```bash
cd backend
go mod tidy              # Install dependencies (first time only)
go run main.go           # Start server on :8080 (auto-seeds admin user)
```
**Environment variables** (via `.env` or system):
- `MYSQL_DSN` - Full connection string (overrides individual DB_* vars)
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` - Individual components
- `JWT_SECRET` - Token signing key (fallback: `"super-secret-key-default"`)

### Frontend Setup
```bash
cd frontend
npm install              # Install dependencies
npm start                # Runs `ng serve --open` on :4200
ng build                 # Production build to dist/
```

### Database Setup
```sql
CREATE DATABASE attendance_db;
```
- Auto-migration runs on server startup (all models in [models.go](backend/models/models.go))
- Manual schema available in [backend/migration.sql](backend/migration.sql) (for reference/disaster recovery)
- **First-run admin seed**: `admin:admin123` (role: manager) created automatically

## API Route Structure

### Public Routes
- `POST /api/login` - Returns `{token, user}` (token is JWT)
- `POST /api/register` - User creation (NO frontend UI, use cURL/Postman)

### Employee Routes (requires `AuthMiddleware()`)
- `POST /api/clock-in` - Geolocation capture, auto-calculates distance/lateness
- `POST /api/leave` - Leave request submission
- `GET /api/my-attendance/today` - Today's clock-in record
- `GET /api/my-leave/today` - Today's leave status
- `GET /api/office-location` - View office settings (public to employees)

### Manager Routes (requires `AuthMiddleware()` + `ManagerMiddleware()`)
All under `/api/admin/*`:
- `GET /records` - All attendance records with user preload
- `GET /leaves` - All leave requests
- `PATCH /leave/:id` - Approve/reject leave (`{status: "approved"|"rejected"}`)
- `GET /pending-clockins` - Clock-ins with `status="pending"`
- `PATCH /clockin/:id` - Approve/reject attendance
- `GET|POST /office-location` - Configure office lat/long/radius/clock-in time
- `GET|POST /employees` - List/create employees
- `PUT|DELETE /employees/:id` - Update/delete employee
- `GET /daily-attendance` - Dashboard showing today's attendance summary

## Code Conventions & Patterns

### Go Backend
- **Error responses**: Always `c.JSON(status, gin.H{"error": "message"})` (use Indonesian for user-facing messages)
- **Middleware context**: Set data with `c.Set("userID", id)`, retrieve with `c.MustGet("userID").(uint)`
- **Distance units**: Always **meters** (never kilometers), stored as `decimal(10,2)`
- **JSON binding**: Use `binding:"required"` tags for validation, handle errors with 400 Bad Request
- **Database queries**: Use GORM's `Preload()` for relations, avoid N+1 queries

### Angular Frontend
- **Auth pattern**: `AuthGuard` checks `localStorage.getItem('token')`, redirects to `/login` if missing
- **API calls**: All through `ApiService`, which auto-adds `Authorization: Bearer <token>` header
- **Date inputs**: Use `type="date"` HTML5 inputs, backend receives as `time.Time` in JSON
- **Error messages**: Indonesian for UI alerts (e.g., "Lokasi kantor belum diatur", "Berhasil melakukan clock-in")
- **Component inline templates**: Large templates embedded in `.ts` files (no separate `.html` for manager dashboard)

### Cross-cutting Concerns
- **ID types**: `uint` in Go models ↔ `number` in TypeScript
- **Time zones**: Backend uses `parseTime=True&loc=Local` in MySQL DSN (server local time)
- **Foreign key constraints**: GORM auto-creates, but **no cascade deletes** configured
- **Coordinate precision**: Use 8 decimals for lat, 11 for long (~1cm accuracy)

## Common Modification Patterns

### Adding New Attendance Rules
1. **Backend**: Edit `ClockIn()` in [handlers/attendance.go](backend/handlers/attendance.go)
2. **Model changes**: Add field to `Attendance` struct in [models.go](backend/models/models.go)
3. **Migration**: GORM auto-migrates on restart, or update [migration.sql](backend/migration.sql)
4. **Frontend**: Update `ClockInComponent` to display new field

### New Manager Features
1. **Route**: Add to `admin` group in [main.go](backend/main.go)
2. **Handler**: Create function in [handlers/admin.go](backend/handlers/admin.go)
3. **Frontend service**: Add method to [api.service.ts](frontend/src/app/services/api.service.ts)
4. **UI**: Update [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)

### Changing Office Location Logic
- Currently **singleton pattern** (ID=1 only) enforced in [handlers/office.go](backend/handlers/office.go)
- To support multiple offices: change `OfficeLocation` model, update `ClockIn()` to select correct office by employee assignment

## Deployment Notes
- **Production**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for Tencent Cloud/VPS setup
- **Build process**: 
  - Backend: `go build -o attendance-server main.go`
  - Frontend: `ng build --configuration production` → outputs to `dist/`
- **Service**: Systemd service file in `attendance.service` (runs backend on port 8080)
- **Reverse proxy**: Nginx config in `nginx.conf` (serves Angular static files, proxies `/api` to backend)

## Testing & Debugging

### Default Credentials
- **Admin user**: `admin` / `admin123` (role: `manager`) - auto-seeded on first startup
- **Create employees**: Use `POST /api/register` via Postman/cURL (no registration UI exists)

### Testing Geolocation
- Use browser DevTools → Sensors → Location override to test different coordinates
- Office location must be configured first (manager → "Pengaturan Lokasi Kantor" section)
- Check console for geolocation errors (permission denied, timeout)

### Common Gotchas
- **Office location not set**: Clock-in fails with "Lokasi kantor belum diatur" error
- **CORS errors**: If frontend can't reach backend, check CORS origins in [main.go](backend/main.go)
- **JWT expiry**: Tokens expire after 24 hours, user must re-login
- **No registration UI**: Must create users via API directly (intended design)
