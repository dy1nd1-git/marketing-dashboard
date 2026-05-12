package models

import "time"

// MetricRow represents a single row of data in the dashboard tables.
// Lineage represents the origin of a data point.
type Lineage struct {
	Source  string `json:"source"`
	QueryID string `json:"query_id,omitempty"`
	SQLRef  string `json:"sql_ref,omitempty"`
}

// MetricRow represents a single row of data in the dashboard tables.
type MetricRow struct {
	Date       time.Time `json:"date"`
	Week       string    `json:"week,omitempty"`
	Traffic    int       `json:"traffic"`
	CVR        float64   `json:"cvr"`
	ROI        float64   `json:"roi"`
	ROAS       float64   `json:"roas"`
	NetROAS    float64   `json:"net_roas"`
	Revenue    float64   `json:"revenue"`
	AvgRevenue float64   `json:"avg_revenue"`
	Spend      float64   `json:"spend"`
	AvgSpend   float64   `json:"avg_spend"`
	CTR        float64   `json:"ctr"`
	IsAnomaly  bool      `json:"is_anomaly"`
	ZScore     float64   `json:"z_score"`
	Lineage    Lineage   `json:"lineage"`
}

// ResponseMetadata holds system-level metadata for the Chain of Trust.
type ResponseMetadata struct {
	Engine     string `json:"engine"`
	Confidence string `json:"confidence"` // High, Low (based on n > 30)
	SQLRef     string `json:"sql_ref,omitempty"`
}
