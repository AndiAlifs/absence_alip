package models

import (
	"time"

	"gorm.io/gorm"
)

// Student represents the learner managed by the instructor.
type Student struct {
	gorm.Model
	Name                string  `json:"name"`
	InstructorID        uint    `json:"instructor_id"`
	TotalQuotaHours     float64 `json:"total_quota_hours"`
	RemainingQuotaHours float64 `json:"remaining_quota_hours"`
}

// StudentSession tracks learning session time and quota deduction.
type StudentSession struct {
	gorm.Model
	StudentID     uint       `json:"student_id"`
	InstructorID  uint       `json:"instructor_id"`
	CheckInTime   time.Time  `json:"check_in_time"`
	CheckOutTime  *time.Time `json:"check_out_time"`
	DeductedHours float64    `json:"deducted_hours"`
	Latitude      float64    `json:"latitude"`
	Longitude     float64    `json:"longitude"`
	Student       Student    `gorm:"foreignKey:StudentID" json:"student"`
}

// LearningPlan is the schedule created by an instructor.
type LearningPlan struct {
	gorm.Model
	InstructorID  uint      `json:"instructor_id"`
	StudentID     uint      `json:"student_id"`
	Student       Student   `gorm:"foreignKey:StudentID" json:"student"`
	ScheduledDate time.Time `json:"scheduled_date"`
	StartTime     string    `json:"start_time"`
	EndTime       string    `json:"end_time"`
	Status        string    `gorm:"type:enum('planned','completed','cancelled');default:'planned'" json:"status"`
}
