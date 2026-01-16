package handlers

import (
	"net/http"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"

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

	c.JSON(http.StatusOK, gin.H{"message": "Clock-in successful", "data": attendance})
}
