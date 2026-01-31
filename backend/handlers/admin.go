package handlers

import (
	"net/http"

	"field-attendance-system/database"
	"field-attendance-system/models"

	"github.com/gin-gonic/gin"
)

func GetAllRecords(c *gin.Context) {
	// Returns all employee attendance data for the manager.
	// We might want to preload User info to show names.
	var attendances []models.Attendance
	if result := database.DB.Preload("User").Find(&attendances); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": attendances})
}

func GetAllLeaveRequests(c *gin.Context) {
	// Helper endpoint to see all requests (not explicitly asked but useful for manager dashboard)
	var leaves []models.LeaveRequest
	if result := database.DB.Preload("User").Find(&leaves); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leave requests"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leaves})
}

type UpdateLeaveInput struct {
	Status string `json:"status" binding:"required,oneof=approved rejected"`
}

func UpdateLeaveStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateLeaveInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var leave models.LeaveRequest
	if result := database.DB.First(&leave, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Leave request not found"})
		return
	}

	leave.Status = input.Status
	if result := database.DB.Save(&leave); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave status updated", "data": leave})
}

func GetAllEmployees(c *gin.Context) {
	// Get all users in the system
	var users []models.User
	if result := database.DB.Find(&users); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}
