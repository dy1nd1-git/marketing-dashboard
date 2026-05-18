"use server";

import {
  MarketingData,
  DashboardData,
  PivotDetails,
  ROASMatrixCell,
  FunnelStep,
  ChannelStats,
  DashboardInsight,
  DailyCVR,
  ResponseMetadata,
} from "../types/marketing";
import { z } from "zod";

export const getServerApiUrl = (): string => {
  // サーバー側（windowがない環境）のときは、安全な「API_BASE_URL」を最優先で見る
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://localhost:8080";
  }
  // ブラウザ側のときは、公開用の「NEXT_PUBLIC_API_BASE_URL」を見る
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

import {
  fetchMarketingDataMock,
  fetchDashboardDataMock,
  fetchPivotDataMock,
} from "./api.mock";

export {
  fetchMarketingDataMock,
  fetchDashboardDataMock,
  fetchPivotDataMock,
};

export const fetchMarketingData = async (): Promise<MarketingData[]> => {
  try {
    const baseUrl = getServerApiUrl();
    const response = await fetch(`${baseUrl}/api/marketing`);
    if (!response.ok) throw new Error("Failed to fetch marketing data");
    return await response.json();
  } catch {
    console.warn("API Error: falling back to mock data");
    return fetchMarketingDataMock();
  }
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

const DashboardResponseSchema = z.object({
  stats: z.object({
    revenue: z.number(),
    revenue_diff: z.number(),
    spend: z.number(),
    spend_diff: z.number(),
    roas: z.number(),
    roas_diff: z.number(),
    conversions: z.number(),
    conv_diff: z.number(),
  }),
  matrix: z.array(z.any()),
  funnel: z.array(z.any()),
  channels: z.array(z.any()),
  insights: z.array(z.any()),
});

export const fetchDashboardData = async (
  startDate?: string,
  endDate?: string,
): Promise<DashboardData> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const queryString = params.toString();
    const baseUrl = getServerApiUrl();
    const url = `${baseUrl}/api/v1/marketing/dashboard${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch dashboard data");
    const data: BackendDashboardResponse = await response.json();

    // Validate response data
    const validation = DashboardResponseSchema.safeParse(data);
    if (!validation.success) {
      console.error("API Validation Failed:", validation.error.format());
      throw new Error("Invalid API response structure");
    }

    const { stats, matrix, funnel, channels, insights } = data;

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
export const fetchPivotData = async (id: string): Promise<PivotDetails> => {
  try {
    const baseUrl = getServerApiUrl();
    const response = await fetch(`${baseUrl}/api/pivot/${id}`);
    if (!response.ok) throw new Error("Failed to fetch pivot data");
    return await response.json();
  } catch {
    console.warn("API Error: falling back to mock pivot data");
    return fetchPivotDataMock(id);
  }
};

export const fetchDailyCVR = async (
  startDate?: string,
  endDate?: string,
): Promise<{ data: DailyCVR[]; metadata: ResponseMetadata }> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const queryString = params.toString();
    const baseUrl = getServerApiUrl();
    const url = `${baseUrl}/api/v1/marketing/daily-cvr${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch daily CVR");

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch marketing telemetry:", error);
    return {
      data: [],
      metadata: { engine: "Decision-Tracer-BQ-Fallback-v1", confidence: "Low" },
    };
  }
};
