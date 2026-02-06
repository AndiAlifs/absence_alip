package main

import (
	"log"

	"field-attendance-system/auth"
	"field-attendance-system/database"
	"field-attendance-system/handlers"

	"field-attendance-system/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Load .env file in development
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	database.Connect()

	// Auto-migrate models
	database.DB.AutoMigrate(
		&models.User{},
		&models.Attendance{},
		&models.LeaveRequest{},
		&models.OfficeLocation{},
		&models.ManagerOffice{},
	)

	// Seed admin user and default office assignment
	seedAdminUser()
	seedDefaultOfficeAssignment()

	r := gin.Default()

	// CORS config to allow frontend to communicate
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200", "http://43.163.107.154"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	r.POST("/api/login", handlers.Login)
	r.POST("/api/register", handlers.Register)

	// Protected routes
	protected := r.Group("/api")
	protected.Use(auth.AuthMiddleware())
	{
		protected.POST("/clock-in", handlers.ClockIn)
		protected.POST("/leave", handlers.CreateLeaveRequest)
		protected.GET("/office-location", handlers.GetOfficeLocation)
		protected.GET("/my-attendance/today", handlers.GetTodayAttendance)
		protected.GET("/my-leave/today", handlers.GetTodayLeave)
		protected.GET("/my-offices", handlers.GetEmployeeOffices)

		// Manager routes
		admin := protected.Group("/admin")
		admin.Use(auth.ManagerMiddleware())
		{
			admin.GET("/records", handlers.GetAllRecords)
			admin.GET("/leaves", handlers.GetAllLeaveRequests)
			admin.PATCH("/leave/:id", handlers.UpdateLeaveStatus)
			admin.POST("/users", handlers.CreateUser)
			admin.GET("/employees", handlers.GetAllEmployees)
			admin.POST("/employees", handlers.CreateEmployee)
			admin.PUT("/employees/:id", handlers.UpdateEmployee)
			admin.DELETE("/employees/:id", handlers.DeleteEmployee)
			admin.POST("/office-location", handlers.SetOfficeLocation)
			admin.GET("/pending-clockins", handlers.GetPendingClockIns)
			admin.PATCH("/clockin/:id", handlers.UpdateClockInStatus)
			admin.GET("/daily-attendance", handlers.GetDailyAttendanceDashboard)

			// Office Management Routes
			admin.GET("/offices", handlers.GetAllOffices)
			admin.POST("/offices", handlers.CreateOffice)
			admin.PUT("/offices/:id", handlers.UpdateOffice)
			admin.DELETE("/offices/:id", handlers.DeleteOffice)
			admin.GET("/my-offices", handlers.GetManagerOffices)
			admin.POST("/offices/assign", handlers.AssignOfficeToManager)
			admin.POST("/offices/unassign", handlers.UnassignOfficeFromManager)
		}
	}

	log.Println("Server starting on port 8080...")
	r.Run(":8080")
}

func seedAdminUser() {
	// Check if admin user already exists
	var existingUser models.User
	result := database.DB.Where("username = ?", "admin").First(&existingUser)

	if result.Error == nil {
		log.Println("Admin user already exists, skipping seed")
		return
	}

	// Create admin user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash admin password: %v", err)
		return
	}

	adminUser := models.User{
		Username:     "admin",
		FullName:     "Administrator",
		PasswordHash: string(hashedPassword),
		Role:         "manager",
		IsSuperAdmin: true,
	}

	if err := database.DB.Create(&adminUser).Error; err != nil {
		log.Printf("Failed to create admin user: %v", err)
		return
	}

	log.Println("✓ Admin user created successfully")
	log.Println("  Username: admin")
	log.Println("  Password: admin123")
	log.Println("  Role: manager (Super Admin)")
}

func seedDefaultOfficeAssignment() {
	// Assign first office to super admin manager
	var office models.OfficeLocation
	if err := database.DB.First(&office).Error; err == nil {
		var admin models.User
		if err := database.DB.Where("role = ? AND is_super_admin = ?", "manager", true).First(&admin).Error; err == nil {
			// Check if assignment already exists
			var existingAssignment models.ManagerOffice
			if err := database.DB.Where("manager_id = ? AND office_id = ?", admin.ID, office.ID).
				First(&existingAssignment).Error; err != nil {
				// Create assignment
				assignment := models.ManagerOffice{
					ManagerID: admin.ID,
					OfficeID:  office.ID,
				}
				if err := database.DB.Create(&assignment).Error; err == nil {
					log.Println("✓ Default office assigned to admin")
				}
			}
		}
	}
}
