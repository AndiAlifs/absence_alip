package handlers

import (
	"fmt"
	"math"
	"net/http"
	"strings"
	"time"

	"field-attendance-system/database"
	"field-attendance-system/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateStudentInput struct {
	Name            string  `json:"name" binding:"required"`
	TotalQuotaHours float64 `json:"total_quota_hours" binding:"required,gt=0"`
	WhatsApp        string  `json:"whatsapp" binding:"required"`
	Gender          string  `json:"gender" binding:"required"`
	MeetingPoint    string  `json:"meeting_point"`

	// Optional initial session plan
	InitialScheduleDate string `json:"initial_schedule_date"`
	InitialStartTime    string `json:"initial_start_time"`
	InitialEndTime      string `json:"initial_end_time"`
}

type UpdateStudentInput struct {
	Name         string `json:"name"`
	WhatsApp     string `json:"whatsapp"`
	Gender       string `json:"gender"`
	MeetingPoint string `json:"meeting_point"`
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

type UpdateLearningPlanInput struct {
	ScheduledDate string `json:"scheduled_date"`
	StartTime     string `json:"start_time"`
	EndTime       string `json:"end_time"`
	Status        string `json:"status"`
}

type StartStudentSessionInput struct {
	StudentID uint    `json:"student_id" binding:"required"`
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
}

type EndStudentSessionInput struct {
	SessionID *uint  `json:"session_id"`
	StudentID *uint  `json:"student_id"`
	Notes     string `json:"notes"`
}

// ==================== STUDENT CRUD ====================

func CreateStudent(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input CreateStudentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate gender
	if input.Gender != "male" && input.Gender != "female" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gender harus 'male' atau 'female'"})
		return
	}

	student := models.Student{
		Name:                input.Name,
		InstructorID:        instructorID,
		TotalQuotaHours:     roundTo2(input.TotalQuotaHours),
		RemainingQuotaHours: roundTo2(input.TotalQuotaHours),
		WhatsApp:            normalizeWhatsApp(input.WhatsApp),
		Gender:              input.Gender,
		MeetingPoint:        input.MeetingPoint,
		IsActive:            true,
	}

	if err := database.DB.Create(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat data murid"})
		return
	}

	// If initial schedule is provided, create it
	if input.InitialScheduleDate != "" && input.InitialStartTime != "" && input.InitialEndTime != "" {
		scheduledDate, err := time.Parse("2006-01-02", input.InitialScheduleDate)
		if err == nil {
			plan := models.LearningPlan{
				InstructorID:  instructorID,
				StudentID:     student.ID,
				ScheduledDate: scheduledDate,
				StartTime:     input.InitialStartTime,
				EndTime:       input.InitialEndTime,
				Status:        "planned",
			}
			database.DB.Create(&plan)
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Murid berhasil dibuat", "data": student})
}

func GetStudents(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	activeFilter := c.DefaultQuery("active", "all")

	query := database.DB.Where("instructor_id = ?", instructorID)

	if activeFilter == "true" {
		query = query.Where("is_active = ?", true)
	} else if activeFilter == "false" {
		query = query.Where("is_active = ?", false)
	}

	var students []models.Student
	if err := query.Order("created_at DESC").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data murid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": students})
}

func UpdateStudent(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var input UpdateStudentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", id, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Murid tidak ditemukan"})
		return
	}

	if input.Name != "" {
		student.Name = input.Name
	}
	if input.WhatsApp != "" {
		student.WhatsApp = normalizeWhatsApp(input.WhatsApp)
	}
	if input.Gender == "male" || input.Gender == "female" {
		student.Gender = input.Gender
	}
	student.MeetingPoint = input.MeetingPoint

	if err := database.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui data murid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data murid berhasil diperbarui", "data": student})
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

	// If quota is replenished, reactivate the student
	if student.RemainingQuotaHours > 0 && !student.IsActive {
		student.IsActive = true
	}

	if err := database.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui kuota murid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kuota murid berhasil diperbarui", "data": student})
}

func ArchiveStudent(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", id, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Murid tidak ditemukan"})
		return
	}

	student.IsActive = !student.IsActive

	if err := database.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengarsipkan murid"})
		return
	}

	status := "diarsipkan"
	if student.IsActive {
		status = "diaktifkan kembali"
	}

	c.JSON(http.StatusOK, gin.H{"message": "Murid berhasil " + status, "data": student})
}

