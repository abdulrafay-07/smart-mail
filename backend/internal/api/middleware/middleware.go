package middleware

import (
	"context"
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func AuthenticationMiddleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("stmail_sess_id")
			if err != nil {
				utils.WriteJSONResponse(w, http.StatusUnauthorized, types.ApiResponse{
					Success: false,
					Message: "Cookie not found",
				})
				return
			}
			sessionID := cookie.Value

			// Parse sessionID to uuid
			parsedSessionID, err := uuid.Parse(sessionID)
			if err != nil {
				utils.WriteJSONResponse(w, http.StatusUnauthorized, types.ApiResponse{
					Success: false,
					Message: "Invalid session",
				})
				return
			}

			session, err := utils.FindSessionFromSessionId(db, parsedSessionID)
			if err != nil {
				utils.WriteJSONResponse(w, http.StatusUnauthorized, types.ApiResponse{
					Success: false,
					Message: "No session found",
				})
				return
			}

			user, err := utils.FindUserFromSession(db, session.UserID)
			if err != nil {
				utils.WriteJSONResponse(w, http.StatusUnauthorized, types.ApiResponse{
					Success: false,
					Message: "No user found",
				})
				return
			}

			// Set the cookie in the header if it doesn't exist already
			if _, err := r.Cookie("stmail_sess_id"); err == http.ErrNoCookie {
				http.SetCookie(w, &http.Cookie{
					Name:     "stmail_sess_id",
					Value:    sessionID,
					Path:     "/",
					HttpOnly: true,
					Secure:   false, // Set to true if using HTTPS
					SameSite: http.SameSiteLaxMode,
					Expires:  session.ExpiresAt,
				})
			}

			// Add user to context for downstream handlers
			ctx := r.Context()
			ctx = context.WithValue(ctx, "user", user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
