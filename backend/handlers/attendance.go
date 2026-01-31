package handlers

import (
	"net/http"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"
	"field-attendance-system/utils"

	"github.com/gin-gonic/gin"
)

type ClockInInput struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
}

func ClockIn(c *gin.Context) {
	var input ClockInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(uint)

	// Verify user exists
	var user models.User
	if result := database.DB.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak ditemukan. Silakan login ulang."})
		return
	}

	// Get office location settings
	var officeLocation models.OfficeLocation
	if result := database.DB.First(&officeLocation); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Lokasi kantor belum diatur. Silakan hubungi manajer Anda."})
		return
	}

	// Calculate distance between employee and office
	distance := utils.CalculateDistance(
		input.Latitude,
		input.Longitude,
		officeLocation.Latitude,
		officeLocation.Longitude,
	)

	// Determine status based on distance
	status := "approved"
	if distance > officeLocation.AllowedRadiusMeters {
		status = "pending"
	}

	// Calculate if employee is late
	isLate := false
	minutesLate := 0
	if officeLocation.ClockInTime != "" {
		// Parse office clock-in time (format: "HH:MM")
		officialTime, err := time.Parse("15:04", officeLocation.ClockInTime)
		if err == nil {
			// Get current time's hour and minute
			now := time.Now()
			actualTime := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), 0, 0, now.Location())
			officialTimeToday := time.Date(now.Year(), now.Month(), now.Day(), officialTime.Hour(), officialTime.Minute(), 0, 0, now.Location())

			// Check if late
			if actualTime.After(officialTimeToday) {
				isLate = true
				minutesLate = int(actualTime.Sub(officialTimeToday).Minutes())
			}
		}
	}

	attendance := models.Attendance{
		UserID:      userID,
		ClockInTime: time.Now(),
		Latitude:    input.Latitude,
		Longitude:   input.Longitude,
		Status:      status,
		Distance:    distance,
		IsLate:      isLate,
		MinutesLate: minutesLate,
	}

	if result := database.DB.Create(&attendance); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attendance record"})
		return
	}

	message := "Berhasil melakukan clock-in"
	if status == "pending" {
		message = "Clock-in dicatat. Menunggu persetujuan manajer karena lokasi terlalu jauh dari kantor."
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         message,
		"data":            attendance,
		"distance_meters": distance,
		"status":          status,
		"needs_approval":  status == "pending",
		"is_late":         isLate,
		"minutes_late":    minutesLate,
	})
}
