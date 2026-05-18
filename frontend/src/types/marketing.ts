export interface MarketingData {
  id: string;
  date: string;
  spend: number;
  revenue: number;
  roas: number;
}

export interface KPI {
  title: string;
  value: string;
  trendIcon: string;
  trendValue: string;
  trendBgClass: string;
  trendTextClass: string;
  barClasses?: string[];
}

export interface FunnelLayerData {
  label: string;
  value: string;
  metricLabel: string;
  metricValue: string;
  dropValue?: string;
  colorClassMain: string;
  colorClassHover: string;
  widthClass: string;
  textMainClass: string;
  textSubClass: string;
}

export interface InsightData {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  icon: string;
}

export interface ChannelPerformance {
  id: string;
  name: string;
  category: string;
  spend: string;
  revenue: string;
  roas: string;
  icon: string;
  color: "indigo" | "orange" | "green" | "slate";
}

export interface ROASMatrixCell {
  day_of_week: number;
  hour_of_day: number;
  roas: number;
}

export interface FunnelStep {
  label: string;
  value: string;
  percentage: number;
  subLabel: string;
  dropOff?: number;
}

export interface ChannelStats {
  id: string;
  name: string;
  category: string;
  spend: number;
  revenue: number;
  roas: number;
  icon: string;
}

export interface DashboardInsight {
  title: string;
  description: string;
}

export interface DashboardStats {
  revenue: number;
  revenue_diff: number;
  spend: number;
  spend_diff: number;
  roas: number;
  roas_diff: number;
  conversions: number;
  conv_diff: number;
}

export interface DashboardData {
  stats: DashboardStats;
  kpis: KPI[];
  matrix: ROASMatrixCell[];
  funnel: FunnelStep[];
  channels: ChannelStats[];
  insights: DashboardInsight[];
}

export interface PivotData {
  date: string;
  actual: number | null;
  predicted: number | null;
}

export interface PivotDetails {
  id: string;
  pivotDate: string;
  status: "achieved" | "deviated";
  memo: {
    intent: string;
    diagnosis: string[];
    conclusion: string;
  };
  timeline: PivotData[];
}

export interface LineageTelemetry {
  source: string;
  confidence: string;
  engine?: string;
  timestamp?: string;
  zScore?: number;
  sourceTable?: string;
  executionSql?: string;
  researchNotes?: string;
}

export interface Lineage {
  source: string;
  query_id?: string;
  sql_ref?: string;
  timestamp?: string;
}

export interface DailyCVR {
  date: string;
  revenue: number;
  spend: number;
  roas: number;
  ctr: number;
  cvr: number;
  is_anomaly?: boolean;
  z_score?: number;
  lineage?: Lineage;
}

export interface ResponseMetadata {
  engine: string;
  confidence: string;
  sql_ref?: string;
}

