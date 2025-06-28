package services

import (
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func FindOrCreateUser(db *gorm.DB, tokenResp types.TokenResponse, userInfo map[string]interface{}, currTime time.Time) (uuid.UUID, error) {
	var user models.User

	err := db.Where("email = ? AND provider_id = ?", userInfo["email"].(string), userInfo["sub"].(string)).Find(&user).Error
	if err == nil {
		// User already exists
		updated := false
		expiresAt := currTime.Add(time.Duration(tokenResp.ExpiresIn) * time.Second)

		if user.AccessToken != tokenResp.AccessToken {
			user.AccessToken = tokenResp.AccessToken
			updated = true
		}
		if user.RefreshToken != tokenResp.RefreshToken {
			user.RefreshToken = tokenResp.RefreshToken
			updated = true
		}
		if user.ExpiresAt != expiresAt {
			user.ExpiresAt = expiresAt
			updated = true
		}

		if updated {
			if err := db.Save(&user).Error; err != nil {
				return uuid.UUID{}, err
			}
		}

		return user.ID, nil
	} else if err != gorm.ErrRecordNotFound {
		// some other error occured
		return uuid.UUID{}, err
	}

	expiresAt := currTime.Add(time.Duration(tokenResp.ExpiresIn) * time.Second)

	user = models.User{
		ID:         uuid.New(),
		Provider:   "google",
		ProviderID: userInfo["sub"].(string),

		Email:     userInfo["email"].(string),
		Name:      userInfo["name"].(string),
		AvatarURL: userInfo["picture"].(string),

		AccessToken:  tokenResp.AccessToken,
		RefreshToken: tokenResp.RefreshToken,
		ExpiresAt:    expiresAt,

		CreatedAt: time.Now(),
	}

	inst := db.Create(&user)
	if inst.Error != nil {
		return uuid.UUID{}, inst.Error
	}

	return user.ID, nil
}
