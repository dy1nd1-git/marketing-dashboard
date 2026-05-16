import axios from "axios";
import {
  MarketingData,
  DashboardData,
  PivotDetails,
  ROASMatrixCell,
  FunnelStep,
  ChannelStats,
  DashboardInsight,
} from "../types/marketing";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
});

export const fetchMarketingDataMock = async (): Promise<MarketingData[]> => {
  return [
    { id: "1", date: "2026-04-01", spend: 1000, revenue: 2000, roas: 2.0 },
    { id: "2", date: "2026-04-02", spend: 1200, revenue: 2500, roas: 2.08 },
    { id: "3", date: "2026-04-03", spend: 1500, revenue: 2800, roas: 1.87 },
    { id: "4", date: "2026-04-04", spend: 1800, revenue: 4000, roas: 2.22 },
  ];
};

export const fetchMarketingData = async (): Promise<MarketingData[]> => {
  try {
    const response = await apiClient.get<MarketingData[]>("/api/marketing");
    return response.data;
  } catch {
    console.warn("API Error: falling back to mock data");
    return fetchMarketingDataMock();
  }
};

export const fetchDashboardDataMock = async (): Promise<DashboardData> => {
  return {
    kpis: [
      {
        title: "Revenue",
        value: "$142,384",
        trendIcon: "arrow_upward",
        trendValue: "12.4%",
        trendBgClass: "bg-secondary-container/20",
        trendTextClass: "text-on-secondary-container",
        barClasses: [
          "bg-primary/10 h-1/2",
          "bg-primary/10 h-3/4",
          "bg-primary/10 h-2/3",
          "bg-primary h-full",
          "bg-primary/10 h-4/5",
        ],
      },
      {
        title: "Spend",
        value: "$34,200",
        trendIcon: "remove",
        trendValue: "0.5%",
        trendBgClass: "bg-slate-100",
        trendTextClass: "text-slate-600",
        barClasses: [
          "bg-slate-200 h-1/3",
          "bg-slate-200 h-1/2",
          "bg-slate-400 h-2/3",
          "bg-slate-200 h-1/2",
          "bg-slate-200 h-1/4",
        ],
      },
      {
        title: "ROAS",
        value: "4.16x",
        trendIcon: "arrow_upward",
        trendValue: "8.2%",
        trendBgClass: "bg-secondary-container/20",
        trendTextClass: "text-on-secondary-container",
        barClasses: [
          "bg-secondary-fixed-dim/20 h-2/3",
          "bg-secondary-fixed-dim/20 h-full",
          "bg-secondary-fixed-dim h-3/4",
          "bg-secondary-fixed-dim/20 h-2/3",
          "bg-secondary-fixed-dim/20 h-1/2",
        ],
      },
      {
        title: "Conversions",
        value: "1,894",
        trendIcon: "arrow_downward",
        trendValue: "2.1%",
        trendBgClass: "bg-error-container/40",
        trendTextClass: "text-on-error-container",
        barClasses: [
          "bg-slate-100 h-full",
          "bg-slate-100 h-3/4",
          "bg-slate-100 h-2/3",
          "bg-slate-100 h-1/2",
          "bg-slate-100 h-1/3",
        ],
      },
    ],
    funnel: [
      {
        label: "Awareness",
        value: "1.2M",
        percentage: 100,
        subLabel: "Baseline",
      },
      {
        label: "Consideration",
        value: "840K",
        percentage: 70,
        subLabel: "Retention",
        dropOff: 30,
      },
      {
        label: "Intent",
        value: "125K",
        percentage: 45,
        subLabel: "Clicks",
        dropOff: 25,
      },
      {
        label: "Purchase",
        value: "3.4K",
        percentage: 15,
        subLabel: "Conv.",
        dropOff: 30,
      },
    ],
    channels: [
      {
        id: "1",
        name: "Meta Ads",
        category: "Paid Social",
        spend: 24300,
        revenue: 182500,
        roas: 7.51,
        icon: "M",
      },
      {
        id: "2",
        name: "Google Search",
        category: "PPC",
        spend: 12100,
        revenue: 64200,
        roas: 5.3,
        icon: "G",
      },
      {
        id: "3",
        name: "TikTok Spark",
        category: "Social",
        spend: 8500,
        revenue: 42000,
        roas: 4.94,
        icon: "T",
      },
    ],
    insights: [
      {
        title: "Top Success",
        description: "Paid social scaling increased ROAS by 14% this week.",
      },
      {
        title: "Opportunity",
        description: "SMS retargeting shows 4x higher intent than email.",
      },
    ],
    stats: {
      revenue: 142384,
      revenue_diff: 12.4,
      spend: 34200,
      spend_diff: 0.5,
      roas: 4.16,
      roas_diff: 2.1,
      conversions: 3400,
      conv_diff: 5.2,
    },
    matrix: [],
  };
};

