package database

import (
	"log"
	"os"

	"field-attendance-system/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		// Fallback for local development or sandbox if not set
		dsn = "user:password@tcp(127.0.0.1:3306)/attendance_db?charset=utf8mb4&parseTime=True&loc=Local"
	}

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		// In a real scenario, we might want to panic or retry.
		// For this sandbox, we proceed so code compiles, but runtime will fail if no DB.
		return
	}

	log.Println("Database connection established")

	// Auto Migrate
	err = DB.AutoMigrate(&models.User{}, &models.Attendance{}, &models.LeaveRequest{})
	if err != nil {
		log.Printf("Failed to migrate database: %v", err)
	}
}
