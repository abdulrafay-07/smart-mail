package utils

import (
	"net/http"
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func FindOrCreateSession(db *gorm.DB, w http.ResponseWriter, userID uuid.UUID) error {
	var existingSession models.Session

	err := db.Where("user_id = ? AND expires_at > NOW()", userID).First(&existingSession).Error
	if err == nil {
		// Session already exists
		http.SetCookie(w, &http.Cookie{
			Name:     "stmail_sess_id",
			Value:    existingSession.ID.String(),
			Path:     "/",
			HttpOnly: true,
			Secure:   false, // True in prod
			SameSite: http.SameSiteLaxMode,
			Expires:  existingSession.ExpiresAt,
		})

		return nil
	} else if err == gorm.ErrRecordNotFound {
		// Session not found in the database
		newSession := models.Session{
			ID:        uuid.New(),
			UserID:    userID,
			ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
		}

		db.Create(&newSession)

		http.SetCookie(w, &http.Cookie{
			Name:     "stmail_sess_id",
			Value:    newSession.ID.String(),
			Path:     "/",
			HttpOnly: true,
			Secure:   false, // True in prod
			SameSite: http.SameSiteLaxMode,
			Expires:  newSession.ExpiresAt,
		})

		return nil
	}

	return err
}

func FindSessionFromSessionId(db *gorm.DB, sessionID uuid.UUID) (models.Session, error) {
	var existingSession models.Session

	err := db.Where("id = ?", sessionID).Find(&existingSession).Error
	if err != nil {
		return models.Session{}, err
	}

	return existingSession, nil
}

func FindUserFromSession(db *gorm.DB, userID uuid.UUID) (models.User, error) {
	var user models.User

	err := db.Where("id = ?", userID).Find(&user).Error
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
