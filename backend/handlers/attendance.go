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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Office location not set. Please contact your manager."})
		return
	}

	// Calculate distance between employee and office
	distance := utils.CalculateDistance(
		input.Latitude,
		input.Longitude,
		officeLocation.Latitude,
		officeLocation.Longitude,
	)

	// Check if employee is within allowed radius
	if distance > officeLocation.AllowedRadiusMeters {
		c.JSON(http.StatusForbidden, gin.H{
			"error":           "You are too far from the office location",
			"distance_meters": distance,
			"allowed_meters":  officeLocation.AllowedRadiusMeters,
			"office_location": officeLocation.Name,
		})
		return
	}

	attendance := models.Attendance{
		UserID:      userID,
		ClockInTime: time.Now(),
		Latitude:    input.Latitude,
		Longitude:   input.Longitude,
	}

	if result := database.DB.Create(&attendance); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attendance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Clock-in successful",
		"data":            attendance,
		"distance_meters": distance,
	})
}
