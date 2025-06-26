package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"gorm.io/gorm"
)

func GenerateAccessToken(db *gorm.DB, ctxUser models.User) (models.User, error) {
	var user models.User

	err := db.Where("id = ? AND provider_id = ?", ctxUser.ID, ctxUser.ProviderID).Find(&user).Error
	if err != nil {
		return models.User{}, err
	}

	// Generate new access token
	values := url.Values{
		"client_id":     {os.Getenv("GOOGLE_CLIENT_ID")},
		"client_secret": {os.Getenv("GOOGLE_CLIENT_SECRET")},
		"refresh_token": {user.RefreshToken},
		"grant_type":    {"refresh_token"},
	}

	resp, err := http.PostForm("https://oauth2.googleapis.com/token", values)
	if err != nil {
		return models.User{}, errors.New("error regenerating new token")
	}
	defer resp.Body.Close()

	currTime := time.Now()

	var regenerateTokenResp types.RegenerateTokenResponse
	json.NewDecoder(resp.Body).Decode(&regenerateTokenResp)

	db.Model(&user).Updates(models.User{
		AccessToken: regenerateTokenResp.AccessToken,
		ExpiresAt:   currTime.Add(time.Duration(regenerateTokenResp.ExpiresIn) * time.Second),
		UpdatedAt:   time.Now(),
	})

	return user, nil
}
