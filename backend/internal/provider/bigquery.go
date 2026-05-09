package provider

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/models"
	"github.com/dy1nd1-git/marketing-dashboard/backend/internal/utils"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type BigQueryProvider struct {
	client    *bigquery.Client
	projectID string
	datasetID string
	tableID   string
}

func NewBigQueryProvider(ctx context.Context, projectID, datasetID, tableID, credentialsJSON string) (*BigQueryProvider, error) {
	var opts []option.ClientOption
	if credentialsJSON != "" {
		opts = append(opts, option.WithCredentialsJSON([]byte(credentialsJSON)))
	}

	client, err := bigquery.NewClient(ctx, projectID, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to create bigquery client: %w", err)
	}

	return &BigQueryProvider{
		client:    client,
		projectID: projectID,
		datasetID: datasetID,
		tableID:   tableID,
	}, nil
}

func (p *BigQueryProvider) GetDailyTrends(ctx context.Context, days int) ([]models.MetricRow, models.ResponseMetadata, error) {
	queryStr := fmt.Sprintf(`
		SELECT 
			date, 
			traffic, 
			cvr, 
			roi, 
			revenue 
		FROM 
			`+"`%s.%s.%s`"+`
		WHERE 
			date >= DATE_SUB(CURRENT_DATE(), INTERVAL %d DAY)
		ORDER BY 
			date DESC`, p.projectID, p.datasetID, p.tableID, days)

	return p.executeQuery(ctx, queryStr)
}

func (p *BigQueryProvider) GetWeeklyTrends(ctx context.Context, weeks int) ([]models.MetricRow, models.ResponseMetadata, error) {
	queryStr := fmt.Sprintf(`
		SELECT 
			DATE_TRUNC(date, WEEK) as date, 
			SUM(traffic) as traffic, 
			AVG(cvr) as cvr, 
			AVG(roi) as roi, 
			SUM(revenue) as revenue 
		FROM 
			`+"`%s.%s.%s`"+`
		WHERE 
			date >= DATE_SUB(CURRENT_DATE(), INTERVAL %d WEEK)
		GROUP BY 
			1
		ORDER BY 
			date DESC`, p.projectID, p.datasetID, p.tableID, weeks)

	return p.executeQuery(ctx, queryStr)
}

func (p *BigQueryProvider) executeQuery(ctx context.Context, queryStr string) ([]models.MetricRow, models.ResponseMetadata, error) {
	q := p.client.Query(queryStr)
	it, err := q.Read(ctx)
	if err != nil {
		return nil, models.ResponseMetadata{}, fmt.Errorf("failed to execute query: %w", err)
	}

	var rows []models.MetricRow
	var revenueValues []float64

	for {
		var row struct {
			Date    time.Time
			Traffic int
			CVR     float64
			ROI     float64
			Revenue float64
		}
		err := it.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, models.ResponseMetadata{}, fmt.Errorf("failed to iterate results: %w", err)
		}

		rows = append(rows, models.MetricRow{
			Date:       row.Date,
			Traffic:    row.Traffic,
			CVR:        row.CVR,
			ROI:        row.ROI,
			ROAS:       row.ROI,
			Revenue:    row.Revenue,
			Spend:      row.Revenue / row.ROI,
			CTR:        0.02,
			AvgRevenue: row.Revenue,
			AvgSpend:   row.Revenue / row.ROI,
			NetROAS:    row.ROI,
			Lineage: models.Lineage{
				Source:  fmt.Sprintf("%s.%s.%s", p.projectID, p.datasetID, p.tableID),
				SQLRef:  queryStr,
			},
		})
		revenueValues = append(revenueValues, row.Revenue)
	}

	// Calculate Anomaly Detection based on Revenue using Z-Score
	zScores := utils.CalculateZScores(revenueValues)
	for i := range rows {
		rows[i].ZScore = zScores[i]
		if zScores[i] > 2.0 || zScores[i] < -2.0 {
			rows[i].IsAnomaly = true
		}
	}

	confidence := "High"
	if len(rows) <= 30 {
		confidence = "Low (Sample size <= 30)"
	}

	meta := models.ResponseMetadata{
		Engine:     "Decision-Tracer-BQ-v1",
		Confidence: confidence,
		SQLRef:     queryStr,
	}

	return rows, meta, nil
}
