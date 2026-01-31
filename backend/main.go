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
	database.DB.AutoMigrate(&models.OfficeLocation{})

	// Seed admin user
	seedAdminUser()

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
			admin.GET("/office-location", handlers.GetOfficeLocation)
			admin.POST("/office-location", handlers.SetOfficeLocation)
			admin.GET("/pending-clockins", handlers.GetPendingClockIns)
			admin.PATCH("/clockin/:id", handlers.UpdateClockInStatus)
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
		PasswordHash: string(hashedPassword),
		Role:         "manager",
	}

	if err := database.DB.Create(&adminUser).Error; err != nil {
		log.Printf("Failed to create admin user: %v", err)
		return
	}

	log.Println("✓ Admin user created successfully")
	log.Println("  Username: admin")
	log.Println("  Password: admin123")
	log.Println("  Role: manager")
}
