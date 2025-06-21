package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/api/routes"
	"github.com/abdulrafay-07/smart-mail/internal/db"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load env
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading the .env file", err)
	}
	port := os.Getenv("PORT")

	// Connect to database
	dbInst := db.Connect()

	// Migrate the database
	db.MigrateDB(dbInst)

	// Router
	r := chi.NewRouter()

	// Middlewares
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Allows sending cookies
		MaxAge:           300,  // Cache preflight request for 5 minutes
	}))

	// Setup routes
	routes.SetupRoutes(dbInst, r)

	// HTTP Server
	server := &http.Server{
		Addr:    port,
		Handler: r,
	}

	// Server run context
	serverCtx, serverStopCtx := context.WithCancel(context.Background())

	// Listen for system signals for process to interrupt/exit
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-sig

		// Shutdown signal with grace period of 15 seconds
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		go func() {
			<-shutdownCtx.Done()
			if shutdownCtx.Err() == context.DeadlineExceeded {
				log.Fatal("graceful shutdown timed out... exiting forcefully")
			}
		}()

		// Trigger graceful shutdown
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Fatal(err)
		}
		log.Println("Shutdown signal received, shutting down gracefully...")
		serverStopCtx()
	}()

	// Run the server
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}

	// Wait for server context to be stopped
	<-serverCtx.Done()
}
