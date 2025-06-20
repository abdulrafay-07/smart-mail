package models

import (
	"time"

	"github.com/google/uuid"
)

type ProviderOpts string

var (
	GoogleProvider ProviderOpts = "google"
)

type User struct {
	ID uuid.UUID `gorm:"primaryKey"`

	// Provider details
	Provider   ProviderOpts
	ProviderID string

	// User details
	Email     string `gorm:"uniqueIndex"`
	Name      string
	AvatarURL string

	// Token details
	AccessToken  string
	RefreshToken string
	ExpiresAt    time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}
