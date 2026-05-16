package provider

import (
	"context"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/models"
)

// AnalyticsProvider defines the interface for fetching marketing data.
type AnalyticsProvider interface {
	GetDailyTrends(ctx context.Context, days int) ([]models.MetricRow, models.ResponseMetadata, error)
	GetWeeklyTrends(ctx context.Context, weeks int) ([]models.MetricRow, models.ResponseMetadata, error)
	GetDashboardStats(ctx context.Context, startDate, endDate string) (models.DashboardStats, error)
	GetROASMatrix(ctx context.Context, startDate, endDate string) (models.ROASMatrix, error)
}
