package handlers

import (
	"net/http"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"

	"github.com/gin-gonic/gin"
)

type LeaveInput struct {
	StartDate string `json:"start_date" binding:"required"` // Format YYYY-MM-DD
	EndDate   string `json:"end_date" binding:"required"`   // Format YYYY-MM-DD
	Reason    string `json:"reason" binding:"required"`
}

func CreateLeaveRequest(c *gin.Context) {
	var input LeaveInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(uint)

	// Parse dates
	layout := "2006-01-02"
	start, err := time.Parse(layout, input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format, use YYYY-MM-DD"})
		return
	}
	end, err1 := time.Parse(layout, input.EndDate)
	if err1 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format, use YYYY-MM-DD"})
		return
	}

	leave := models.LeaveRequest{
		UserID:    userID,
		StartDate: start,
		EndDate:   end,
		Reason:    input.Reason,
		Status:    "pending",
	}

	if result := database.DB.Create(&leave); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create leave request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Leave request submitted", "data": leave})
}