// ==================== STUDENT SESSIONS ====================

func GetStudentSessions(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	studentID := c.Param("id")

	// Verify student belongs to this instructor
	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", studentID, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Murid tidak ditemukan"})
		return
	}

	var sessions []models.StudentSession
	if err := database.DB.
		Preload("Student").
		Where("student_id = ? AND instructor_id = ?", studentID, instructorID).
		Order("check_in_time DESC").
		Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data sesi"})
		return
	}

	// Compute summary
	var totalSessions int
	var totalHours float64
	for _, s := range sessions {
		if s.CheckOutTime != nil {
			totalSessions++
			totalHours += s.DeductedHours
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data":           sessions,
		"student":        student,
		"total_sessions": totalSessions,
		"total_hours":    roundTo2(totalHours),
	})
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

	if !student.IsActive {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Murid sudah tidak aktif"})
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

	// Auto-mark matching learning plan as completed
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	tomorrow := today.AddDate(0, 0, 1)
	database.DB.Model(&models.LearningPlan{}).
		Where("instructor_id = ? AND student_id = ? AND scheduled_date >= ? AND scheduled_date < ? AND status = ?",
			instructorID, input.StudentID, today, tomorrow, "planned").
		Update("status", "completed")

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
		session.Notes = input.Notes
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

		// Auto-archive if quota is depleted
		if student.RemainingQuotaHours <= 0 {
			student.IsActive = false
		}

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

// ==================== LEARNING PLANS ====================

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

func UpdateLearningPlan(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	planID := c.Param("id")

	var plan models.LearningPlan
	if err := database.DB.Where("id = ? AND instructor_id = ?", planID, instructorID).First(&plan).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Jadwal tidak ditemukan"})
		return
	}

	var input UpdateLearningPlanInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.ScheduledDate != "" {
		scheduledDate, err := time.Parse("2006-01-02", input.ScheduledDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format scheduled_date harus YYYY-MM-DD"})
			return
		}
		plan.ScheduledDate = scheduledDate
	}

	if input.StartTime != "" {
		if _, err := time.Parse("15:04", input.StartTime); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format start_time harus HH:MM"})
			return
		}
		plan.StartTime = input.StartTime
	}

	if input.EndTime != "" {
		if _, err := time.Parse("15:04", input.EndTime); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format end_time harus HH:MM"})
			return
		}
		plan.EndTime = input.EndTime
	}

	if input.Status != "" {
		if input.Status != "planned" && input.Status != "completed" && input.Status != "cancelled" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Status tidak valid"})
			return
		}
		if input.Status == "completed" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Status 'selesai' hanya bisa diset melalui sesi aktif"})
			return
		}
		plan.Status = input.Status
	}

	if err := database.DB.Save(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui jadwal"})
		return
	}

	database.DB.Preload("Student").First(&plan, plan.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Jadwal berhasil diperbarui", "data": plan})
}

func DeleteLearningPlan(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)
	planID := c.Param("id")

	var plan models.LearningPlan
	if err := database.DB.Where("id = ? AND instructor_id = ?", planID, instructorID).First(&plan).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Jadwal tidak ditemukan"})
		return
	}

	if err := database.DB.Delete(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus jadwal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Jadwal berhasil dihapus"})
}

// ==================== BULK / RECURRING SCHEDULE ====================

type BulkCreateLearningPlanInput struct {
	StudentID  uint   `json:"student_id" binding:"required"`
	DaysOfWeek []int  `json:"days_of_week" binding:"required,min=1"` // 1=Mon, 2=Tue ... 7=Sun
	StartTime  string `json:"start_time" binding:"required"`
	EndTime    string `json:"end_time" binding:"required"`
	FromDate   string `json:"from_date" binding:"required"`
	ToDate     string `json:"to_date" binding:"required"`
	Force      bool   `json:"force"` // when true, skip duplicates silently instead of returning 409
}

