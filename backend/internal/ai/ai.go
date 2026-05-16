package ai

import (
	"context"
)

// AnalysisResult represents the structured response from the AI
type AnalysisResult struct {
	Analysis string   `json:"analysis"`
	SQL      string   `json:"sql"`
	Actions  []string `json:"actions"` // Recommended next steps
}

// AIEngine defines the contract for marketing data analysis
type AIEngine interface {
	Analyze(ctx context.Context, question string, data interface{}) (*AnalysisResult, error)
}
