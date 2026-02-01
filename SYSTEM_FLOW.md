# System Flow & Architecture

Visual diagrams showing how the Field Attendance System works.

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FIELD ATTENDANCE SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐          ┌──────────────────┐          ┌──────────────┐
│                 │          │                  │          │              │
│   EMPLOYEE      │◄────────►│   BACKEND API    │◄────────►│   DATABASE   │
│   (Angular)     │   REST   │   (Go/Gin)       │   GORM   │   (MySQL)    │
│                 │   JWT    │                  │          │              │
└─────────────────┘          └──────────────────┘          └──────────────┘
        ▲                            ▲
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│                 │          │                  │
│   MANAGER       │          │  External APIs   │
│   (Angular)     │          │  - Google Maps   │
│                 │          │  - Browser GPS   │
└─────────────────┘          └──────────────────┘
```

---

## 🔄 Employee Clock-In Flow (The Core Feature)

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CLOCK-IN WORKFLOW                               │
└────────────────────────────────────────────────────────────────────────┘

EMPLOYEE SIDE                    BACKEND                    DATABASE
─────────────                    ───────                    ────────

1. Click "Clock In"
      │
      ├─► Browser prompts
      │   for location
      │   permission
      │
2. Allow GPS
      │
      ├─► Geolocation API
      │   captures:
      │   - Latitude
      │   - Longitude
      │
3. Preview on map
   (optional verify)
      │
      ├─► Submit location
      │   
      │   POST /api/clock-in     
      │   {lat, lon}   ──────────►  4. Receive request
      │                                     │
      │                                     ├─► Retrieve office
      │                                     │   location settings:
      │                                     │   - Office GPS
      │                                     │   - Allowed radius     ◄───┐
      │                                     │   - Clock-in time          │
      │                                     │                            │
      │                                     ├─► Calculate distance       │
      │                                     │   using Haversine:         │
      │                                     │                            │
      │                                     │   distance = √(            │
      │                                     │     (lat1-lat2)² +         │
      │                                     │     (lon1-lon2)²           │
      │                                     │   ) × Earth radius         │
      │                                     │                            │
      │                                     ├─► DECISION LOGIC:          │
      │                                     │                            │
      │                                     │   if distance ≤ radius:    │
      │                                     │     status = "approved"    │
      │                                     │     ✅ AUTO-APPROVED       │
      │                                     │   else:                    │
      │                                     │     status = "pending"     │
      │                                     │     🔍 NEEDS REVIEW       │
      │                                     │                            │
      │                                     ├─► Calculate lateness:      │
      │                                     │                            │
      │                                     │   if now > clock_in_time:  │
      │                                     │     is_late = true         │
      │                                     │     minutes_late = diff    │
      │                                     │   else:                    │
      │                                     │     is_late = false        │
      │                                     │                            │
      │                                     ├─► Create attendance  ──────┤
      │                                     │   record with:        ──────►  5. Save to DB:
      │                                     │   - User ID                       - attendance
      │                                     │   - Timestamp                     - user_id
      │                                     │   - GPS coords                    - latitude
      │                                     │   - Distance                      - longitude
      │                                     │   - Status                        - distance
      │                                     │   - is_late                       - status
      │                                     │   - minutes_late                  - is_late
      │                                     │                                   - created_at
      │                         ◄───────────┴─► Return response
      │                                         
      ◄─── Response JSON ────────────────┘
      {
        "message": "Clock-in berhasil",
        "status": "approved",
        "distance": 45.2,
        "is_late": false
      }
      │
6. Show status badge
   ✅ "Approved - On Time"
   or
   ⏱️ "Pending - Outside Radius"
   or
   ⚠️ "Approved - Late (15 min)"
```

---

## 👨‍💼 Manager Approval Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                     MANAGER APPROVAL WORKFLOW                           │
└────────────────────────────────────────────────────────────────────────┘

MANAGER DASHBOARD                BACKEND                    DATABASE
─────────────────                ───────                    ────────

1. Open dashboard
      │
      ├─► GET /api/admin/daily-attendance ──►  Retrieve all attendance
      │                                         for today with:
      │                                         - User info (JOIN)
      │                                         - Status
      │                                         - GPS data
      │                          ◄──────────    - Late info
      │
      ◄─── Display cards:
           ┌──────────────────┐
           │ ✅ Clocked In    │  18 employees
           │ On Time          │  
           ├──────────────────┤
           │ ⚠️ Clocked In    │  2 employees
           │ Late             │  
           ├──────────────────┤
           │ 🏖️ On Leave      │  3 employees
           │ Approved         │  
           ├──────────────────┤
           │ ❌ Absent        │  5 employees
           │ No Clock-In      │  
           └──────────────────┘

2. Review pending
   clock-ins
      │
      ├─► GET /api/admin/pending-clockins ──►  Filter where:
      │                                         status = "pending"
      │                          ◄──────────    
      │
      ◄─── Show list:
           John Doe
           Distance: 5.2 km
           Time: 08:55 AM
           [View on Map] [Approve] [Reject]
           
