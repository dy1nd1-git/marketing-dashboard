package provider

import (
	"context"
	"time"
	"math/rand"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/models"
)

type MockProvider struct{}

func (m *MockProvider) GetDailyTrends(ctx context.Context, days int) ([]models.MetricRow, models.ResponseMetadata, error) {
	data := make([]models.MetricRow, 0, days)
	now := time.Now()

	for i := 0; i < days; i++ {
		date := now.AddDate(0, 0, -i)
		traffic := 1000 + rand.Intn(500)
		cvr := 0.01 + (rand.Float64() * 0.02)
		roas := 2.0 + (rand.Float64() * 4.5)
		spend := 500.0 + (rand.Float64() * 1000.0)
		revenue := spend * roas

		data = append(data, models.MetricRow{
			Date:       date,
			Traffic:    traffic,
			CVR:        cvr,
			ROI:        roas,
			ROAS:       roas,
			Spend:      spend,
			Revenue:    revenue,
			CTR:        0.02 + (rand.Float64() * 0.03),
			AvgRevenue: revenue,
			AvgSpend:   spend,
			NetROAS:    roas,
			Lineage: models.Lineage{
				Source: "mock_data_generator",
			},
		})
	}

	confidence := "High"
	if days <= 30 {
		confidence = "Low (Sample size <= 30)"
	}

	meta := models.ResponseMetadata{
		Engine:     "Decision-Tracer-Mock-v1",
		Confidence: confidence,
		SQLRef:     "GENERATED MOCK DATA",
	}

	return data, meta, nil
}

func (m *MockProvider) GetWeeklyTrends(ctx context.Context, weeks int) ([]models.MetricRow, models.ResponseMetadata, error) {
	data, meta, _ := m.GetDailyTrends(ctx, weeks)
	for i := range data {
		data[i].Week = "Week " + time.Now().AddDate(0, 0, -i*7).Format("01/02")
	}
	meta.Engine = "Decision-Tracer-Mock-Weekly-v1"
	return data, meta, nil
}

func (m *MockProvider) GetDashboardStats(ctx context.Context, startDate, endDate string) (models.DashboardStats, error) {
	// Create a stable seed from dates to ensure consistent results for the same range
	seed := int64(0)
	for _, c := range startDate + endDate {
		seed += int64(c)
	}
	r := rand.New(rand.NewSource(seed))

	baseRevenue := 100000.0 + r.Float64()*100000.0
	baseSpend := 20000.0 + r.Float64()*30000.0
	
	return models.DashboardStats{
		Revenue:     baseRevenue,
		RevenueDiff: (r.Float64() * 30.0) - 10.0,
		Spend:       baseSpend,
		SpendDiff:   (r.Float64() * 20.0) - 10.0,
		ROAS:        baseRevenue / baseSpend,
		ROASDiff:    (r.Float64() * 15.0) - 5.0,
		Conversions: 1000 + r.Intn(2000),
		ConvDiff:    (r.Float64() * 10.0) - 5.0,
	}, nil
}

func (m *MockProvider) GetROASMatrix(ctx context.Context, startDate, endDate string) (models.ROASMatrix, error) {
	// Stable seed from dates
	seed := int64(0)
	for _, c := range startDate + endDate {
		seed += int64(c) + 1 // Offset to differentiate from stats seed
	}
	r := rand.New(rand.NewSource(seed))

	matrix := make(models.ROASMatrix, 0, 7*24)
	for d := 0; d < 7; d++ {
		for h := 0; h < 24; h++ {
			roas := 1.5 + r.Float64()*4.0
			// Make weekends and evenings higher ROAS for "mock realism"
			if d >= 5 {
				roas += 1.0
			}
			if h >= 18 || h <= 2 {
				roas += 0.5
			}
			matrix = append(matrix, models.ROASMatrixCell{
				DayOfWeek: d,
				HourOfDay: h,
				ROAS:      roas,
			})
		}
	}
	return matrix, nil
}
