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
