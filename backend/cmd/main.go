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
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

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
		
		// Aligning with frontend expectations (requirements.md Section 06)
		v1.GET("/marketing/daily-cvr", func(c *gin.Context) {
			data, meta, err := p.GetDailyTrends(c.Request.Context(), 7)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"data":     data,
				"metadata": meta,
			})
		})

		v1.GET("/marketing/weekly-roi", func(c *gin.Context) {
			data, meta, err := p.GetWeeklyTrends(c.Request.Context(), 12)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"data":     data,
				"metadata": meta,
			})
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
