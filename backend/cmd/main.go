package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/handlers"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/provider"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	ctx := context.Background()

	// Initialize Provider (Default to Mock, switch to BQ if env vars are set)
	var p provider.AnalyticsProvider = &provider.MockProvider{}
	
	projectID := os.Getenv("BQ_PROJECT_ID")
	if projectID != "" {
		datasetID := os.Getenv("BQ_DATASET_ID")
		tableID := os.Getenv("BQ_TABLE_ID")
		creds := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
		
		bq, err := provider.NewBigQueryProvider(ctx, projectID, datasetID, tableID, creds)
		if err != nil {
			log.Printf("Failed to init BigQuery provider, falling back to Mock: %v", err)
		} else {
			p = bq
			log.Println("Initialized BigQuery provider")
		}
	}

	srv := handlers.NewServer(p)

	// Setup Gin Router
	r := gin.Default()

	// Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API Routes
	v1 := r.Group("/api/v1")
	{
		v1.POST("/analyze", srv.AnalyzeData)
		
		// Aligning with frontend expectations (daily-analise/page.tsx)
		v1.GET("/marketing/daily-cvr", func(c *gin.Context) {
			data, _, _ := p.GetDailyTrends(c.Request.Context(), 7)
			c.JSON(http.StatusOK, data)
		})

		v1.GET("/marketing/weekly-roi", func(c *gin.Context) {
			data, _, _ := p.GetWeeklyTrends(c.Request.Context(), 12)
			c.JSON(http.StatusOK, data)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Starting Decision Tracer backend on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
