import axios from "axios";
import { MarketingData, DashboardData } from "../types/marketing";

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
        label: "Impressions",
        value: "1.2M",
        metricLabel: "Reach",
        metricValue: "100%",
        colorClassMain: "bg-indigo-50/50",
        colorClassHover: "group-hover:bg-indigo-50",
        widthClass: "w-full",
        textMainClass: "text-slate-700",
        textSubClass: "text-slate-400",
      },
      {
        label: "Clicks",
        value: "48,200",
        metricLabel: "CTR",
        metricValue: "4.0%",
        dropValue: "96% Drop",
        colorClassMain: "bg-indigo-100",
        colorClassHover: "group-hover:bg-indigo-200",
        widthClass: "w-[85%]",
        textMainClass: "text-slate-700",
        textSubClass: "text-slate-400",
      },
      {
        label: "Cart Add",
        value: "4,120",
        metricLabel: "Intent",
        metricValue: "8.5%",
        dropValue: "91% Drop",
        colorClassMain: "bg-indigo-400/80",
        colorClassHover: "group-hover:bg-indigo-400",
        widthClass: "w-[60%]",
        textMainClass: "text-white",
        textSubClass: "text-white/70",
      },
      {
        label: "Purchase",
        value: "1,894",
        metricLabel: "Conv.",
        metricValue: "46%",
        colorClassMain: "bg-indigo-600 shadow-lg shadow-indigo-200",
        colorClassHover: "group-hover:bg-indigo-700",
        widthClass: "w-[30%]",
        textMainClass: "text-white",
        textSubClass: "text-white/70",
      },
    ],
    insights: [
      {
        type: "success",
        title: "What went well",
        description: "Brand awareness campaigns on Instagram saw a 12% lift in search volume. Efficient ROAS growth in Tier 2 cities.",
        icon: "stars",
      },
      {
        type: "warning",
        title: "Improvements",
        description: "High cart abandonment (91%) on mobile devices. Checkout latency is affecting completion rates.",
        icon: "warning",
      },
      {
        type: "info",
        title: "Root Cause Analysis",
        description: "Mobile API bottleneck discovered in the 'Spring Sale' landing pages during peak traffic hours (6PM-9PM).",
        icon: "search",
      },
    ],
    channels: [
      {
        id: "ig",
        name: "Instagram Ads",
        category: "Social Media",
        spend: "$12,450",
        revenue: "$68,200",
        roas: "5.48x",
        icon: "IG",
        color: "indigo",
      },
      {
        id: "gs",
        name: "Google Search",
        category: "Paid Search",
        spend: "$18,200",
        revenue: "$52,140",
        roas: "2.86x",
        icon: "GS",
        color: "slate",
      },
      {
        id: "em",
        name: "Email Marketing",
        category: "Retention",
        spend: "$2,550",
        revenue: "$21,044",
        roas: "8.25x",
        icon: "EM",
        color: "green",
      },
    ],
    liveInsight: {
      title: "Live Insight",
      description: "Spring Sale conversion up 4% today",
    },
  };
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>("/api/dashboard");
    return response.data;
  } catch {
    console.warn("API Error: falling back to mock dashboard data");
    return fetchDashboardDataMock();
  }
};
