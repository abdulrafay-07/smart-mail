package handlers

import (
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func GetCurrentUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("stmail_sess_id")
	if err != nil {
		if err == http.ErrNoCookie {
			utils.WriteJSONResponse(w, http.StatusUnauthorized, types.ApiResponse{
				Success: false,
				Message: "Unauthorized",
			})
			return
		}

		utils.WriteJSONResponse(w, http.StatusBadRequest, types.ApiResponse{
			Success: false,
			Message: "Bad Request",
		})
		return
	}

	sessionToken := cookie.Value
	uuidToken, err := uuid.Parse(sessionToken)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, types.ApiResponse{
			Success: false,
			Message: "Error parsing the session token",
		})
		return
	}

	session, err := utils.FindSessionFromSessionId(db, uuidToken)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Error retrieving session from database",
		})
		return
	}

	err = utils.FindUserFromSession(db, session.UserID)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "Error retrieving user from database",
		})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, types.ApiResponse{
		Success: true,
		Message: "Session exists",
	})
}
