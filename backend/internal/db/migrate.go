package db

import (
	"log"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"gorm.io/gorm"
)

func MigrateDB(db *gorm.DB) {
	if err := db.AutoMigrate(models.User{}, models.Session{}); err != nil {
		log.Fatal("Migration failed", err)
	}

	log.Println("Migrated DB schema")
}
