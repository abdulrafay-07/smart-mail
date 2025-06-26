package types

type ApiResponse struct {
	Success bool                   `json:"success"`
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data,omitempty"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	IdToken      string `json:"id_token"` // Can decode to get user info
}

type RegenerateTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json"scope"`
	TokenType   string `json:"token_type"`
}

type GmailListResponse struct {
	Messages           []Message `json:"messages"`
	NextPageToken      string    `json:"nextPageToken"`
	ResultSizeEstimate uint32    `json:"resultSizeEstimate"`
}

type Message struct {
	ID           string      `json:"id"`
	ThreadID     string      `json:"threadId"`
	LabelIDs     []string    `json:"labelIds"`
	Snippet      string      `json:"snippet"`
	HistoryID    string      `json:"historyId"`
	InternalDate string      `json:"internalDate"`
	Payload      MessagePart `json:"payload"`
	SizeEstimate int         `json:"sizeEstimate"`
	Raw          string      `json:"raw"`
}

type MessagePart struct {
	PartID   string          `json:"partId"`
	MimeType string          `json:"mimeType"`
	Filename string          `json:"filename"`
	Headers  []Header        `json:"headers"`
	Body     MessagePartBody `json:"body"`
	Parts    []MessagePart   `json:"parts"`
}

type Header struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type MessagePartBody struct {
	AttachmentID string `json:"attachmentId"`
	Size         int    `json:"size"`
	Data         string `json:"data"`
}

type OutputMailFormat struct {
	From        string   `json:"from"`
	To          []string `json:"to"`
	Cc          []string `json:"cc,omitempty"`
	Bcc         []string `json:"bcc,omitempty"`
	Subject     string   `json:"subject"`
	Date        string   `json:"date"`
	Snippet     string   `json:"snippet"`
	Text        string   `json:"text"`
	Html        string   `json:"html,omitempty"`
	Attachments []string `json:"attachments,omitempty"`
	ThreadID    string   `json:"threadId"`
	MessageID   string   `json:"messageId"`
	Labels      []string `json:"labels,omitempty"`
}

type PublicUser struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
}
