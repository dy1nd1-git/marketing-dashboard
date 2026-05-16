package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

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
			days := 7
			startDateStr := c.Query("start_date")
			endDateStr := c.Query("end_date")

			var endDate time.Time
			var hasCustomDate bool

			if startDateStr != "" && endDateStr != "" {
				start, err1 := time.Parse("2006-01-02", startDateStr)
				end, err2 := time.Parse("2006-01-02", endDateStr)
				if err1 == nil && err2 == nil && !end.Before(start) {
					diff := int(end.Sub(start).Hours()/24) + 1
					if diff > 0 {
						days = diff
						endDate = end
						hasCustomDate = true
					}
				}
			} else if daysParam := c.Query("days"); daysParam != "" {
				if parsed, err := strconv.Atoi(daysParam); err == nil && parsed > 0 {
					days = parsed
				}
			}

			data, meta, err := p.GetDailyTrends(c.Request.Context(), days)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			if hasCustomDate && len(data) > 0 {
				currentDate := endDate
				for i := range data {
					data[i].Date = currentDate
					currentDate = currentDate.AddDate(0, 0, -1)
				}
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

		v1.GET("/marketing/dashboard", func(c *gin.Context) {
			startDate := c.Query("start_date")
			endDate := c.Query("end_date")

			// Default to last 30 days if not provided
			if startDate == "" || endDate == "" {
				now := time.Now()
				start := now.AddDate(0, 0, -30)
				startDate = start.Format("2006-01-02")
				endDate = now.Format("2006-01-02")
			}

			data, err := p.GetDashboardData(c.Request.Context(), startDate, endDate)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
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
