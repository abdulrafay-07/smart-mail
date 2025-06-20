package handlers

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/db/services"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"gorm.io/gorm"
)

func OAuthCallback(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		utils.WriteJSONResponse(w, http.StatusBadRequest, types.ApiResponse{
			Success: false,
			Message: "Invalid code",
		})
		return
	}

	values := url.Values{
		"code":          {code},
		"client_id":     {os.Getenv("GOOGLE_CLIENT_ID")},
		"client_secret": {os.Getenv("GOOGLE_CLIENT_SECRET")},
		"redirect_uri":  {os.Getenv("GOOGLE_REDIRECT_URI")},
		"grant_type":    {"authorization_code"},
	}

	resp, err := http.PostForm("https://oauth2.googleapis.com/token", values)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Token request failed",
		})
		return
	}
	defer resp.Body.Close()

	currTime := time.Now()

	var tokenResp types.TokenResponse
	json.NewDecoder(resp.Body).Decode(&tokenResp)

	userInfoResp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + url.QueryEscape(tokenResp.AccessToken))
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Failed to fetch user info",
		})
		return
	}
	defer userInfoResp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(userInfoResp.Body).Decode(&userInfo); err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Failed to decode user info",
		})
		return
	}

	userID, err := services.FindOrCreateUser(db, tokenResp, userInfo, currTime)
	if err != gorm.ErrRegistered && err != gorm.ErrRecordNotFound {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Failed to find or create user",
		})
		return
	}

	// Find or create user session
	err = utils.FindOrCreateSession(db, w, userID)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Error finding or creating a session",
		})
		return
	}

	http.Redirect(w, r, "http://localhost:5173/", http.StatusSeeOther)
}
