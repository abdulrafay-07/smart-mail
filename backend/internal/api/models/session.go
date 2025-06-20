package models

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	ID        uuid.UUID `gorm:"primaryKey"`
	UserID    uuid.UUID `gorm:"primaryKey"`
	CreatedAt time.Time
	ExpiresAt time.Time
}
