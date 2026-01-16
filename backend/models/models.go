package models

import (
	"time"
)

// User represents a system user (Employee or Manager)
type User struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Username     string `gorm:"unique;not null" json:"username"`
	PasswordHash string `gorm:"not null" json:"-"`
	Role         string `gorm:"type:enum('employee','manager');default:'employee'" json:"role"`
}

// Attendance represents a clock-in record
type Attendance struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	ClockInTime time.Time `gorm:"not null" json:"clock_in_time"`
	Latitude    float64   `gorm:"type:decimal(10,8)" json:"latitude"`
	Longitude   float64   `gorm:"type:decimal(11,8)" json:"longitude"`
	User        User      `gorm:"foreignKey:UserID" json:"-"`
}

// LeaveRequest represents a leave application
type LeaveRequest struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	StartDate time.Time `gorm:"type:date;not null" json:"start_date"`
	EndDate   time.Time `gorm:"type:date;not null" json:"end_date"`
	Reason    string    `gorm:"type:text" json:"reason"`
	Status    string    `gorm:"type:enum('pending','approved','rejected');default:'pending'" json:"status"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
}
