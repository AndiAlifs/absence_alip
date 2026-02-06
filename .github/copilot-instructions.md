# Field Attendance System - AI Agent Instructions

## Project Overview
A geolocation-based attendance tracking system with automatic proximity validation and manager approval workflows. Backend in Go (Gin + GORM), frontend in Angular 16, MySQL database.

**Key Differentiators:**
- **Multi-office support**: Managers can oversee 1-4 offices, employees auto-approved at ANY managed office
- **Super admin system**: First admin has elevated permissions for office management
- **GPS-based validation**: Haversine distance calculation auto-approves/rejects clock-ins

## Architecture & Key Patterns

### Backend Structure (Go)
- **Module name**: `field-attendance-system` (used in all imports)
- **Entry point**: [backend/main.go](backend/main.go) - seeds admin user on startup via `seedAdminUser()` and `seedDefaultOfficeAssignment()`
- **Database**: GORM auto-migration on startup; connection via env vars with defaults (`root:password@127.0.0.1:3306/attendance_db`)
  - Auto-migrates 5 models: `User`, `Attendance`, `LeaveRequest`, `OfficeLocation`, `ManagerOffice`
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

### Core Business Logic: Multi-Office Geolocation Validation
**Critical workflow** in [handlers/attendance.go](backend/handlers/attendance.go) - ClockIn() function:

```go
// 1. Get ALL manager's offices via JOIN
var managerOffices []models.OfficeLocation
database.DB.
    Joins("JOIN manager_offices ON manager_offices.office_id = office_locations.id").
    Where("manager_offices.manager_id = ? AND office_locations.is_active = ?", manager.ID, true).
    Find(&managerOffices)

// 2. Check distance against EACH office, find closest
for i := range managerOffices {
    distance := utils.CalculateDistance(lat, long, office.Latitude, office.Longitude)
    if distance <= office.AllowedRadiusMeters {
        isWithinRadius = true
        closestOffice = office
        break // Auto-approve at FIRST valid office
    }
}
```

**Algorithm flow**:
1. Employee sends `{latitude, longitude}` from browser geolocation
2. Backend fetches **ALL** manager's assigned offices (1-4 offices from `ManagerOffice` junction)
3. **Distance validation**: Loop through each office, calculate Haversine distance in meters
   - **Short-circuit optimization**: Break on FIRST office within radius → `status="approved"`
   - Track closest office for lateness calculation even if outside all radii
4. **Status determination**:
   - Within ANY office radius → `status="approved"`, `approved_office_id` = that office
   - Outside ALL offices → `status="pending"` (manager must manually approve)
5. **Lateness calculation**: Uses closest office's `clock_in_time` ("HH:MM" format)
   - Parse official time, compare to current time
   - Set `is_late=true` and `minutes_late` if after official time
6. Create `Attendance` record with all calculated fields

**Critical patterns**:
- **Dual-status system**: Auto-approve vs pending - preserve BOTH paths when modifying
- **Office reference**: Always record `approved_office_id` when auto-approved
- **Distance units**: ALWAYS meters (decimal(10,2)), never kilometers
- **Early exit**: Break loop immediately when valid office found (performance optimization)

## Database Models ([models/models.go](backend/models/models.go))

### Key Enums (MySQL `ENUM` type)
- `User.Role`: `'employee'|'manager'` (default: `'employee'`)
  - Note: Super admin is `role='manager' AND is_super_admin=true`
- `Attendance.Status`: `'approved'|'pending'|'rejected'` (default: `'approved'`)
  - `approved`: Auto-approved (within radius) or manager-approved
  - `pending`: Awaiting manager review (outside all office radii)
  - `rejected`: Manager explicitly rejected
- `LeaveRequest.Status`: `'pending'|'approved'|'rejected'` (default: `'pending'`)

### Critical Fields
- **Coordinates**: `decimal(10,8)` for latitude, `decimal(11,8)` for longitude (high precision required)
- **Distance**: `decimal(10,2)` in meters (not kilometers)
- **ClockInTime**: `varchar(5)` storing `"HH:MM"` format (e.g., `"09:00"`)

### Relations & Foreign Keys
- `Attendance.UserID` → `User` (preloaded in admin queries via `Preload("User")`)
- `Attendance.ApprovedOfficeID` → `OfficeLocation` (tracks which office validated the clock-in)
  - **Important**: Nullable pointer `*uint` - only set when auto-approved, null when pending