export interface BackendDashboardResponse {
  stats: {
    revenue: number;
    revenue_diff: number;
    spend: number;
    spend_diff: number;
    roas: number;
    roas_diff: number;
    conversions: number;
    conv_diff: number;
  };
  matrix: ROASMatrixCell[];
  funnel: FunnelStep[];
  channels: ChannelStats[];
  insights: DashboardInsight[];
}

export const fetchDashboardData = async (
  startDate?: string,
  endDate?: string,
): Promise<DashboardData> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const queryString = params.toString();
    const url = `/api/v1/marketing/dashboard${queryString ? `?${queryString}` : ""}`;
    const response = await apiClient.get<BackendDashboardResponse>(url);
    const { stats, matrix, funnel, channels, insights } = response.data;

    const kpis = [
      {
        title: "Revenue",
        value: `$${stats.revenue.toLocaleString()}`,
        trendIcon: stats.revenue_diff >= 0 ? "arrow_upward" : "arrow_downward",
        trendValue: `${Math.abs(stats.revenue_diff).toFixed(1)}%`,
        trendBgClass:
          stats.revenue_diff >= 0
            ? "bg-secondary-container/20"
            : "bg-error-container/40",
        trendTextClass:
          stats.revenue_diff >= 0
            ? "text-on-secondary-container"
            : "text-on-error-container",
      },
      {
        title: "Spend",
        value: `$${stats.spend.toLocaleString()}`,
        trendIcon: stats.spend_diff >= 0 ? "arrow_upward" : "arrow_downward",
        trendValue: `${Math.abs(stats.spend_diff).toFixed(1)}%`,
        trendBgClass:
          stats.spend_diff >= 0 ? "bg-slate-100" : "bg-secondary-container/20",
        trendTextClass: "text-on-surface-variant",
      },
      {
        title: "ROAS",
        value: `${stats.roas.toFixed(2)}x`,
        trendIcon: stats.roas_diff >= 0 ? "arrow_upward" : "arrow_downward",
        trendValue: `${Math.abs(stats.roas_diff).toFixed(1)}%`,
        trendBgClass:
          stats.roas_diff >= 0 ? "bg-primary/10" : "bg-error-container/40",
        trendTextClass: "text-primary",
      },
      {
        title: "Conversions",
        value: stats.conversions.toLocaleString(),
        trendIcon: stats.conv_diff >= 0 ? "arrow_upward" : "arrow_downward",
        trendValue: `${Math.abs(stats.conv_diff).toFixed(1)}%`,
        trendBgClass:
          stats.conv_diff >= 0
            ? "bg-secondary-container/20"
            : "bg-error-container/40",
        trendTextClass:
          stats.conv_diff >= 0
            ? "text-on-secondary-container"
            : "text-on-error-container",
      },
    ];

    return {
      stats: stats as DashboardData["stats"],
      kpis,
      matrix,
      funnel,
      channels,
      insights,
    };
  } catch (error) {
    console.warn("API Error: falling back to mock dashboard data", error);
    return fetchDashboardDataMock();
  }
};

export const fetchPivotDataMock = async (id: string): Promise<PivotDetails> => {
  return {
    id,
    pivotDate: "2026-04-15",
    status: "achieved", // or "deviated"
    memo: {
      intent:
        "CPA高騰に対し、LPのファーストビューを改善し、動画フォーマットの配信比率を上げた。",
      diagnosis: [
        "CPA: 予測 ¥5,000 → 実績 ¥3,800 (-24%)",
        "ROAS: 予測 250% → 実績 310% (+60pt)",
        "掲載順位: 平均2.4位維持",
      ],
      conclusion:
        "クリエイティブ変更によりCPA抑制に成功し、ROASも大幅に改善した。",
    },
    timeline: [
      { date: "2026-04-10", actual: 12000, predicted: 12000 },
      { date: "2026-04-11", actual: 12500, predicted: 12500 },
      { date: "2026-04-12", actual: 11800, predicted: 11800 },
      { date: "2026-04-13", actual: 12200, predicted: 12200 },
      { date: "2026-04-14", actual: 13000, predicted: 13000 },
      { date: "2026-04-15", actual: 12800, predicted: 12800 }, // Pivot point
      { date: "2026-04-16", actual: 14500, predicted: 13200 },
      { date: "2026-04-17", actual: 16000, predicted: 13500 },
      { date: "2026-04-18", actual: 18200, predicted: 13800 },
      { date: "2026-04-19", actual: 17500, predicted: 14100 },
      { date: "2026-04-20", actual: 19000, predicted: 14400 },
      { date: "2026-04-21", actual: 21000, predicted: 14700 },
      { date: "2026-04-22", actual: 22500, predicted: 15000 },
    ],
  };
};

export const fetchPivotData = async (id: string): Promise<PivotDetails> => {
  try {
    const response = await apiClient.get<PivotDetails>(`/api/pivot/${id}`);
    return response.data;
  } catch {
    console.warn("API Error: falling back to mock pivot data");
    return fetchPivotDataMock(id);
  }
};
