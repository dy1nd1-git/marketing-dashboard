package handlers

import (
	"fmt"
	"net/http"

	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/ai"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/models"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/provider"
	"github.com/gin-gonic/gin"
)

type Server struct {
	Provider provider.AnalyticsProvider
	AI       ai.AIEngine
}

func NewServer(p provider.AnalyticsProvider, a ai.AIEngine) *Server {
	return &Server{
		Provider: p,
		AI:       a,
	}
}

type AnalyzeRequest struct {
	Question string `json:"question"`
}

type AnalyzeResponse struct {
	Data     interface{}             `json:"data"`
	Analysis string                  `json:"analysis"`
	Actions  []string                `json:"actions,omitempty"`
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

	// Ensure source_table and execution_sql are set in the base metadata
	if meta.SourceTable == "" {
		meta.SourceTable = "events_*" // Default or actual from provider
	}

	// 2. AI Analysis
	if s.AI == nil {
		meta.ExecutionSQL = "SELECT * FROM analytics_events WHERE ..." // Example
		c.JSON(http.StatusOK, AnalyzeResponse{
			Data:     data,
			Analysis: "AI engine is not configured (GEMINI_API_KEY missing).",
			Metadata: meta,
		})
		return
	}

	result, err := s.AI.Analyze(ctx, req.Question, data)
	if err != nil {
		meta.ExecutionSQL = "ERROR_DURING_AI_GEN"
		c.JSON(http.StatusOK, AnalyzeResponse{
			Data:     data,
			Analysis: fmt.Sprintf("AI analysis failed: %v. Raw data is still available below.", err),
			Metadata: meta,
		})
		return
	}

	// Update metadata with AI-generated lineage
	meta.ExecutionSQL = result.SQL
	meta.Engine = "Gemini-1.5-Flash"

	// 3. Return Structured Response
	c.JSON(http.StatusOK, AnalyzeResponse{
		Data:     data,
		Analysis: result.Analysis,
		Actions:  result.Actions,
		Metadata: meta,
	})
}
