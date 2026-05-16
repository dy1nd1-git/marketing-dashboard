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
			ORDER BY 1 DESC`, sourceProject, p.datasetID, p.tableID, sourceProject, p.datasetID, p.tableID, days, sourceProject, p.datasetID, p.tableID)
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

func (p *BigQueryProvider) GetDashboardData(ctx context.Context, startDate, endDate string) (models.DashboardData, error) {
	stats, err := p.GetDashboardStats(ctx, startDate, endDate)
	if err != nil {
		return models.DashboardData{}, err
	}
	matrix, err := p.GetROASMatrix(ctx, startDate, endDate)
	if err != nil {
		return models.DashboardData{}, err
	}

	// For now, mock funnel/channels/insights until specific BQ tables are ready
	// This ensures the frontend gets a consistent structure
	funnel := []models.FunnelStep{
		{Label: "Awareness", Value: "1.2M", Percentage: 100, SubLabel: "Baseline"},
		{Label: "Consideration", Value: "840K", Percentage: 70, SubLabel: "Retention", DropOff: 30},
		{Label: "Intent", Value: "125K", Percentage: 45, SubLabel: "Of Clicks", DropOff: 25},
		{Label: "Purchase", Value: "3.4K", Percentage: 15, SubLabel: "Conv.", DropOff: 30},
	}

	channels := []models.ChannelStats{
		{ID: "meta", Name: "Meta Ads", Category: "Paid Social", Spend: 24300, Revenue: 182500, ROAS: 7.51, Icon: "IG"},
		{ID: "google", Name: "Google Search", Category: "PPC", Spend: 12100, Revenue: 64200, ROAS: 5.30, Icon: "GS"},
	}

	insights := []models.DashboardInsight{
		{Title: "Strategic Success", Description: "Paid social scaling increased ROAS by 14%."},
	}

	return models.DashboardData{
		Stats:    stats,
		Matrix:   matrix,
		Funnel:   funnel,
		Channels: channels,
		Insights: insights,
	}, nil
}

// Keep individual methods for internal use if needed
func (p *BigQueryProvider) GetDashboardStats(ctx context.Context, startDate, endDate string) (models.DashboardStats, error) {
	// Standard schema aggregate query
	queryStr := fmt.Sprintf(`
		WITH current_period AS (
			SELECT 
				SUM(revenue) as rev, 
				SUM(spend) as spend, 
				SUM(conversions) as conv
			FROM `+"`%s.%s.%s`"+`
			WHERE date BETWEEN '%s' AND '%s'
		),
		prev_period AS (
			SELECT 
				SUM(revenue) as rev, 
				SUM(spend) as spend, 
				SUM(conversions) as conv
			FROM `+"`%s.%s.%s`"+`
			WHERE date BETWEEN DATE_SUB('%s', INTERVAL DATE_DIFF('%s', '%s', DAY) + 1 DAY) 
			              AND DATE_SUB('%s', INTERVAL 1 DAY)
		)
		SELECT 
			c.rev, 
			SAFE_DIVIDE(c.rev - p.rev, p.rev) * 100 as rev_diff,
			c.spend,
			SAFE_DIVIDE(c.spend - p.spend, p.spend) * 100 as spend_diff,
			SAFE_DIVIDE(c.rev, c.spend) as roas,
			SAFE_DIVIDE(SAFE_DIVIDE(c.rev, c.spend) - SAFE_DIVIDE(p.rev, p.spend), SAFE_DIVIDE(p.rev, p.spend)) * 100 as roas_diff,
			CAST(c.conv AS INT64) as conv,
			SAFE_DIVIDE(c.conv - p.conv, p.conv) * 100 as conv_diff
		FROM current_period c, prev_period p`, 
		p.projectID, p.datasetID, p.tableID, startDate, endDate,
		p.projectID, p.datasetID, p.tableID, startDate, endDate, startDate, startDate)

	q := p.client.Query(queryStr)
	it, err := q.Read(ctx)
	if err != nil {
		return models.DashboardStats{}, err
	}

	var stats models.DashboardStats
	var row struct {
		Rev       float64
		RevDiff   float64
		Spend     float64
		SpendDiff float64
		Roas      float64
		RoasDiff  float64
		Conv      int64
		ConvDiff  float64
	}
	err = it.Next(&row)
	if err != nil && err != iterator.Done {
		return stats, err
	}

	return models.DashboardStats{
		Revenue:     row.Rev,
		RevenueDiff: row.RevDiff,
		Spend:       row.Spend,
		SpendDiff:   row.SpendDiff,
		ROAS:        row.Roas,
		ROASDiff:    row.RoasDiff,
		Conversions: int(row.Conv),
		ConvDiff:    row.ConvDiff,
	}, nil
}

func (p *BigQueryProvider) GetROASMatrix(ctx context.Context, startDate, endDate string) (models.ROASMatrix, error) {
	queryStr := fmt.Sprintf(`
		SELECT 
			EXTRACT(DAYOFWEEK FROM date) - 1 as day_of_week,
			EXTRACT(HOUR FROM timestamp) as hour_of_day,
			SAFE_DIVIDE(SUM(revenue), SUM(spend)) as roas
		FROM `+"`%s.%s.%s`"+`
		WHERE date BETWEEN '%s' AND '%s'
		GROUP BY 1, 2
		ORDER BY 1, 2`, p.projectID, p.datasetID, p.tableID, startDate, endDate)

	q := p.client.Query(queryStr)
	it, err := q.Read(ctx)
	if err != nil {
		return nil, err
	}

	var matrix models.ROASMatrix
	for {
		var cell struct {
			DayOfWeek int64   `bigquery:"day_of_week"`
			HourOfDay int64   `bigquery:"hour_of_day"`
			ROAS      float64 `bigquery:"roas"`
		}
		err := it.Next(&cell)
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		matrix = append(matrix, models.ROASMatrixCell{
			DayOfWeek: int(cell.DayOfWeek),
			HourOfDay: int(cell.HourOfDay),
			ROAS:      cell.ROAS,
		})
	}
	return matrix, nil
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
