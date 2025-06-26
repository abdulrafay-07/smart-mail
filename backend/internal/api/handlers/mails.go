package handlers

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"time"

	"github.com/abdulrafay-07/smart-mail/internal/api/models"
	"github.com/abdulrafay-07/smart-mail/internal/types"
	"github.com/abdulrafay-07/smart-mail/internal/utils"
	"gorm.io/gorm"
)

func GetUserMails(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(models.User)
	if !ok {
		utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	// Check if the access token is expired
	updatedUserData := user

	currTime := time.Now()
	if currTime.After(user.ExpiresAt) {
		// Generate new access token and store it on database
		user, err := utils.GenerateAccessToken(db, user)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
					Success: false,
					Message: "Unauthorized",
				})
			} else {
				utils.WriteJSONResponse(w, http.StatusNotFound, types.ApiResponse{
					Success: false,
					Message: err.Error(),
				})
			}
			return
		}

		// Update context
		ctx := r.Context()
		ctx = context.WithValue(ctx, "user", user)
		*r = *r.WithContext(ctx)

		updatedUserData = user
	}

	// 1. Fetch list of messages
	req, _ := http.NewRequest("GET", "https://gmail.googleapis.com/gmail/v1/users/me/messages"+"?maxResults=20", nil)
	req.Header.Set("Authorization", "Bearer "+updatedUserData.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
			Success: false,
			Message: "error fetching mails",
		})
	}
	defer res.Body.Close()

	var mailsResp types.GmailListResponse
	json.NewDecoder(res.Body).Decode(&mailsResp)

	// 2. For each message, fetch full message body
	var extractedData []types.OutputMailFormat
	for _, m := range mailsResp.Messages {
		url := "https://gmail.googleapis.com/gmail/v1/users/me/messages/" + m.ID + "?format=full"
		msgReq, _ := http.NewRequest("GET", url, nil)
		msgReq.Header.Set("Authorization", "Bearer "+updatedUserData.AccessToken)

		msgResp, err := http.DefaultClient.Do(msgReq)
		if err != nil {
			utils.WriteJSONResponse(w, http.StatusInternalServerError, types.ApiResponse{
				Success: false,
				Message: "error fetching mails",
			})
		}
		defer msgResp.Body.Close()

		var fullMessage types.Message
		json.NewDecoder(msgResp.Body).Decode(&fullMessage)

		var mail types.OutputMailFormat
		// Extract headers
		for _, header := range fullMessage.Payload.Headers {
			switch header.Name {
			case "From":
				mail.From = header.Value
			case "To":
				mail.To = []string{header.Value}
			case "Subject":
				mail.Subject = header.Value
			case "Date":
				mail.Date = header.Value
			}
		}

		// Extract body (handle base64 encoding)
		var bodyData string
		if fullMessage.Payload.Body.Data != "" {
			bodyBytes, err := base64.URLEncoding.DecodeString(fullMessage.Payload.Body.Data)
			if err == nil {
				bodyData = string(bodyBytes)
			}
		} else if len(fullMessage.Payload.Parts) > 0 {
			for _, part := range fullMessage.Payload.Parts {
				if part.MimeType == "text/plain" && part.Body.Data != "" {
					bodyBytes, err := base64.URLEncoding.DecodeString(part.Body.Data)
					if err == nil {
						bodyData = string(bodyBytes)
						break
					}
				}
			}
		}
		mail.Text = bodyData

		// Extract HTML body (handle base64 encoding)
		var htmlData string
		if len(fullMessage.Payload.Parts) > 0 {
			for _, part := range fullMessage.Payload.Parts {
				if part.MimeType == "text/html" && part.Body.Data != "" {
					htmlBytes, err := base64.URLEncoding.DecodeString(part.Body.Data)
					if err == nil {
						htmlData = string(htmlBytes)
						break
					}
				}
			}
		} else if fullMessage.Payload.MimeType == "text/html" && fullMessage.Payload.Body.Data != "" {
			htmlBytes, err := base64.URLEncoding.DecodeString(fullMessage.Payload.Body.Data)
			if err == nil {
				htmlData = string(htmlBytes)
			}
		}
		mail.Html = htmlData

		mail.Snippet = fullMessage.Snippet
		mail.ThreadID = fullMessage.ThreadID
		mail.MessageID = fullMessage.ID
		mail.Labels = fullMessage.LabelIDs

		// Append to extractedData slice
		extractedData = append(extractedData, mail)
	}

	utils.WriteJSONResponse(w, http.StatusOK, types.ApiResponse{
		Success: true,
		Message: "Mails fetched successfully",
		Data: map[string]interface{}{
			"mails": extractedData,
		},
	})
}
