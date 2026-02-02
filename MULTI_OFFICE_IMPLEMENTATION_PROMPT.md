# Multi-Office Feature Implementation Prompt

## 🎯 Objective
Implement multi-office management feature allowing managers to handle 1-4 office locations, with auto-approval when employees clock in within radius of ANY managed office.

---

## 📋 User Stories to Implement
- **US-058:** Manager Manage Multiple Offices (Database + Backend)
- **US-067:** Dedicated Office Management Page (Frontend UI)
- **US-059:** Manager Assign Employees to Office (Backend + Frontend)
- **US-065:** Multi-Manager Access Control (System Logic)

---

## 🗄️ PHASE 1: Database Changes

### 1.1 Create `manager_offices` Junction Table
**Purpose:** Link managers to 1-4 office locations

```sql
CREATE TABLE manager_offices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    manager_id INT UNSIGNED NOT NULL,
    office_id INT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (office_id) REFERENCES office_locations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_manager_office (manager_id, office_id)
);

-- Add index for performance
CREATE INDEX idx_manager_id ON manager_offices(manager_id);
CREATE INDEX idx_office_id ON manager_offices(office_id);
```

### 1.2 Modify `office_locations` Table
**Remove singleton constraint, support multiple offices**

```sql
-- Add new fields
ALTER TABLE office_locations 
ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT 'Main Office',
ADD COLUMN address VARCHAR(255),
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- If there's an existing office location, update it
UPDATE office_locations SET name = 'Main Office' WHERE id = 1;
```

### 1.3 Modify `users` Table
**Add office assignment and super admin flag**

```sql
ALTER TABLE users 
ADD COLUMN office_id INT UNSIGNED,
ADD COLUMN is_super_admin BOOLEAN DEFAULT FALSE,
ADD FOREIGN KEY (office_id) REFERENCES office_locations(id) ON DELETE SET NULL;

-- Set existing admin as super admin
UPDATE users SET is_super_admin = TRUE WHERE role = 'manager' LIMIT 1;
```

### 1.4 Modify `attendances` Table
**Track which office was used for validation**

```sql
ALTER TABLE attendances 
ADD COLUMN approved_office_id INT UNSIGNED,
ADD FOREIGN KEY (approved_office_id) REFERENCES office_locations(id) ON DELETE SET NULL;
```

---

## 🔧 PHASE 2: Backend Implementation (Go)

### 2.1 Update Models (`backend/models/models.go`)

```go
// Update OfficeLocation model
type OfficeLocation struct {
    ID            uint      `gorm:"primaryKey" json:"id"`
    Name          string    `gorm:"type:varchar(100);not null" json:"name"`
    Address       string    `gorm:"type:varchar(255)" json:"address"`
    Latitude      float64   `gorm:"type:decimal(10,8);not null" json:"latitude"`
    Longitude     float64   `gorm:"type:decimal(11,8);not null" json:"longitude"`
    AllowedRadius float64   `gorm:"type:decimal(10,2);not null" json:"allowed_radius_meters"`
    ClockInTime   string    `gorm:"type:varchar(5);not null" json:"clock_in_time"`
    IsActive      bool      `gorm:"default:true" json:"is_active"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}

// New ManagerOffice junction model
type ManagerOffice struct {
    ID         uint      `gorm:"primaryKey" json:"id"`
    ManagerID  uint      `gorm:"not null" json:"manager_id"`
    OfficeID   uint      `gorm:"not null" json:"office_id"`
    AssignedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"assigned_at"`
    
    // Relations
    Manager *User           `gorm:"foreignKey:ManagerID" json:"manager,omitempty"`
    Office  *OfficeLocation `gorm:"foreignKey:OfficeID" json:"office,omitempty"`
}

// Update User model
type User struct {
    ID            uint      `gorm:"primaryKey" json:"id"`
    Username      string    `gorm:"unique;not null" json:"username"`
    FullName      string    `gorm:"type:varchar(255)" json:"full_name,omitempty"`
    Password      string    `gorm:"not null" json:"-"`
    Role          string    `gorm:"type:ENUM('employee', 'manager');default:'employee'" json:"role"`
    OfficeID      *uint     `json:"office_id,omitempty"` // Employee's primary office
    IsSuperAdmin  bool      `gorm:"default:false" json:"is_super_admin"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
    
    // Relations
    Office        *OfficeLocation `gorm:"foreignKey:OfficeID" json:"office,omitempty"`
}

