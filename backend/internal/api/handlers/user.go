package handlers

import (
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"gorm.io/gorm"
)

func GetCurrentUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(models.User)
	if !ok {
		utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	pubUser := types.PublicUser{
		ID:        user.ID.String(),
		Name:      user.Name,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
	}

	utils.WriteJSONResponse(w, http.StatusOK, types.ApiResponse{
		Success: true,
		Message: "Session exists",
		Data: map[string]interface{}{
			"user": pubUser,
		},
	})
}

func LogoutUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(models.User)
	if !ok {
		utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	// Delete the existing session
	err := db.Where("user_id = ?", user.ID).Delete(&models.Session{}).Error
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Failed to logout",
		})
		return
	}

	// Clear the cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "stmail_sess_id",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	utils.WriteJSONResponse(w, http.StatusOK, types.ApiResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
