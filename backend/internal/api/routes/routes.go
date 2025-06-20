package routes

import (
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/api/handlers"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB, r *chi.Mux) {
	// Common API Endpoints
	r.Route("/api/", func(r chi.Router) {
		// OAuth callback
		r.Get("/oauth/callback", func(w http.ResponseWriter, r *http.Request) {
			handlers.OAuthCallback(db, w, r)
		})
	})
}
