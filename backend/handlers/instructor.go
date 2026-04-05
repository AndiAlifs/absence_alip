package handlers

import (
	"math"
	"net/http"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateStudentInput struct {
	Name            string  `json:"name" binding:"required"`
	TotalQuotaHours float64 `json:"total_quota_hours" binding:"required,gt=0"`
}

type AdjustQuotaInput struct {
	RemainingQuotaHours float64 `json:"remaining_quota_hours" binding:"required,gte=0"`
}

type CreateLearningPlanInput struct {
	StudentID     uint   `json:"student_id" binding:"required"`
	ScheduledDate string `json:"scheduled_date" binding:"required"`
	StartTime     string `json:"start_time" binding:"required"`
	EndTime       string `json:"end_time" binding:"required"`
	Status        string `json:"status"`
}

type StartStudentSessionInput struct {
	StudentID uint    `json:"student_id" binding:"required"`
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
}

type EndStudentSessionInput struct {
	SessionID *uint `json:"session_id"`
	StudentID *uint `json:"student_id"`
}

func CreateStudent(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input CreateStudentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	student := models.Student{
		Name:                input.Name,
		InstructorID:        instructorID,
		TotalQuotaHours:     roundTo2(input.TotalQuotaHours),
		RemainingQuotaHours: roundTo2(input.TotalQuotaHours),
	}

	if err := database.DB.Create(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat data murid"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Murid berhasil dibuat", "data": student})
}

func GetStudents(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var students []models.Student
	if err := database.DB.Where("instructor_id = ?", instructorID).Order("created_at DESC").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data murid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": students})
}

func AdjustStudentQuota(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var input AdjustQuotaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", id, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Murid tidak ditemukan"})
		return
	}

	student.RemainingQuotaHours = roundTo2(input.RemainingQuotaHours)
	if student.RemainingQuotaHours > student.TotalQuotaHours {
		student.TotalQuotaHours = student.RemainingQuotaHours
	}

	if err := database.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui kuota murid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kuota murid berhasil diperbarui", "data": student})
}

func CreateLearningPlan(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input CreateLearningPlanInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", input.StudentID, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Murid tidak valid untuk instruktur ini"})
		return
	}

	scheduledDate, err := time.Parse("2006-01-02", input.ScheduledDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format scheduled_date harus YYYY-MM-DD"})
		return
	}

	if _, err := time.Parse("15:04", input.StartTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format start_time harus HH:MM"})
		return
	}
	if _, err := time.Parse("15:04", input.EndTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format end_time harus HH:MM"})
		return
	}

	status := input.Status
	if status == "" {
		status = "planned"
	}
	if status != "planned" && status != "completed" && status != "cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status tidak valid"})
		return
	}

	plan := models.LearningPlan{
		InstructorID:  instructorID,
		StudentID:     input.StudentID,
		ScheduledDate: scheduledDate,
		StartTime:     input.StartTime,
		EndTime:       input.EndTime,
		Status:        status,
	}

	if err := database.DB.Create(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat jadwal belajar"})
		return
	}

	database.DB.Preload("Student").First(&plan, plan.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Jadwal belajar berhasil dibuat", "data": plan})
}

func GetLearningPlans(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	period := c.DefaultQuery("period", "month")

	now := time.Now()
	var startDate time.Time
	var endDate time.Time

	if period == "week" {
		weekdayOffset := int(now.Weekday())
		if weekdayOffset == 0 {
			weekdayOffset = 7
		}
		startDate = time.Date(now.Year(), now.Month(), now.Day()-weekdayOffset+1, 0, 0, 0, 0, now.Location())
		endDate = startDate.AddDate(0, 0, 7)
	} else {
		startDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		endDate = startDate.AddDate(0, 1, 0)
	}

	if q := c.Query("start_date"); q != "" {
		if parsed, err := time.Parse("2006-01-02", q); err == nil {
			startDate = parsed
		}
	}
	if q := c.Query("end_date"); q != "" {
		if parsed, err := time.Parse("2006-01-02", q); err == nil {
			endDate = parsed.Add(24 * time.Hour)
		}
	}

	var plans []models.LearningPlan
	if err := database.DB.
		Preload("Student").
		Where("instructor_id = ? AND scheduled_date >= ? AND scheduled_date < ?", instructorID, startDate, endDate).
		Order("scheduled_date ASC").
		Order("start_time ASC").
		Find(&plans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil jadwal belajar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": plans})
}

func StartStudentSession(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input StartStudentSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", input.StudentID, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Murid tidak valid untuk instruktur ini"})
		return
	}

	if student.RemainingQuotaHours <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kuota murid sudah habis"})
		return
	}

	var activeCount int64
	database.DB.Model(&models.StudentSession{}).
		Where("instructor_id = ? AND check_out_time IS NULL", instructorID).
		Count(&activeCount)
	if activeCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Masih ada sesi aktif, selesaikan terlebih dahulu"})
		return
	}

	session := models.StudentSession{
		StudentID:    input.StudentID,
		InstructorID: instructorID,
		CheckInTime:  time.Now(),
		Latitude:     input.Latitude,
		Longitude:    input.Longitude,
	}

	if err := database.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memulai sesi murid"})
		return
	}

	database.DB.Preload("Student").First(&session, session.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Sesi murid dimulai", "data": session})
}

func EndStudentSession(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input EndStudentSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var session models.StudentSession
	sessionQuery := database.DB.Where("instructor_id = ? AND check_out_time IS NULL", instructorID)
	if input.SessionID != nil {
		sessionQuery = sessionQuery.Where("id = ?", *input.SessionID)
	}
	if input.StudentID != nil {
		sessionQuery = sessionQuery.Where("student_id = ?", *input.StudentID)
	}
	if err := sessionQuery.Order("check_in_time DESC").First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sesi aktif tidak ditemukan"})
		return
	}

	checkOut := time.Now()
	deducted := roundTo2(checkOut.Sub(session.CheckInTime).Hours())
	if deducted < 0 {
		deducted = 0
	}

	if err := database.DB.Transaction(func(tx *gorm.DB) error {
		session.CheckOutTime = &checkOut
		session.DeductedHours = deducted
		if err := tx.Save(&session).Error; err != nil {
			return err
		}

		var student models.Student
		if err := tx.Where("id = ? AND instructor_id = ?", session.StudentID, instructorID).First(&student).Error; err != nil {
			return err
		}

		remaining := student.RemainingQuotaHours - deducted
		if remaining < 0 {
			remaining = 0
		}
		student.RemainingQuotaHours = roundTo2(remaining)
		return tx.Save(&student).Error
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyelesaikan sesi murid"})
		return
	}

	database.DB.Preload("Student").First(&session, session.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Sesi murid selesai", "data": session})
}

func GetActiveStudentSession(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var session models.StudentSession
	err := database.DB.
		Preload("Student").
		Where("instructor_id = ? AND check_out_time IS NULL", instructorID).
		Order("check_in_time DESC").
		First(&session).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusOK, gin.H{"data": nil})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil sesi aktif"})
		return
	}

	activeHours := roundTo2(time.Since(session.CheckInTime).Hours())
	c.JSON(http.StatusOK, gin.H{"data": session, "active_hours": activeHours})
}

func roundTo2(value float64) float64 {
	return math.Round(value*100) / 100
}