// Update Attendance model
type Attendance struct {
    ID                uint      `gorm:"primaryKey" json:"id"`
    UserID            uint      `gorm:"not null" json:"user_id"`
    ClockInTime       time.Time `gorm:"not null" json:"clock_in_time"`
    Latitude          float64   `gorm:"type:decimal(10,8);not null" json:"latitude"`
    Longitude         float64   `gorm:"type:decimal(11,8);not null" json:"longitude"`
    DistanceFromOffice float64  `gorm:"type:decimal(10,2)" json:"distance_from_office_meters"`
    Status            string    `gorm:"type:ENUM('approved', 'pending', 'rejected');default:'approved'" json:"status"`
    IsLate            bool      `gorm:"default:false" json:"is_late"`
    MinutesLate       int       `gorm:"default:0" json:"minutes_late"`
    ApprovedOfficeID  *uint     `json:"approved_office_id,omitempty"` // Which office validated this
    
    User              User      `gorm:"foreignKey:UserID" json:"user"`
    ApprovedOffice    *OfficeLocation `gorm:"foreignKey:ApprovedOfficeID" json:"approved_office,omitempty"`
}
```

### 2.2 Create Office Management Handler (`backend/handlers/office_management.go`)

```go
package handlers

import (
    "field-attendance-system/database"
    "field-attendance-system/models"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

// GetAllOffices - Get all offices (super admin) or manager's assigned offices
func GetAllOffices(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }
    
    var offices []models.OfficeLocation
    
    if user.IsSuperAdmin {
        // Super admin sees all offices
        database.DB.Where("is_active = ?", true).Find(&offices)
    } else if user.Role == "manager" {
        // Regular manager sees only assigned offices
        database.DB.
            Joins("JOIN manager_offices ON manager_offices.office_id = office_locations.id").
            Where("manager_offices.manager_id = ? AND office_locations.is_active = ?", userID, true).
            Find(&offices)
    } else {
        c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"data": offices})
}

// CreateOffice - Super admin only
func CreateOffice(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }
    
    if !user.IsSuperAdmin {
        c.JSON(http.StatusForbidden, gin.H{"error": "Hanya super admin yang dapat membuat kantor"})
        return
    }
    
    var input struct {
        Name          string  `json:"name" binding:"required"`
        Address       string  `json:"address"`
        Latitude      float64 `json:"latitude" binding:"required"`
        Longitude     float64 `json:"longitude" binding:"required"`
        AllowedRadius float64 `json:"allowed_radius_meters" binding:"required,gt=0"`
        ClockInTime   string  `json:"clock_in_time" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    office := models.OfficeLocation{
        Name:          input.Name,
        Address:       input.Address,
        Latitude:      input.Latitude,
        Longitude:     input.Longitude,
        AllowedRadius: input.AllowedRadius,
        ClockInTime:   input.ClockInTime,
        IsActive:      true,
    }
    
    if err := database.DB.Create(&office).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat kantor"})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{"message": "Kantor berhasil dibuat", "data": office})
}

// UpdateOffice - Manager can update if assigned, super admin can update any
func UpdateOffice(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    officeID, _ := strconv.Atoi(c.Param("id"))
    
    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }
    
    // Check permission
    if !user.IsSuperAdmin {
        var count int64
        database.DB.Model(&models.ManagerOffice{}).
            Where("manager_id = ? AND office_id = ?", userID, officeID).
            Count(&count)
        
        if count == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak memiliki akses ke kantor ini"})
            return
        }
    }
    
    var office models.OfficeLocation
    if err := database.DB.First(&office, officeID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Kantor tidak ditemukan"})
        return
    }
    
    var input struct {
        Name          *string  `json:"name"`
        Address       *string  `json:"address"`
        Latitude      *float64 `json:"latitude"`
        Longitude     *float64 `json:"longitude"`
        AllowedRadius *float64 `json:"allowed_radius_meters"`
        ClockInTime   *string  `json:"clock_in_time"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Update fields
    if input.Name != nil {
        office.Name = *input.Name
    }
    if input.Address != nil {
        office.Address = *input.Address
    }
    if input.Latitude != nil {
        office.Latitude = *input.Latitude
    }
    if input.Longitude != nil {
        office.Longitude = *input.Longitude
    }
    if input.AllowedRadius != nil {
        office.AllowedRadius = *input.AllowedRadius
    }
    if input.ClockInTime != nil {
        office.ClockInTime = *input.ClockInTime
    }
    
    if err := database.DB.Save(&office).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate kantor"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Kantor berhasil diupdate", "data": office})
}

