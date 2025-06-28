package utils

import "fmt"

func GetPrompt(from, subject, body string) string {
	return fmt.Sprintf(`Classify the following email into one of these categories:
["Work", "Personal", "Promotion", "Shopping", "Social", "Finance", "Travel", "Newsletters", "Other"]

Email:
From: %s
Subject: %s
Body: %s

Return only the category.`, from, subject, body)
}
