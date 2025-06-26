package routes

import (
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/api/handlers"
	"github.com/abdulrafay-07/smart-mail/internal/api/middleware"
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

		// Mails
		r.Route("/u", func(r chi.Router) {
			r.Use(middleware.AuthenticationMiddleware(db))

			r.Get("/", func(w http.ResponseWriter, r *http.Request) {
				handlers.GetCurrentUser(db, w, r)
			})

			r.Get("/mails", func(w http.ResponseWriter, r *http.Request) {
				handlers.GetUserMails(db, w, r)
			})
		})
	})
}