// AssignOfficeToManager - Super admin assigns office to manager (max 4)
func AssignOfficeToManager(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }
    
    if !user.IsSuperAdmin {
        c.JSON(http.StatusForbidden, gin.H{"error": "Hanya super admin yang dapat assign kantor"})
        return
    }
    
    var input struct {
        ManagerID uint `json:"manager_id" binding:"required"`
        OfficeID  uint `json:"office_id" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Check manager exists and is a manager
    var manager models.User
    if err := database.DB.First(&manager, input.ManagerID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Manager tidak ditemukan"})
        return
    }
    
    if manager.Role != "manager" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "User bukan manager"})
        return
    }
    
    // Check office exists
    var office models.OfficeLocation
    if err := database.DB.First(&office, input.OfficeID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Kantor tidak ditemukan"})
        return
    }
    
    // Check if already assigned
    var existingAssignment models.ManagerOffice
    if err := database.DB.Where("manager_id = ? AND office_id = ?", input.ManagerID, input.OfficeID).
        First(&existingAssignment).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Manager sudah di-assign ke kantor ini"})
        return
    }
    
    // Check manager doesn't have more than 4 offices
    var count int64
    database.DB.Model(&models.ManagerOffice{}).Where("manager_id = ?", input.ManagerID).Count(&count)
    
    if count >= 4 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Manager sudah memiliki 4 kantor (maksimal)"})
        return
    }
    
    // Create assignment
    assignment := models.ManagerOffice{
        ManagerID: input.ManagerID,
        OfficeID:  input.OfficeID,
    }
    
    if err := database.DB.Create(&assignment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal assign kantor"})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{"message": "Kantor berhasil di-assign ke manager"})
}

// UnassignOfficeFromManager - Super admin removes office from manager (must keep at least 1)
func UnassignOfficeFromManager(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }
    
    if !user.IsSuperAdmin {
        c.JSON(http.StatusForbidden, gin.H{"error": "Hanya super admin yang dapat unassign kantor"})
        return
    }
    
    var input struct {
        ManagerID uint `json:"manager_id" binding:"required"`
        OfficeID  uint `json:"office_id" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Check manager has more than 1 office
    var count int64
    database.DB.Model(&models.ManagerOffice{}).Where("manager_id = ?", input.ManagerID).Count(&count)
    
    if count <= 1 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Manager harus memiliki minimal 1 kantor"})
        return
    }
    
    // Delete assignment
    result := database.DB.Where("manager_id = ? AND office_id = ?", input.ManagerID, input.OfficeID).
        Delete(&models.ManagerOffice{})
    
    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Assignment tidak ditemukan"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Kantor berhasil di-unassign dari manager"})
}