3. Click "View on Map"
      │
      ├─► Open Google Maps
      │   with coordinates
      │
      └─► Verify location
          (client site? legitimate?)

4a. Click "Approve"
      │
      ├─► PATCH /api/admin/clockin/123  ──────►  Update record:
      │   {status: "approved"}                   SET status = "approved"
      │                                           WHERE id = 123
      │                          ◄──────────    
      │
      ◄─── Success message
           Employee notified ✅

4b. Click "Reject"
      │
      ├─► PATCH /api/admin/clockin/123  ──────►  Update record:
      │   {status: "rejected"}                   SET status = "rejected"
      │                                           WHERE id = 123
      │                          ◄──────────    
      │
      ◄─── Success message
           Employee notified ❌
```

---

## 🏖️ Leave Request Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                       LEAVE REQUEST WORKFLOW                            │
└────────────────────────────────────────────────────────────────────────┘

EMPLOYEE                         BACKEND                    DATABASE
────────                         ───────                    ────────

1. Navigate to
   Leave Request page
      │
2. Fill form:
   - Start Date: 2026-05-01
   - End Date: 2026-05-05
   - Reason: "Family vacation"
      │
      ├─► POST /api/leave  ──────────────────►  Create leave_request:
      │   {                                     - user_id
      │     start_date: "2026-05-01",           - start_date
      │     end_date: "2026-05-05",             - end_date
      │     reason: "Family vacation"           - reason
      │   }                                     - status: "pending"
      │                          ◄──────────    
      │
      ◄─── "Leave request submitted"
           Status: Pending ⏱️

                                    ────────────────────────►

MANAGER                          BACKEND                    DATABASE
───────                          ───────                    ────────

3. Open dashboard
      │
      ├─► GET /api/admin/leaves  ───────────►  Retrieve all:
      │                                        WHERE status IN
      │                          ◄──────────   ('pending', 'approved')
      │
      ◄─── Show list:
           Sarah Johnson
           May 1-5, 2026 (5 days)
           "Family vacation"
           [Approve] [Reject]

4. Review request
   (check team coverage)
      │
5a. Click "Approve"
      │
      ├─► PATCH /api/admin/leave/456  ────────►  Update:
      │   {status: "approved"}                   SET status = "approved"
      │                                           WHERE id = 456
      │                          ◄──────────    
      │
      ◄─── Success message
           Employee can see:
           "Leave Approved ✅"

5b. Click "Reject"
      │
      ├─► PATCH /api/admin/leave/456  ────────►  Update:
      │   {status: "rejected"}                   SET status = "rejected"
      │                                           WHERE id = 456
      │                          ◄──────────    
      │
      ◄─── Success message
           Employee sees:
           "Leave Rejected ❌"
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────┐
│      users        │
├───────────────────┤
│ id (PK)           │◄─────┐
│ username (UNIQUE) │      │
│ password (HASH)   │      │
│ full_name         │      │
│ role (ENUM)       │      │
│   - employee      │      │
│   - manager       │      │
│ created_at        │      │
└───────────────────┘      │
                           │
                           │  Foreign Key
┌───────────────────┐      │
│   attendances     │      │
├───────────────────┤      │
│ id (PK)           │      │
│ user_id (FK) ─────┼──────┘
│ latitude          │
│ longitude         │
│ distance_meters   │
│ status (ENUM)     │
│   - approved      │
│   - pending       │
│   - rejected      │
│ is_late (BOOL)    │
│ minutes_late      │
│ clock_in_time     │
│ created_at        │
└───────────────────┘

┌───────────────────┐      
│  leave_requests   │      
├───────────────────┤      
│ id (PK)           │      
│ user_id (FK) ─────┼──────┐
│ start_date        │      │
│ end_date          │      │
│ reason (TEXT)     │      │
│ status (ENUM)     │      │
│   - pending       │      │
│   - approved      │      │
│   - rejected      │      │
│ created_at        │      │
└───────────────────┘      │
                           │
                           │
┌───────────────────┐      │
│ office_locations  │      │  (Singleton - only ID=1 used)
├───────────────────┤      │
│ id (PK)           │      │
│ office_name       │      │
│ latitude          │      │
│ longitude         │      │
│ allowed_radius_m  │      │
│ clock_in_time     │      │  (Format: "HH:MM")
│ created_at        │      │
│ updated_at        │      │
└───────────────────┘      │
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                │
└────────────────────────────────────────────────────────────────────────┘

USER                             BACKEND                    DATABASE
────                             ───────                    ────────

1. Enter credentials:
   username: "admin"
   password: "admin123"
      │
      ├─► POST /api/login  ─────────────────►  Query user:
      │   {                                    SELECT * FROM users
      │     username: "admin",                 WHERE username = "admin"
      │     password: "admin123"               
      │   }                                    ◄───┤
      │                                            │
      │                                        Compare password:
      │                                        bcrypt.Compare(
      │                                          hash_from_db,
      │                                          submitted_password
      │                                        )
      │                                            │
      │                                        Valid? ────┐
      │                                                   │
      │                                        Generate JWT:
      │                                        token = jwt.Sign({
      │                                          user_id: 1,
      │                                          role: "manager",
      │                                          exp: now + 24h
      │                                        }, secret_key)
      │                          ◄──────────   
      │
      ◄─── Response:
           {
             "token": "eyJhbGc...",
             "user": {
               "id": 1,
               "username": "admin",
               "role": "manager"
             }
           }
      │
2. Store token in
   localStorage
      │
3. All future requests
   include header:
      │
      ├─► GET /api/admin/records
      │   Headers:
      │   Authorization: Bearer eyJhbGc...
      │                                        Middleware:
      │                                        - Extract token
      │                                        - Verify signature
      │                                        - Check expiry
      │                                        - Extract user_id
      │                                        - Set context
      │                                        - Continue to handler
      │                          ◄──────────   
      │
      ◄─── Protected data

4. Token expires (24h)
      │
      ├─► Any request  ──────────────────────►  Token expired!
      │                                        Return 401
      │                          ◄──────────   
      │
      ◄─── Redirect to login
           (AuthGuard intercepts)
```

