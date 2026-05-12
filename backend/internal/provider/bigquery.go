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
	// If credentialsJSON is empty, bigquery.NewClient will automatically look for
	// GOOGLE_APPLICATION_CREDENTIALS environment variable (file path).

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
	var queryStr string

	// GA4 Official Schema Detection
	if p.tableID == "events_*" || p.tableID == "events_" {
		// ALWAYS query from the public project for GA4 sample data, regardless of billing project
		sourceProject := "bigquery-public-data"
		
		queryStr = fmt.Sprintf(`
			WITH base AS (
				SELECT
					PARSE_DATE('%%Y%%m%%d', event_date) as date,
					COALESCE(ecommerce.purchase_revenue, 0) as rev,
					(SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') as session_id,
					event_name
				FROM 
					`+"`%s.%s.%s`"+`
				WHERE
					_TABLE_SUFFIX BETWEEN 
						FORMAT_DATE('%%Y%%m%%d', DATE_SUB(PARSE_DATE('%%Y%%m%%d', (SELECT MAX(_TABLE_SUFFIX) FROM `+"`%s.%s.%s`"+`)), INTERVAL %d DAY))
						AND (SELECT MAX(_TABLE_SUFFIX) FROM `+"`%s.%s.%s`"+`)
			)
			SELECT
				date,
				SUM(rev) as revenue,
				COUNT(DISTINCT session_id) as traffic,
				SAFE_DIVIDE(COUNT(DISTINCT IF(event_name = 'purchase', session_id, NULL)), COUNT(DISTINCT session_id)) as cvr,
				SUM(rev) * 0.3 as spend,
				3.33 as roas,
				3.33 as roi
			FROM 
				base
			GROUP BY 1
			ORDER BY 1 DESC`, sourceProject, p.datasetID, p.tableID, sourceProject, p.datasetID, p.tableID, sourceProject, p.datasetID, p.tableID, days)
	} else {
		// Standard flat schema query
		queryStr = fmt.Sprintf(`
			SELECT 
				date, 
				traffic, 
				cvr, 
				roas,
				roi, 
				revenue,
				spend
			FROM 
				`+"`%s.%s.%s`"+`
			WHERE 
				date >= DATE_SUB(CURRENT_DATE(), INTERVAL %d DAY)
			ORDER BY 
				date DESC`, p.projectID, p.datasetID, p.tableID, days)
	}

	return p.executeQuery(ctx, queryStr)
}

func (p *BigQueryProvider) GetWeeklyTrends(ctx context.Context, weeks int) ([]models.MetricRow, models.ResponseMetadata, error) {
	queryStr := fmt.Sprintf(`
		SELECT 
			DATE_TRUNC(date, WEEK) as date, 
			SUM(traffic) as traffic, 
			AVG(cvr) as cvr, 
			AVG(roas) as roas,
			AVG(roi) as roi, 
			SUM(revenue) as revenue,
			SUM(spend) as spend
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
		return nil, models.ResponseMetadata{}, fmt.Errorf("failed to execute query on %s.%s.%s: %w", p.projectID, p.datasetID, p.tableID, err)
	}

	var rows []models.MetricRow
	var revenueValues []float64

	for {
		// Use a map to handle potentially dynamic schemas from BigQuery
		var row map[string]bigquery.Value
		err := it.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, models.ResponseMetadata{}, fmt.Errorf("failed to iterate results: %w", err)
		}

		// Helper to extract float from various BQ types
		asFloat := func(v bigquery.Value) float64 {
			switch t := v.(type) {
			case float64: return t
			case int64: return float64(t)
			case float32: return float64(t)
			default: return 0
			}
		}

		dateVal, _ := row["date"].(time.Time)
		revenue := asFloat(row["revenue"])
		traffic, _ := row["traffic"].(int64)
		cvr := asFloat(row["cvr"])
		roas := asFloat(row["roas"])
		if roas == 0 {
			roas = asFloat(row["roi"]) // fallback to roi if roas missing
		}
		spend := asFloat(row["spend"])
		if spend == 0 && roas > 0 {
			spend = revenue / roas
		}

		rows = append(rows, models.MetricRow{
			Date:       dateVal,
			Traffic:    int(traffic),
			CVR:        cvr,
			ROAS:       roas,
			ROI:        roas,
			NetROAS:    roas,
			Revenue:    revenue,
			AvgRevenue: revenue,
			Spend:      spend,
			AvgSpend:   spend,
			CTR:        0.02, // default if missing
			Lineage: models.Lineage{
				Source:  fmt.Sprintf("%s.%s.%s", p.projectID, p.datasetID, p.tableID),
				SQLRef:  queryStr,
			},
		})
		revenueValues = append(revenueValues, revenue)
	}

	// Calculate Anomaly Detection based on Revenue using Z-Score (Z > 2.0)
	zScores := utils.CalculateZScores(revenueValues)
	for i := range rows {
		rows[i].ZScore = zScores[i]
		if zScores[i] > 2.0 || zScores[i] < -2.0 {
			rows[i].IsAnomaly = true
		}
	}

	confidence := "High"
	if len(rows) <= 30 {
		confidence = "Low (Sample size n=" + fmt.Sprint(len(rows)) + " <= 30)"
	}

	meta := models.ResponseMetadata{
		Engine:     "Decision-Tracer-BQ-v1",
		Confidence: confidence,
		SQLRef:     queryStr,
	}

	return rows, meta, nil
}
