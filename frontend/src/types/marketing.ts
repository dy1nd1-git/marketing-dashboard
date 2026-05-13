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
  barClasses: string[];
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

export interface DashboardData {
  kpis: KPI[];
  funnel: FunnelLayerData[];
  insights: InsightData[];
  channels: ChannelPerformance[];
  liveInsight: {
    title: string;
    description: string;
  };
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
  confidence: "High" | "Medium" | "Low";
  engine?: string;
  timestamp?: string;
  zScore?: number;
}
