package seed

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"
	"field-attendance-system/utils"

	"golang.org/x/crypto/bcrypt"
)

// RunAll executes all seeding functions in order
func RunAll() {
	log.Println("Starting database seeding...")
	SeedSuperAdmins()
	SeedOffices()
	SeedDefaultOfficeAssignment()
	SeedEmployees()
	SeedAttendanceRecords()
	log.Println("Database seeding completed!")
}

// SeedSuperAdmins creates two super admin users
func SeedSuperAdmins() {
	admins := []struct {
		username string
		fullName string
		password string
	}{
		{"admin", "Administrator 1", "admin"},
		{"admin2", "Administrator 2", "admin2"},
	}

	for _, admin := range admins {
		// Check if admin user already exists
		var existingUser models.User
		result := database.DB.Where("username = ?", admin.username).First(&existingUser)

		if result.Error == nil {
			log.Printf("Admin user '%s' already exists, skipping", admin.username)
			continue
		}

		// Create admin user
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Failed to hash password for %s: %v", admin.username, err)
			continue
		}

		adminUser := models.User{
			Username:     admin.username,
			FullName:     admin.fullName,
			PasswordHash: string(hashedPassword),
			Role:         "manager",
			IsSuperAdmin: true,
		}

		if err := database.DB.Create(&adminUser).Error; err != nil {
			log.Printf("Failed to create admin user %s: %v", admin.username, err)
			continue
		}

		log.Printf("✓ Admin user '%s' created successfully", admin.username)
		log.Printf("  Username: %s", admin.username)
		log.Printf("  Password: %s", admin.password)
		log.Println("  Role: manager (Super Admin)")
	}
}

// SeedOffices creates the initial office locations
func SeedOffices() {
	offices := []struct {
		name        string
		address     string
		latitude    float64
		longitude   float64
		radius      float64
		clockInTime string
	}{
		{"Kantor Kendari", "", -3.98929160, 122.50396530, 300.00, "05:30"},
		{"Kantor Jakarta", "", -6.17433700, 106.79221800, 350.00, "09:20"},
		{"Kantor Palopo", "", -3.00378910, 120.18998010, 300.00, "02:12"},
		{"Kantor Makassar", "", -5.15187740, 119.44655790, 300.00, "10:00"},
	}

	for _, office := range offices {
		// Check if office already exists
		var existingOffice models.OfficeLocation
		result := database.DB.Where("name = ?", office.name).First(&existingOffice)

		if result.Error == nil {
			log.Printf("Office '%s' already exists, skipping", office.name)
			continue
		}

		newOffice := models.OfficeLocation{
			Name:                office.name,
			Address:             office.address,
			Latitude:            office.latitude,
			Longitude:           office.longitude,
			AllowedRadiusMeters: office.radius,
			ClockInTime:         office.clockInTime,
			IsActive:            true,
		}

		if err := database.DB.Create(&newOffice).Error; err != nil {
			log.Printf("Failed to create office %s: %v", office.name, err)
			continue
		}

		log.Printf("✓ Office '%s' created successfully", office.name)
	}
}

// SeedDefaultOfficeAssignment assigns all offices to the first admin
func SeedDefaultOfficeAssignment() {
	// Get first admin (admin)
	var admin models.User
	if err := database.DB.Where("username = ?", "admin").First(&admin).Error; err != nil {
		log.Println("Admin user not found, skipping office assignment")
		return
	}

	// Get all offices
	var offices []models.OfficeLocation
	if err := database.DB.Find(&offices).Error; err != nil {
		log.Println("No offices found, skipping assignment")
		return
	}

	// Assign all 4 offices to first admin
	for _, office := range offices {
		var existingAssignment models.ManagerOffice
		if err := database.DB.Where("manager_id = ? AND office_id = ?", admin.ID, office.ID).
			First(&existingAssignment).Error; err != nil {
			// Create assignment
			assignment := models.ManagerOffice{
				ManagerID: admin.ID,
				OfficeID:  office.ID,
			}
			if err := database.DB.Create(&assignment).Error; err == nil {
				log.Printf("✓ Office '%s' assigned to admin", office.Name)
			}
		}
	}
}

