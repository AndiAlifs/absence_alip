package main

import (
	"log"

	"field-attendance-system/auth"
	"field-attendance-system/database"
	"field-attendance-system/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	// CORS config to allow frontend to communicate
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
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
		}
	}

	log.Println("Server starting on port 8080...")
	r.Run(":8080")
}
