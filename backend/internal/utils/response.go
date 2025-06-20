package utils

import (
	"encoding/json"
	"net/http"

	"github.com/abdulrafay-07/smart-mail/internal/types"
)

func WriteJSONResponse(w http.ResponseWriter, status int, respData types.ApiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(respData)
}
