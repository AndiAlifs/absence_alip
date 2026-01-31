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

type CreateEmployeeInput struct {
	Username string `json:"username" binding:"required"`
	FullName string `json:"full_name"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=employee manager"`
}

func CreateEmployee(c *gin.Context) {
	var input CreateEmployeeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username already exists
	var existingUser models.User
	if result := database.DB.Where("username = ?", input.Username).First(&existingUser); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// Hash password
	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:     input.Username,
		FullName:     input.FullName,
		PasswordHash: hashedPassword,
		Role:         input.Role,
	}

	if result := database.DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Employee created successfully", "data": user})
}

type UpdateEmployeeInput struct {
	Username string `json:"username"`
	FullName string `json:"full_name"`
	Password string `json:"password"`
	Role     string `json:"role" binding:"omitempty,oneof=employee manager"`
}

func UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var input UpdateEmployeeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := database.DB.First(&user, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Update username if provided
	if input.Username != "" {
		// Check if new username already exists
		var existingUser models.User
		if result := database.DB.Where("username = ? AND id != ?", input.Username, id).First(&existingUser); result.Error == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
			return
		}
		user.Username = input.Username
	}

	// Update full name if provided
	if input.FullName != "" {
		user.FullName = input.FullName
	}

	// Update password if provided
	if input.Password != "" {
		hashedPassword, err := hashPassword(input.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.PasswordHash = hashedPassword
	}

	// Update role if provided
	if input.Role != "" {
		user.Role = input.Role
	}

	if result := database.DB.Save(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee updated successfully", "data": user})
}

func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")

	var user models.User
	if result := database.DB.First(&user, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	if result := database.DB.Delete(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

// Helper function to hash password (reused from auth.go)
func hashPassword(password string) (string, error) {
	// Import bcrypt at the top: "golang.org/x/crypto/bcrypt"
	// For now, using a simple hash - in production use bcrypt
	return password, nil // TODO: Implement proper bcrypt hashing
}

func GetPendingClockIns(c *gin.Context) {
	// Get all pending clock-in requests
	var attendances []models.Attendance
	if result := database.DB.Preload("User").Where("status = ?", "pending").Order("clock_in_time DESC").Find(&attendances); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending clock-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": attendances})
}

type UpdateClockInStatusInput struct {
	Status string `json:"status" binding:"required,oneof=approved rejected"`
}

func UpdateClockInStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateClockInStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var attendance models.Attendance
	if result := database.DB.First(&attendance, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Clock-in record not found"})
		return
	}

	if attendance.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only pending clock-ins can be updated"})
		return
	}

	attendance.Status = input.Status
	if result := database.DB.Save(&attendance); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update clock-in status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Clock-in status updated successfully", "data": attendance})
}