// GetManagerOffices - Get offices assigned to a manager
func GetManagerOffices(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var offices []models.OfficeLocation
    database.DB.
        Joins("JOIN manager_offices ON manager_offices.office_id = office_locations.id").
        Where("manager_offices.manager_id = ? AND office_locations.is_active = ?", userID, true).
        Find(&offices)
    
    c.JSON(http.StatusOK, gin.H{"data": offices, "count": len(offices)})
}
```

### 2.3 Update Attendance Handler (`backend/handlers/attendance.go`)

**CRITICAL: Update ClockIn to check ALL manager's offices**

```go
func ClockIn(c *gin.Context) {
    userID := c.MustGet("userID").(uint)

    var input struct {
        Latitude  float64 `json:"latitude" binding:"required"`
        Longitude float64 `json:"longitude" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Get employee with manager info
    var user models.User
    if err := database.DB.Preload("Office").First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
        return
    }

    // Get employee's manager
    var manager models.User
    if err := database.DB.Where("role = ?", "manager").First(&manager).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Manager tidak ditemukan"})
        return
    }

    // **CRITICAL: Get ALL offices managed by the manager (up to 4)**
    var managerOffices []models.OfficeLocation
    database.DB.
        Joins("JOIN manager_offices ON manager_offices.office_id = office_locations.id").
        Where("manager_offices.manager_id = ? AND office_locations.is_active = ?", manager.ID, true).
        Find(&managerOffices)

    if len(managerOffices) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Lokasi kantor belum diatur"})
        return
    }

    // Check distance against ALL manager's offices
    var closestOffice *models.OfficeLocation
    var minDistance float64 = -1
    var isWithinRadius bool = false

    for i := range managerOffices {
        office := &managerOffices[i]
        distance := utils.CalculateDistance(
            input.Latitude,
            input.Longitude,
            office.Latitude,
            office.Longitude,
        )

        if minDistance == -1 || distance < minDistance {
            minDistance = distance
            closestOffice = office
        }

        if distance <= office.AllowedRadius {
            isWithinRadius = true
            closestOffice = office
            break // Found a valid office, no need to check others
        }
    }

    // Determine status
    status := "pending"
    var approvedOfficeID *uint
    
    if isWithinRadius {
        status = "approved"
        approvedOfficeID = &closestOffice.ID
    }

    // Check if late
    isLate := false
    minutesLate := 0
    clockInTime := time.Now()

    if closestOffice != nil && closestOffice.ClockInTime != "" {
        officialTime, err := time.Parse("15:04", closestOffice.ClockInTime)
        if err == nil {
            now := time.Now()
            actualTime := time.Date(now.Year(), now.Month(), now.Day(),
                now.Hour(), now.Minute(), 0, 0, now.Location())
            officialDateTime := time.Date(now.Year(), now.Month(), now.Day(),
                officialTime.Hour(), officialTime.Minute(), 0, 0, now.Location())

            if actualTime.After(officialDateTime) {
                isLate = true
                minutesLate = int(actualTime.Sub(officialDateTime).Minutes())
            }
        }
    }

    // Create attendance record
    attendance := models.Attendance{
        UserID:             userID,
        ClockInTime:        clockInTime,
        Latitude:           input.Latitude,
        Longitude:          input.Longitude,
        DistanceFromOffice: minDistance,
        Status:             status,
        IsLate:             isLate,
        MinutesLate:        minutesLate,
        ApprovedOfficeID:   approvedOfficeID,
    }

    if err := database.DB.Create(&attendance).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal melakukan clock-in"})
        return
    }

    message := "Clock-in berhasil"
    if status == "pending" {
        message = "Clock-in berhasil, menunggu persetujuan manager (di luar radius kantor)"
    }
    if isLate {
        message += fmt.Sprintf(" - Terlambat %d menit", minutesLate)
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": message,
        "data":    attendance,
        "office_used": closestOffice.Name,
    })
}
```

### 2.4 Update Routes (`backend/main.go`)

```go
// Add to admin routes
admin := api.Group("/admin")
admin.Use(auth.AuthMiddleware(), auth.ManagerMiddleware())
{
    // Existing routes...
    
    // Office Management Routes
    admin.GET("/offices", handlers.GetAllOffices)
    admin.POST("/offices", handlers.CreateOffice)              // Super admin only
    admin.PUT("/offices/:id", handlers.UpdateOffice)
    admin.GET("/my-offices", handlers.GetManagerOffices)
    admin.POST("/offices/assign", handlers.AssignOfficeToManager)      // Super admin only
    admin.POST("/offices/unassign", handlers.UnassignOfficeFromManager) // Super admin only
}

// Employee routes
api.GET("/my-offices", auth.AuthMiddleware(), handlers.GetEmployeeOffices) // Show all valid offices
```

### 2.5 Update Migration (`backend/main.go`)

```go
// In main.go, update AutoMigrate
database.DB.AutoMigrate(
    &models.User{},
    &models.Attendance{},
    &models.LeaveRequest{},
    &models.OfficeLocation{},
    &models.ManagerOffice{}, // Add this
)

// After migration, seed default office assignment
seedDefaultOfficeAssignment()

func seedDefaultOfficeAssignment() {
    var office models.OfficeLocation
    if err := database.DB.First(&office).Error; err == nil {
        var admin models.User
        if err := database.DB.Where("role = ? AND is_super_admin = ?", "manager", true).First(&admin).Error; err == nil {
            // Assign first office to admin
            var existingAssignment models.ManagerOffice
            if err := database.DB.Where("manager_id = ? AND office_id = ?", admin.ID, office.ID).
                First(&existingAssignment).Error; err != nil {
                // Create assignment
                database.DB.Create(&models.ManagerOffice{
                    ManagerID: admin.ID,
                    OfficeID:  office.ID,
                })
            }
        }
    }
}
```

---

## 🎨 PHASE 3: Frontend Implementation (Angular)

### 3.1 Create Office Management Module

**Create new module:**
```bash
ng generate module components/office-management --routing
ng generate component components/office-management/office-management
ng generate component components/office-management/office-list
ng generate component components/office-management/office-form
ng generate component components/office-management/office-map
```

### 3.2 Office Management Routing (`office-management-routing.module.ts`)

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeManagementComponent } from './office-management/office-management.component';
import { AuthGuard } from '../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: OfficeManagementComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeManagementRoutingModule { }
```

### 3.3 Update App Routing (`app.module.ts`)

```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clock-in', component: ClockInComponent, canActivate: [AuthGuard] },
  { path: 'leave-request', component: LeaveRequestComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ManagerDashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'admin/offices', 
    loadChildren: () => import('./components/office-management/office-management.module')
      .then(m => m.OfficeManagementModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
```

### 3.4 Update API Service (`services/api.service.ts`)

```typescript
// Add office management methods
getOffices(): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/offices`, { headers: this.getHeaders() });
}

getMyOffices(): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/my-offices`, { headers: this.getHeaders() });
}

createOffice(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/admin/offices`, data, { headers: this.getHeaders() });
}

updateOffice(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/admin/offices/${id}`, data, { headers: this.getHeaders() });
}