// SeedEmployees creates initial employees under the first admin
func SeedEmployees() {
	// Get first admin
	var admin models.User
	if err := database.DB.Where("username = ?", "admin").First(&admin).Error; err != nil {
		log.Println("Admin user not found, skipping employee creation")
		return
	}

	// Get first office for assigning to employees
	var firstOffice models.OfficeLocation
	if err := database.DB.First(&firstOffice).Error; err != nil {
		log.Println("No office found, skipping employee creation")
		return
	}

	employeeNames := []string{
		"Andi Prasetyo",
		"Budi Santoso",
		"Citra Dewi",
		"Dian Kartika",
		"Eko Wijaya",
	}

	for i := 1; i <= 5; i++ {
		username := fmt.Sprintf("karyawan%d", i)

		// Check if employee already exists
		var existingUser models.User
		result := database.DB.Where("username = ?", username).First(&existingUser)

		if result.Error == nil {
			log.Printf("Employee '%s' already exists, skipping", username)
			continue
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(username), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Failed to hash password for %s: %v", username, err)
			continue
		}

		employee := models.User{
			Username:     username,
			FullName:     employeeNames[i-1],
			PasswordHash: string(hashedPassword),
			Role:         "employee",
			OfficeID:     &firstOffice.ID,
			IsSuperAdmin: false,
		}

		if err := database.DB.Create(&employee).Error; err != nil {
			log.Printf("Failed to create employee %s: %v", username, err)
			continue
		}

		log.Printf("✓ Employee '%s' created successfully", username)
		log.Printf("  Username: %s", username)
		log.Printf("  Password: %s", username)
		log.Printf("  Full Name: %s", employeeNames[i-1])
	}
}

// SeedAttendanceRecords creates attendance records for the last 7 days
func SeedAttendanceRecords() {
	// Get all employees
	var employees []models.User
	if err := database.DB.Where("role = ?", "employee").Find(&employees).Error; err != nil {
		log.Println("No employees found, skipping attendance records")
		return
	}

	if len(employees) == 0 {
		log.Println("No employees found, skipping attendance records")
		return
	}

	// Get all offices
	var offices []models.OfficeLocation
	if err := database.DB.Find(&offices).Error; err != nil || len(offices) == 0 {
		log.Println("No offices found, skipping attendance records")
		return
	}

	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	recordsCreated := 0
	rejectedCount := 0
	pendingCount := 0

	// Create records for last 7 days
	for day := 0; day < 7; day++ {
		recordDate := time.Now().AddDate(0, 0, -day)

		// Randomly select 5-6 employees to have attendance each day
		numRecords := 5 + rand.Intn(2)
		shuffledEmployees := make([]models.User, len(employees))
		copy(shuffledEmployees, employees)
		rand.Shuffle(len(shuffledEmployees), func(i, j int) {
			shuffledEmployees[i], shuffledEmployees[j] = shuffledEmployees[j], shuffledEmployees[i]
		})

		for i := 0; i < numRecords && i < len(shuffledEmployees); i++ {
			employee := shuffledEmployees[i]
			office := offices[rand.Intn(len(offices))]

			// Determine status with constraints
			var status string
			if rejectedCount < 3 && rand.Float32() < 0.1 {
				status = "rejected"
				rejectedCount++
			} else if pendingCount < 3 && rand.Float32() < 0.1 {
				status = "pending"
				pendingCount++
			} else {
				status = "approved"
			}

			// Random location near office (with some variance)
			latVariance := (rand.Float64() - 0.5) * 0.01
			longVariance := (rand.Float64() - 0.5) * 0.01
			clockInLat := office.Latitude + latVariance
			clockInLong := office.Longitude + longVariance

			// Random clock-in time (between 05:00 and 11:00)
			hour := 5 + rand.Intn(7)
			minute := rand.Intn(60)
			clockInTime := time.Date(recordDate.Year(), recordDate.Month(), recordDate.Day(),
				hour, minute, 0, 0, recordDate.Location())

			// Determine if late based on office clock-in time
			isLate := false
			minutesLate := 0
			// Simple comparison - consider late if after 08:00
			if hour > 8 || (hour == 8 && minute > 0) {
				isLate = true
				minutesLate = (hour-8)*60 + minute
			}

			// Calculate actual distance from office
			distance := utils.CalculateDistance(clockInLat, clockInLong, office.Latitude, office.Longitude)

			var approvedOfficeID *uint
			if status == "approved" {
				approvedOfficeID = &office.ID
			}

			attendance := models.Attendance{
				UserID:           employee.ID,
				ClockInTime:      clockInTime,
				Latitude:         clockInLat,
				Longitude:        clockInLong,
				Status:           status,
				Distance:         distance,
				ApprovedOfficeID: approvedOfficeID,
				IsLate:           isLate,
				MinutesLate:      minutesLate,
			}

			if err := database.DB.Create(&attendance).Error; err != nil {
				log.Printf("Failed to create attendance record: %v", err)
				continue
			}

			recordsCreated++
		}
	}

	log.Printf("✓ Created %d attendance records", recordsCreated)
	log.Printf("  - Approved: %d", recordsCreated-rejectedCount-pendingCount)
	log.Printf("  - Rejected: %d", rejectedCount)
	log.Printf("  - Pending: %d", pendingCount)
}