---

## 📊 Daily Dashboard Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DAILY DASHBOARD DATA FLOW                             │
└────────────────────────────────────────────────────────────────────────┘

MANAGER OPENS DASHBOARD

      ├─► GET /api/admin/daily-attendance
      │
      │                             Backend Logic:
      │                             ──────────────
      │                             1. Get today's date
      │                             2. Query all users
      │                             3. For each user:
      │                                
      │                                a) Check attendance today
      │                                   SELECT * FROM attendances
      │                                   WHERE user_id = X
      │                                   AND DATE(created_at) = today
      │                                
      │                                b) Check leave today
      │                                   SELECT * FROM leave_requests
      │                                   WHERE user_id = X
      │                                   AND today BETWEEN start_date AND end_date
      │                                
      │                                c) Classify user:
      │                                   - Has approved leave? → ON_LEAVE
      │                                   - Has attendance + late? → LATE
      │                                   - Has attendance + on time? → ON_TIME
      │                                   - No attendance + pending? → PENDING
      │                                   - No attendance? → ABSENT
      │                             
      │                             4. Group by status
      │                             5. Count each group
      │
      ◄─── Response:
           {
             "summary": {
               "total": 28,
               "on_time": 18,
               "late": 2,
               "on_leave": 3,
               "absent": 5
             },
             "employees": [
               {
                 "id": 1,
                 "name": "John Doe",
                 "status": "ON_TIME",
                 "clock_in": "08:55",
                 "distance": 45.2
               },
               ...
             ]
           }
      │
      └─► Display cards with counts
          and expandable employee lists
```

---

## 🌍 GPS Distance Calculation (Haversine)

```
┌────────────────────────────────────────────────────────────────────────┐
│                     HAVERSINE DISTANCE FORMULA                          │
└────────────────────────────────────────────────────────────────────────┘

Given:
  Employee GPS: (lat1, lon1) = (31.5204, 74.3587)  // Lahore
  Office GPS:   (lat2, lon2) = (31.5204, 74.3600)  // Office

Calculate:
  
  Step 1: Convert degrees to radians
    lat1_rad = lat1 × π/180
    lon1_rad = lon1 × π/180
    lat2_rad = lat2 × π/180
    lon2_rad = lon2 × π/180

  Step 2: Calculate differences
    Δlat = lat2_rad - lat1_rad
    Δlon = lon2_rad - lon1_rad

  Step 3: Haversine formula
    a = sin²(Δlat/2) + cos(lat1_rad) × cos(lat2_rad) × sin²(Δlon/2)
    c = 2 × atan2(√a, √(1-a))
    
  Step 4: Distance in meters
    distance = Earth_radius × c
    distance = 6371000 meters × c  (Earth radius ≈ 6371 km)

  Result:
    distance ≈ 145.3 meters

  Decision:
    if distance ≤ allowed_radius (e.g., 500m):
      status = "approved" ✅
    else:
      status = "pending" 🔍

Code Implementation (Go):
────────────────────────
func CalculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
    const earthRadius = 6371000 // meters
    
    lat1Rad := lat1 * math.Pi / 180
    lat2Rad := lat2 * math.Pi / 180
    deltaLat := (lat2 - lat1) * math.Pi / 180
    deltaLon := (lon2 - lon1) * math.Pi / 180
    
    a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
         math.Cos(lat1Rad)*math.Cos(lat2Rad)*
         math.Sin(deltaLon/2)*math.Sin(deltaLon/2)
    
    c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
    
    return earthRadius * c  // Returns meters
}
```

---

**Last Updated**: February 1, 2026  
**Version**: 3.0