- `LeaveRequest.UserID` → `User` (JSON tag `"-"` hides user object from API response)
- `ManagerOffice`: Junction table linking managers to 1-4 offices (many-to-many)
  - **No DB constraints** - limits enforced at application level in handlers
  - 1 minimum (cannot unassign last office)
  - 4 maximum (cannot assign 5th office)
- `User.OfficeID` → `OfficeLocation` (employee's primary office, currently for reference only)
  - **Note**: Not used in clock-in validation - employees checked against manager's offices
- `User.IsSuperAdmin`: Boolean flag, true for first admin (`seedAdminUser()` sets this)

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
- **Auto-migration**: Runs on server startup for all 5 models (User, Attendance, LeaveRequest, OfficeLocation, ManagerOffice)
  - GORM creates tables + foreign keys automatically
  - Manual schema in [backend/migration.sql](backend/migration.sql) for reference
- **Seeding** (runs on every startup, checks for existing records):
  1. `seedAdminUser()`: Creates admin user if not exists
     - Username: `admin`, Password: `admin123`
     - Role: `manager`, `IsSuperAdmin: true`
  2. `seedDefaultOfficeAssignment()`: Auto-assigns first office to admin
     - Checks if office exists and admin exists
     - Creates `ManagerOffice` record linking them
- **Migration pattern**: GORM auto-migration preferred over manual SQL (add fields to structs, restart server)

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

**Office Management Routes** ([handlers/office_management.go](backend/handlers/office_management.go)):
- `GET /offices` - Permission-based filtering:
  - Super admin: ALL offices (`WHERE is_active = true`)
  - Regular manager: Only assigned (`JOIN manager_offices WHERE manager_id = ?, is_active = true`)
- `POST /offices` - Create office (super admin only, checks `user.IsSuperAdmin`)
- `PUT /offices/:id` - Update office with permission check:
  - Super admin: Can update ANY office
  - Regular manager: Only if assigned to that office (`JOIN manager_offices`)
- `GET /my-offices` - Returns manager's assigned offices with count for UI badge
- `POST /offices/assign` - Super admin assigns office to manager:
  - **Enforces max 4 offices**: `COUNT(*) FROM manager_offices WHERE manager_id = ? >= 4` → error
  - **Prevents duplicates**: Check existing assignment before insert
- `POST /offices/unassign` - Super admin removes assignment:
  - **Enforces min 1 office**: `COUNT(*) FROM manager_offices WHERE manager_id = ? <= 1` → error

## Code Conventions & Patterns

### Go Backend
- **Error responses**: Always `c.JSON(status, gin.H{"error": "message"})` (use Indonesian for user-facing messages)
  ```go
  c.JSON(http.StatusBadRequest, gin.H{"error": "Lokasi kantor belum diatur"})
  ```
- **Middleware context**: Set data with `c.Set("userID", id)`, retrieve with `c.MustGet("userID").(uint)`
  ```go
  // In AuthMiddleware: c.Set("userID", claims.UserID)
  // In handlers: userID := c.MustGet("userID").(uint)
  ```
- **Distance units**: Always **meters** (never kilometers), stored as `decimal(10,2)`
  - Example: `AllowedRadiusMeters: 100` (not 0.1 km)
- **JSON binding**: Use `binding:"required"` tags for validation, handle errors with 400 Bad Request
  ```go
  type ClockInInput struct {
      Latitude  float64 `json:"latitude" binding:"required"`
      Longitude float64 `json:"longitude" binding:"required"`
  }
  if err := c.ShouldBindJSON(&input); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
  }
  ```
- **Database queries**: Use GORM's `Preload()` for relations, avoid N+1 queries
  - Example: `database.DB.Preload("User").Find(&attendances)` (loads user in one query)
- **Permission checks**: Always verify role + super admin flag before privileged operations
  ```go
  var user models.User
  database.DB.First(&user, userID)
  if !user.IsSuperAdmin {
      return 403 Forbidden
  }
  ```

### Angular Frontend
- **Auth pattern**: `AuthGuard` checks `localStorage.getItem('token')`, redirects to `/login` if missing
- **API calls**: All through `ApiService`, which auto-adds `Authorization: Bearer <token>` header
  ```typescript
  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })};
  }
  ```
- **Date inputs**: Use `type="date"` HTML5 inputs, backend receives as `time.Time` in JSON
- **Error messages**: Indonesian for UI alerts (e.g., "Lokasi kantor belum diatur", "Berhasil melakukan clock-in")
- **Component patterns**: 
  - Standard components: Declared in `app.module.ts` `declarations` array, separate `.html` files
  - `OfficeManagementComponent`: **Standalone** component (imported in `imports`, NOT `declarations`)
    - Has own `imports: [CommonModule, FormsModule, ReactiveFormsModule]`
    - Route: `/admin/offices` protected by `AuthGuard`
  - `ManagerDashboardComponent`: Inline template (large HTML embedded in `.ts` file, no separate `.html`)

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
   ```go
   admin := protected.Group("/admin")
   admin.Use(auth.ManagerMiddleware())
   admin.GET("/your-endpoint", handlers.YourHandler)
   ```
2. **Handler**: Create function in [handlers/admin.go](backend/handlers/admin.go) or new file
   - Always check `userID := c.MustGet("userID").(uint)` from middleware
   - Use Indonesian error messages for user-facing responses
3. **Frontend service**: Add method to [api.service.ts](frontend/src/app/services/api.service.ts)
   ```typescript
   yourMethod(data: any): Observable<any> {
     return this.http.post(`${this.apiUrl}/admin/your-endpoint`, data, this.getHeaders());
   }
   ```
4. **UI**: Update [manager-dashboard.component.ts](frontend/src/app/components/manager-dashboard/manager-dashboard.component.ts)
   - Inline template: Add HTML directly in `template:` string
   - Use TailwindCSS utility classes for styling

### Office Management System Implementation

**Multi-Office Architecture** (implemented, not aspirational):
- Managers assigned to 1-4 offices via `ManagerOffice` junction table
- Employees auto-approved when within radius of ANY manager's office
- `Attendance.ApprovedOfficeID` tracks which office validated the clock-in

**Permission System** (role + super admin flag):
```go
// Super admin check pattern (used in office_management.go)
if !user.IsSuperAdmin {
    c.JSON(http.StatusForbidden, gin.H{"error": "Hanya super admin yang dapat..."})
    return
}

// Regular manager can only edit assigned offices
var count int64
database.DB.Model(&models.ManagerOffice{}).
    Where("manager_id = ? AND office_id = ?", userID, officeID).
    Count(&count)
if count == 0 {
    c.JSON(http.StatusForbidden, gin.H{"error": "Tidak bisa edit kantor yang tidak di-assign"})
}
```

**Constraint Enforcement** (at API level, not DB constraints):
```go
// Max 4 offices per manager (in AssignOfficeToManager)
var count int64
database.DB.Model(&models.ManagerOffice{}).Where("manager_id = ?", managerID).Count(&count)
if count >= 4 {
    return error "Manager sudah memiliki 4 kantor (maksimal)"
}

// Min 1 office per manager (in UnassignOfficeFromManager)
if count <= 1 {
    return error "Manager harus memiliki minimal 1 kantor"
}
```

**UI Workflow** ([office-management.component.ts](frontend/src/app/components/office-management/office-management.component.ts)):
1. Manager clicks "Kelola Kantor" button in dashboard (shows "X of 4" badge)
2. Navigates to `/admin/offices` - displays office cards with map previews
3. **Add Office**: Modal form with validation (name, address, lat/long, radius, clock-in time)
4. **Edit Office**: Pre-populates form, checks permissions (super admin or assigned manager)
5. **View on Map**: Opens `https://www.google.com/maps?q={lat},{long}` in new tab
6. **Delete Office**: Soft delete (`is_active = false`), enforces min 1 office constraint

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
  - Solution: Manager must have at least 1 assigned office (check `ManagerOffice` table)
- **CORS errors**: If frontend can't reach backend, check CORS origins in [main.go](backend/main.go)
  - Hardcoded: `localhost:4200` and `43.163.107.154`
- **JWT expiry**: Tokens expire after 24 hours, user must re-login
  - Check `GenerateToken()` in [backend/auth/jwt.go](backend/auth/jwt.go)
- **No registration UI**: Must create users via API directly (intended design)
  - Use `POST /api/register` with Postman/cURL
- **Standalone component errors**: If `OfficeManagementComponent` not found:
  - Ensure it's in `imports` array, NOT `declarations` in `app.module.ts`
- **Multi-office assignment confusion**: 
  - Employees checked against **manager's offices**, not their own `OfficeID`
  - `User.OfficeID` is for reference, not used in clock-in validation
- **Distance always in meters**: Never use kilometers - frontend sends meters, backend expects meters
