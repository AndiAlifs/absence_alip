package handlers

import (
	"net/http"
	"strconv"

	"field-attendance-system/database"
	"field-attendance-system/models"

	"github.com/gin-gonic/gin"
)

// GetSessionDuration returns the current session duration setting
func GetSessionDuration(c *gin.Context) {
	var setting models.SystemSettings
	result := database.DB.Where("setting_key = ?", models.SettingSessionDurationHours).First(&setting)

	if result.Error != nil {
		// Return default value if not found
		c.JSON(http.StatusOK, gin.H{
			"setting_key":   models.SettingSessionDurationHours,
			"setting_value": "24",
			"description":   "Durasi sesi login default (jam)",
		})
		return
	}

	c.JSON(http.StatusOK, setting)
}

// UpdateSessionDuration updates the session duration setting (manager only)
func UpdateSessionDuration(c *gin.Context) {
	var input struct {
		DurationHours int `json:"duration_hours" binding:"required,min=1,max=168"` // 1 hour to 7 days
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Durasi harus antara 1-168 jam (1 jam - 7 hari)",
			"detail": err.Error(),
		})
		return
	}

	// Check if user is super admin
	userID := c.MustGet("userID").(uint)
	var user models.User
	database.DB.First(&user, userID)

	if !user.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya super admin yang dapat mengubah pengaturan ini"})
		return
	}

	var setting models.SystemSettings
	result := database.DB.Where("setting_key = ?", models.SettingSessionDurationHours).First(&setting)

	if result.Error != nil {
		// Create new setting
		setting = models.SystemSettings{
			SettingKey:   models.SettingSessionDurationHours,
			SettingValue: strconv.Itoa(input.DurationHours),
			Description:  "Durasi sesi login default (jam)",
		}
		database.DB.Create(&setting)
	} else {
		// Update existing setting
		setting.SettingValue = strconv.Itoa(input.DurationHours)
		database.DB.Save(&setting)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Durasi sesi berhasil diperbarui",
		"duration_hours": input.DurationHours,
	})
}

// GetSystemSettings returns all system settings (for manager dashboard)
func GetSystemSettings(c *gin.Context) {
	var settings []models.SystemSettings
	database.DB.Find(&settings)

	// Create a map for easier frontend consumption
	settingsMap := make(map[string]string)
	for _, s := range settings {
		settingsMap[s.SettingKey] = s.SettingValue
	}

	// Add defaults if not set
	if _, ok := settingsMap[models.SettingSessionDurationHours]; !ok {
		settingsMap[models.SettingSessionDurationHours] = "24"
	}

	c.JSON(http.StatusOK, gin.H{"settings": settingsMap})
}

// Helper function to get session duration from database
func GetSessionDurationHours() int {
	var setting models.SystemSettings
	result := database.DB.Where("setting_key = ?", models.SettingSessionDurationHours).First(&setting)

	if result.Error != nil {
		return 24 // Default 24 hours
	}

	hours, err := strconv.Atoi(setting.SettingValue)
	if err != nil || hours <= 0 {
		return 24
	}

	return hours
}