assignOfficeToManager(managerId: number, officeId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/admin/offices/assign`, 
    { manager_id: managerId, office_id: officeId }, 
    { headers: this.getHeaders() }
  );
}

unassignOfficeFromManager(managerId: number, officeId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/admin/offices/unassign`, 
    { manager_id: managerId, office_id: officeId }, 
    { headers: this.getHeaders() }
  );
}

// For employees to see valid offices
getEmployeeOffices(): Observable<any> {
  return this.http.get(`${this.apiUrl}/my-offices`, { headers: this.getHeaders() });
}
```

### 3.5 Office Management Component (`office-management.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface Office {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  allowed_radius_meters: number;
  clock_in_time: string;
  is_active: boolean;
}

@Component({
  selector: 'app-office-management',
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Office Management</h1>
            <p class="text-gray-600">Manage office locations ({{offices.length}} of 4)</p>
          </div>
          <div class="space-x-3">
            <button (click)="goToDashboard()" 
                    class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              ← Back to Dashboard
            </button>
            <button *ngIf="isSuperAdmin" 
                    (click)="showAddOfficeForm()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Add New Office
            </button>
          </div>
        </div>

        <!-- Office List -->
        <app-office-list 
          [offices]="offices" 
          [isSuperAdmin]="isSuperAdmin"
          (editOffice)="editOffice($event)"
          (deleteOffice)="deleteOffice($event)">
        </app-office-list>

        <!-- Map View -->
        <app-office-map [offices]="offices"></app-office-map>

        <!-- Add/Edit Form Modal -->
        <app-office-form 
          *ngIf="showForm"
          [office]="selectedOffice"
          [mode]="formMode"
          (save)="saveOffice($event)"
          (cancel)="closeForm()">
        </app-office-form>
      </div>
    </div>
  `
})
export class OfficeManagementComponent implements OnInit {
  offices: Office[] = [];
  isSuperAdmin: boolean = false;
  showForm: boolean = false;
  formMode: 'add' | 'edit' = 'add';
  selectedOffice: Office | null = null;

  constructor(private api: ApiService) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isSuperAdmin = user.is_super_admin || false;
  }

  ngOnInit() {
    this.loadOffices();
  }

  loadOffices() {
    this.api.getMyOffices().subscribe({
      next: (response) => {
        this.offices = response.data || [];
      },
      error: (error) => {
        console.error('Error loading offices:', error);
      }
    });
  }

  showAddOfficeForm() {
    this.formMode = 'add';
    this.selectedOffice = null;
    this.showForm = true;
  }

  editOffice(office: Office) {
    this.formMode = 'edit';
    this.selectedOffice = office;
    this.showForm = true;
  }

  saveOffice(officeData: any) {
    if (this.formMode === 'add') {
      this.api.createOffice(officeData).subscribe({
        next: () => {
          alert('Office created successfully');
          this.loadOffices();
          this.closeForm();
        },
        error: (error) => {
          alert('Error creating office: ' + (error.error?.error || 'Unknown error'));
        }
      });
    } else {
      this.api.updateOffice(this.selectedOffice!.id, officeData).subscribe({
        next: () => {
          alert('Office updated successfully');
          this.loadOffices();
          this.closeForm();
        },
        error: (error) => {
          alert('Error updating office: ' + (error.error?.error || 'Unknown error'));
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedOffice = null;
  }

  goToDashboard() {
    window.location.href = '/admin';
  }

  deleteOffice(office: Office) {
    if (confirm(`Delete office "${office.name}"?`)) {
      // TODO: Implement delete
    }
  }
}
```

### 3.6 Office List Component (`office-list.component.ts`)

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-office-list',
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div *ngFor="let office of offices" 
           class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{office.name}}</h3>
        <p class="text-sm text-gray-600 mb-3">{{office.address || 'No address'}}</p>
        
        <div class="space-y-1 text-sm mb-4">
          <p><strong>Radius:</strong> {{office.allowed_radius_meters}}m</p>
          <p><strong>Clock-in time:</strong> {{office.clock_in_time}}</p>
          <p><strong>Location:</strong> {{office.latitude}}, {{office.longitude}}</p>
        </div>
        
        <div class="flex space-x-2">
          <button (click)="editOffice.emit(office)" 
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Edit
          </button>
          <button (click)="viewOnMap(office)" 
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Map
          </button>
        </div>
      </div>
    </div>
  `
})
export class OfficeListComponent {
  @Input() offices: any[] = [];
  @Input() isSuperAdmin: boolean = false;
  @Output() editOffice = new EventEmitter<any>();
  @Output() deleteOffice = new EventEmitter<any>();

  viewOnMap(office: any) {
    // Scroll to map and center on office
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}
```

### 3.7 Office Form Component (`office-form.component.ts`)

```typescript
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-office-form',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">
          {{mode === 'add' ? 'Add New Office' : 'Edit Office'}}
        </h2>
        
        <form [formGroup]="officeForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Office Name *</label>
              <input type="text" formControlName="name" 
                     class="w-full border rounded px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Address</label>
              <input type="text" formControlName="address" 
                     class="w-full border rounded px-3 py-2">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Latitude *</label>
                <input type="number" step="any" formControlName="latitude" 
                       class="w-full border rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Longitude *</label>
                <input type="number" step="any" formControlName="longitude" 
                       class="w-full border rounded px-3 py-2">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Allowed Radius (meters) *</label>
              <input type="number" formControlName="allowed_radius_meters" 
                     class="w-full border rounded px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Clock-in Time (HH:MM) *</label>
              <input type="time" formControlName="clock_in_time" 
                     class="w-full border rounded px-3 py-2">
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button type="submit" 
                    [disabled]="!officeForm.valid"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
              {{mode === 'add' ? 'Create Office' : 'Update Office'}}
            </button>
            <button type="button" (click)="cancel.emit()" 
                    class="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OfficeFormComponent implements OnInit {
  @Input() office: any = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  officeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.officeForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      allowed_radius_meters: ['', [Validators.required, Validators.min(1)]],
      clock_in_time: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.mode === 'edit' && this.office) {
      this.officeForm.patchValue(this.office);
    }
  }

  onSubmit() {
    if (this.officeForm.valid) {
      this.save.emit(this.officeForm.value);
    }
  }
}
```

### 3.8 Update Manager Dashboard

**Add navigation link to Office Management:**

```typescript
// In manager-dashboard.component.ts template, add button:
<button (click)="goToOfficeManagement()" 
        class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
  Manage Offices ({{officeCount}})
</button>

// In component class:
officeCount: number = 0;

ngOnInit() {
  // ... existing code
  this.loadOfficeCount();
}

loadOfficeCount() {
  this.api.getMyOffices().subscribe({
    next: (response) => {
      this.officeCount = response.count || 0;
    }
  });
}

goToOfficeManagement() {
  window.location.href = '/admin/offices';
}

// Remove existing office configuration section from dashboard template
```

---

## ✅ PHASE 4: Testing Checklist

### Database Tests
- [ ] Create manager_offices table successfully
- [ ] Enforce max 4 offices per manager
- [ ] Prevent deleting manager's last office
- [ ] Foreign key constraints work correctly
- [ ] Migration runs without errors

### Backend Tests
- [ ] Super admin can create offices
- [ ] Super admin can assign/unassign offices to managers
- [ ] Manager cannot assign more than 4 offices
- [ ] Manager cannot be unassigned from last office
- [ ] Regular manager can only see assigned offices
- [ ] ClockIn checks ALL manager's offices for proximity
- [ ] Attendance record stores which office was used
- [ ] Manager can update offices they manage
- [ ] Manager cannot update offices they don't manage

### Frontend Tests
- [ ] Office Management page loads
- [ ] Office list displays correctly
- [ ] Add office form works (super admin)
- [ ] Edit office form works
- [ ] Map displays all offices with markers
- [ ] Navigation from dashboard to office management works
- [ ] Office count badge updates correctly
- [ ] Form validation prevents invalid data
- [ ] Error messages display properly

### Integration Tests
- [ ] Employee clocks in within radius of office A → auto-approved
- [ ] Employee clocks in within radius of office B → auto-approved
- [ ] Employee clocks in outside all offices → pending
- [ ] Dashboard filters by selected office
- [ ] Reports show data from all managed offices
- [ ] Employee sees all valid offices on their view

---

## 🚀 Implementation Order

1. **Database** (Day 1)
   - Run migration scripts
   - Seed default data
   - Test constraints

2. **Backend** (Days 2-3)
   - Update models
   - Create office management handlers
   - Update attendance validation logic
   - Add routes

3. **Frontend** (Days 4-5)
   - Create office management module
   - Build components
   - Update API service
   - Update dashboard navigation

4. **Testing** (Day 6)
   - Test all scenarios
   - Fix bugs
   - Verify constraints

---

## 📝 Notes

- **Super Admin:** First manager user with `is_super_admin = true`
- **Constraint:** Manager must have 1-4 offices (minimum 1, maximum 4)
- **Auto-Approval:** Employee auto-approved if within radius of ANY manager's office
- **Attendance Record:** Stores which office validated the clock-in (`approved_office_id`)
- **Office Selector:** Dashboard has dropdown to filter by specific office when managing multiple

---

## 🎯 Success Criteria

- ✅ Manager can be assigned 1-4 offices
- ✅ Employee auto-approved at ANY managed office
- ✅ Dedicated Office Management page works
- ✅ Dashboard shows office selector
- ✅ Reports filter by office
- ✅ All constraints enforced (min 1, max 4)
- ✅ Map shows all offices correctly
- ✅ Attendance records which office was used
