package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/models"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/provider"
	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type Server struct {
	Provider provider.AnalyticsProvider
}

func NewServer(p provider.AnalyticsProvider) *Server {
	return &Server{Provider: p}
}

type AnalyzeRequest struct {
	Question string `json:"question"`
}

type AnalyzeResponse struct {
	Data     interface{}             `json:"data"`
	Analysis string                  `json:"analysis"`
	SQL      string                  `json:"sql,omitempty"`
	Metadata models.ResponseMetadata `json:"metadata"`
}

func (s *Server) AnalyzeData(c *gin.Context) {
	var req AnalyzeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Fetch Data from Provider
	ctx := c.Request.Context()
	data, meta, err := s.Provider.GetDailyTrends(ctx, 30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to fetch data: %v", err)})
		return
	}

	// 2. AI Analysis (Gemini)
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusOK, AnalyzeResponse{
			Data:     data,
			Analysis: "AI analysis is currently unavailable (GEMINI_API_KEY not set). Showing raw data trends.",
			SQL:      "SELECT * FROM marketing_data WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)",
			Metadata: meta,
		})
		return
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	
	prompt := fmt.Sprintf(`
		You are a marketing data analyst for "Decision Tracer". 
		Analyze the following data: %v. 
		User Question: %s. 
		
		Return a JSON object with:
		1. "analysis": A summary of the insight.
		2. "sql": The BigQuery SQL that would extract this specific insight.
	`, data, req.Question)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, AnalyzeResponse{
		Data:     data,
		Analysis: fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0]),
		SQL:      "SELECT ...",
		Metadata: meta,
	})
}
