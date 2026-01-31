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

	attendance := models.Attendance{
		UserID:      userID,
		ClockInTime: time.Now(),
		Latitude:    input.Latitude,
		Longitude:   input.Longitude,
		Status:      status,
		Distance:    distance,
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
	})
}
