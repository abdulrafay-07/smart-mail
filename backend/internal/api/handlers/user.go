package handlers

import (
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"gorm.io/gorm"
)

func GetCurrentUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value("user").(models.User)
	if !ok {
		utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	utils.WriteJSONResponse(w, http.StatusOK, types.ApiResponse{
		Success: true,
		Message: "Session exists",
	})
}