func BulkCreateLearningPlan(c *gin.Context) {
	instructorID := c.MustGet("userID").(uint)

	var input BulkCreateLearningPlanInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate student
	var student models.Student
	if err := database.DB.Where("id = ? AND instructor_id = ?", input.StudentID, instructorID).First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Murid tidak valid untuk instruktur ini"})
		return
	}

	// Validate days (1-7)
	daySet := make(map[int]bool)
	for _, d := range input.DaysOfWeek {
		if d < 1 || d > 7 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Hari harus antara 1 (Senin) dan 7 (Minggu)"})
			return
		}
		daySet[d] = true
	}

	// Validate times
	if _, err := time.Parse("15:04", input.StartTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format start_time harus HH:MM"})
		return
	}
	if _, err := time.Parse("15:04", input.EndTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format end_time harus HH:MM"})
		return
	}

	// Parse date range
	fromDate, err := time.Parse("2006-01-02", input.FromDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format from_date harus YYYY-MM-DD"})
		return
	}
	toDate, err := time.Parse("2006-01-02", input.ToDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format to_date harus YYYY-MM-DD"})
		return
	}
	if toDate.Before(fromDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "to_date harus setelah from_date"})
		return
	}
	// Guard against extremely large ranges (max 2 years)
	if toDate.Sub(fromDate) > 365*2*24*time.Hour {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rentang tanggal terlalu besar (maksimal 2 tahun)"})
		return
	}

	// Prefetch existing plans for this student in the date range to detect duplicates
	var existing []models.LearningPlan
	database.DB.Where(
		"instructor_id = ? AND student_id = ? AND scheduled_date >= ? AND scheduled_date <= ?",
		instructorID, input.StudentID, fromDate, toDate,
	).Find(&existing)

	existingKey := make(map[string]bool)
	for _, e := range existing {
		key := e.ScheduledDate.Format("2006-01-02") + "|" + e.StartTime
		existingKey[key] = true
	}

	// First pass: separate conflicting dates from dates to create
	var conflictDates []string
	var createDates []time.Time

	current := fromDate
	for !current.After(toDate) {
		// Go's weekday: 0=Sun, 1=Mon ... 6=Sat → convert to 1=Mon..7=Sun
		goWeekday := int(current.Weekday())
		var ourDay int
		if goWeekday == 0 {
			ourDay = 7 // Sunday
		} else {
			ourDay = goWeekday
		}

		if daySet[ourDay] {
			key := current.Format("2006-01-02") + "|" + input.StartTime
			if existingKey[key] {
				conflictDates = append(conflictDates, current.Format("2006-01-02"))
			} else {
				createDates = append(createDates, current)
			}
		}

		current = current.AddDate(0, 0, 1)
	}

	// Warn about conflicts unless instructor explicitly forces
	if len(conflictDates) > 0 && !input.Force {
		c.JSON(http.StatusConflict, gin.H{
			"error":        fmt.Sprintf("Terdapat %d jadwal yang bentrok dengan jadwal yang sudah ada", len(conflictDates)),
			"conflicts":    conflictDates,
			"would_create": len(createDates),
		})
		return
	}

	// Second pass: create non-conflicting plans
	created := 0
	for _, date := range createDates {
		scheduledDate := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
		plan := models.LearningPlan{
			InstructorID:  instructorID,
			StudentID:     input.StudentID,
			ScheduledDate: scheduledDate,
			StartTime:     input.StartTime,
			EndTime:       input.EndTime,
			Status:        "planned",
		}
		if err := database.DB.Create(&plan).Error; err == nil {
			created++
		}
	}

	skipped := len(conflictDates)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Jadwal berulang berhasil dibuat",
		"created": created,
		"skipped": skipped,
	})
}

// ==================== QUOTA PRESETS ====================

func GetQuotaPresets(c *gin.Context) {
	var setting models.SystemSettings
	if err := database.DB.Where("setting_key = ?", models.SettingQuotaPresetOptions).First(&setting).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"presets": []string{"8", "10"}})
		return
	}

	presets := strings.Split(setting.SettingValue, ",")
	for i := range presets {
		presets[i] = strings.TrimSpace(presets[i])
	}

	c.JSON(http.StatusOK, gin.H{"presets": presets})
}

// ==================== HELPERS ====================

func roundTo2(value float64) float64 {
	return math.Round(value*100) / 100
}

// normalizeWhatsApp converts local Indonesian phone numbers to international format.
func normalizeWhatsApp(phone string) string {
	phone = strings.TrimSpace(phone)
	phone = strings.ReplaceAll(phone, " ", "")
	phone = strings.ReplaceAll(phone, "-", "")
	phone = strings.ReplaceAll(phone, "+", "")

	if strings.HasPrefix(phone, "0") {
		phone = "62" + phone[1:]
	}

	if !strings.HasPrefix(phone, "62") {
		phone = "62" + phone
	}

	return phone
}
