package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiEngine struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewGeminiEngine(ctx context.Context, apiKey string) (*GeminiEngine, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	// Using gemini-2.5-flash for speed and cost-efficiency
	model := client.GenerativeModel("gemini-2.5-flash")
	
	// Ensure the model returns structured JSON
	model.ResponseMIMEType = "application/json"

	return &GeminiEngine{
		client: client,
		model:  model,
	}, nil
}

func (e *GeminiEngine) Analyze(ctx context.Context, question string, data interface{}) (*AnalysisResult, error) {
	prompt := fmt.Sprintf(`
		You are a Senior Marketing Data Analyst for "Decision Tracer".
		Your task is to analyze the provided marketing data and answer the user's question.

		Data Context (JSON): %v
		User Question: %s

		Rules:
		1. Be concise but insightful.
		2. Identify any anomalies or significant trends in ROI/CVR.
		3. Provide a specific BigQuery SQL snippet that could be used to deep-dive into the identified issue.
		4. Suggest 2-3 concrete marketing actions.

		Return the response in the following JSON schema:
		{
			"analysis": "string (markdown allowed)",
			"sql": "string (BigQuery SQL)",
			"actions": ["string", "string"]
		}
	`, data, question)

	resp, err := e.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("gemini generation failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no response candidates from gemini")
	}

	// Parse the JSON response
	var result AnalysisResult
	part := resp.Candidates[0].Content.Parts[0]
	
	// Extract text from part
	text := fmt.Sprintf("%v", part)
	
	// Sometimes Gemini wraps JSON in code blocks, clean it up
	text = strings.TrimPrefix(text, "```json")
	text = strings.TrimSuffix(text, "```")
	text = strings.TrimSpace(text)

	if err := json.Unmarshal([]byte(text), &result); err != nil {
		return nil, fmt.Errorf("failed to parse AI response as JSON: %w, Raw: %s", err, text)
	}

	return &result, nil
}

func (e *GeminiEngine) Close() {
	if e.client != nil {
		e.client.Close()
	}
}
