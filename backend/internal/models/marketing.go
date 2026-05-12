package models

type MarketingStats struct {
	ID           string  `json:"id"`
	OrgID        string  `json:"org_id"`
	Date         string  `json:"date"`
	CampaignName string  `json:"campaign_name"`
	Spend        float64 `json:"spend"`
	Revenue      float64 `json:"revenue"`
	Impressions  int     `json:"impressions"`
	Clicks       int     `json:"clicks"`
	Conversions  int     `json:"conversions"`
}

type DailyCVR struct {
	Date    string  `json:"date"`
	Revenue float64 `json:"revenue"`
	Spend   float64 `json:"spend"`
	ROAS    float64 `json:"roas"`
	CTR     float64 `json:"ctr"`
	CVR     float64 `json:"cvr"`
}

type WeeklyROI struct {
	Week       string  `json:"week"`
	AvgRevenue float64 `json:"avg_revenue"`
	AvgSpend   float64 `json:"avg_spend"`
	NetROAS    float64 `json:"net_roas"`
}
