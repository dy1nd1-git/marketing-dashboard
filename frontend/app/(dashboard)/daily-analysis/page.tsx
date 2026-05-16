"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineageHUD } from "./components/LineageHUD";
import { StockInsightButton } from "../../../src/components/dashboard/StockInsightButton";
import { useMarketingContext } from "../../../src/context/MarketingContext";
import { DateRangePicker } from "../../../src/components/dashboard/DateRangePicker";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const channelFluxData = [
  { name: "Organic Search", value: 45000 },
  { name: "Paid Social", value: 32000 },
  { name: "Direct", value: 28000 },
  { name: "Referral", value: 15000 },
  { name: "Email", value: 12000 },
];

const audienceTidesData = [
  { time: "00:00", returning: 1200, new: 400 },
  { time: "04:00", returning: 800, new: 200 },
  { time: "08:00", returning: 3400, new: 1500 },
  { time: "12:00", returning: 5600, new: 2800 },
  { time: "16:00", returning: 4800, new: 2100 },
  { time: "20:00", returning: 6100, new: 3200 },
];

interface Lineage {
  source: string;
  query_id?: string;
  sql_ref?: string;
  timestamp?: string;
}

interface DailyCVR {
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

interface ResponseMetadata {
  engine: string;
  confidence: string;
  sql_ref?: string;
}

// Unified interface to represent Daily, Weekly, and Monthly aggregated rows with identical metrics
interface UnifiedMetric {
  period: string;
  revenue: number;
  spend: number;
  roas: number;
  ctr: number;
  is_anomaly?: boolean;
}

export default function DailyDashboard() {
  const router = useRouter();
  const { startDate, endDate } = useMarketingContext();
  const [dailyData, setDailyData] = useState<DailyCVR[]>([]);
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<"ripples" | "flux" | "tides">(
    "ripples",
  );

  // Independent sorting states for the 3 unified tables
  const [dailySort, setDailySort] = useState<{
    key: keyof UnifiedMetric;
    dir: "asc" | "desc";
  }>({ key: "period", dir: "desc" });

  const [weeklySort, setWeeklySort] = useState<{
    key: keyof UnifiedMetric;
    dir: "asc" | "desc";
  }>({ key: "period", dir: "desc" });

  const [monthlySort, setMonthlySort] = useState<{
    key: keyof UnifiedMetric;
    dir: "asc" | "desc";
  }>({ key: "period", dir: "desc" });

  useEffect(() => {
    async function fetchData() {
      try {
        // Optimized to only fetch dynamic multi-day slices; weekly/monthly arrays are computed client-side
        const res = await fetch(
          `http://localhost:8080/api/v1/marketing/daily-cvr?start_date=${startDate}&end_date=${endDate}`
        );
        const json = await res.json();
        setDailyData(json.data || []);
        setMetadata(json.metadata);
      } catch (error) {
        console.error("Failed to fetch marketing telemetry:", error);
      }
    }
    fetchData();
  }, [startDate, endDate]);

  // 1. Map to Unified Daily
  const unifiedDaily: UnifiedMetric[] = dailyData.map((d) => ({
    period: d.date,
    revenue: d.revenue,
    spend: d.spend,
    roas: d.roas,
    ctr: d.ctr,
    is_anomaly: d.is_anomaly,
  }));

  // 2. Reduce to Unified Weekly
  const weeklyMap: {
    [label: string]: { revenue: number; spend: number; ctrSum: number; count: number; anomaly: boolean };
  } = {};

  dailyData.forEach((d) => {
    const dateObj = new Date(d.date);
    const weekNum = Math.ceil(dateObj.getDate() / 7);
    const monthStr = d.date.substring(0, 7);
    const label = `${monthStr} W${weekNum}`;

    if (!weeklyMap[label]) {
      weeklyMap[label] = { revenue: 0, spend: 0, ctrSum: 0, count: 0, anomaly: false };
    }
    weeklyMap[label].revenue += d.revenue;
    weeklyMap[label].spend += d.spend;
    weeklyMap[label].ctrSum += d.ctr;
    weeklyMap[label].count += 1;
    if (d.is_anomaly) weeklyMap[label].anomaly = true;
  });

  const unifiedWeekly: UnifiedMetric[] = Object.keys(weeklyMap).map((label) => {
    const curr = weeklyMap[label];
    return {
      period: label,
      revenue: curr.revenue,
      spend: curr.spend,
      roas: curr.spend > 0 ? curr.revenue / curr.spend : 0,
      ctr: curr.count > 0 ? curr.ctrSum / curr.count : 0,
      is_anomaly: curr.anomaly,
    };
  });

  // 3. Reduce to Unified Monthly
  const monthlyMap: {
    [label: string]: { revenue: number; spend: number; ctrSum: number; count: number; anomaly: boolean };
  } = {};

  dailyData.forEach((d) => {
    const label = d.date.substring(0, 7);
    if (!monthlyMap[label]) {
      monthlyMap[label] = { revenue: 0, spend: 0, ctrSum: 0, count: 0, anomaly: false };
    }
    monthlyMap[label].revenue += d.revenue;
    monthlyMap[label].spend += d.spend;
    monthlyMap[label].ctrSum += d.ctr;
    monthlyMap[label].count += 1;
    if (d.is_anomaly) monthlyMap[label].anomaly = true;
  });

  const unifiedMonthly: UnifiedMetric[] = Object.keys(monthlyMap).map((label) => {
    const curr = monthlyMap[label];
    return {
      period: label,
      revenue: curr.revenue,
      spend: curr.spend,
      roas: curr.spend > 0 ? curr.revenue / curr.spend : 0,
      ctr: curr.count > 0 ? curr.ctrSum / curr.count : 0,
      is_anomaly: curr.anomaly,
    };
  });

  // Universal Sorting function
  const sortUnifiedData = (
    arr: UnifiedMetric[],
    config: { key: keyof UnifiedMetric; dir: "asc" | "desc" }
  ) => {
    return [...arr].sort((a, b) => {
      const valA = a[config.key];
      const valB = b[config.key];
      if (valA! < valB!) return config.dir === "asc" ? -1 : 1;
      if (valA! > valB!) return config.dir === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedDaily = sortUnifiedData(unifiedDaily, dailySort);
  const sortedWeekly = sortUnifiedData(unifiedWeekly, weeklySort);
  const sortedMonthly = sortUnifiedData(unifiedMonthly, monthlySort);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatNumber = (val: number) => val.toFixed(2);

  const formatShortLabel = (period: string, type: string) => {
    try {
      if (type === "Daily") {
        const clean = period.split("T")[0];
        const parts = clean.split("-");
        if (parts.length >= 3) {
          const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return clean;
      }
      if (type === "Weekly") {
        const parts = period.split(" ");
        if (parts.length === 2) {
          const monthParts = parts[0].split("-");
          if (monthParts.length >= 2) {
            const dateObj = new Date(parseInt(monthParts[0]), parseInt(monthParts[1]) - 1, 1);
            const monthShort = dateObj.toLocaleDateString("en-US", { month: "short" });
            return `${monthShort} ${parts[1]}`;
          }
        }
        return period.replace("2025-", "").replace("2026-", "");
      }
      if (type === "Monthly") {
        const parts = period.split("-");
        if (parts.length >= 2) {
          const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
          return dateObj.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        }
        return period;
      }
    } catch {
      return period;
    }
    return period;
  };

  const onAnomalyClick = (date: string, metric: string) => {
    router.push(`/analise?date_range=${date}&metric=${metric}&segment_id=all_users`);
  };

  // Reusable component rendering engine for the 3 metrics tables to guarantee DRY code
  const renderMetricTable = (
    title: string,
    subtitle: string,
    data: UnifiedMetric[],
    sortConfig: { key: keyof UnifiedMetric; dir: "asc" | "desc" },
    onSort: (key: keyof UnifiedMetric) => void,
    sourceTag: string,
    sourceUri: string
  ) => (
    <section className="flex-1 card-professional flex flex-col min-w-[300px]">
      <header className="mb-4 flex justify-between items-end gap-2">
        <div className="overflow-hidden">
          <h2 className="font-h2 text-h2 text-on-surface truncate tracking-tight">
            {title}
          </h2>
          <p className="text-on-surface-variant font-body-md text-[11px] mt-0.5 truncate opacity-80">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <StockInsightButton
            item={{
              title: `${title} Matrix`,
              type: "table",
              metricsSummary: `Aggregated Rows: ${data.length}`,
              sourceRef: sourceUri,
              notes: `Periodic slice export structured under ${sourceTag} grouping.`,
              chartPayload: data.map((r) => ({
                Period: formatShortLabel(r.period, sourceTag),
                Revenue: formatCurrency(r.revenue),
                Spend: formatCurrency(r.spend),
                ROAS: formatNumber(r.roas),
              })),
            }}
            variant="icon"
          />
          <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant font-label text-[9px] rounded font-bold uppercase tracking-wider border border-outline-variant/20">
            {sourceTag}
          </span>
          <LineageHUD
            compact
            telemetry={{
              source: sourceUri,
              confidence: "High",
              engine: metadata?.engine || "Decision-Tracer-BQ-v1",
            }}
          />
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-xl border border-surface-container-highest relative max-h-[480px] shadow-2xs">
        <table className="w-full text-left border-collapse font-body text-xs">
          <thead>
            <tr className="border-b border-surface-container-highest bg-surface-container-lowest text-on-surface-variant select-none">
              <th
                onClick={() => onSort("period")}
                className="py-2.5 px-3 font-label font-bold whitespace-nowrap cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                Period {sortConfig.key === "period" ? (sortConfig.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                onClick={() => onSort("revenue")}
                className="py-2.5 px-3 font-label font-bold text-right whitespace-nowrap cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                Rev {sortConfig.key === "revenue" ? (sortConfig.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                onClick={() => onSort("spend")}
                className="py-2.5 px-3 font-label font-bold text-right whitespace-nowrap cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                Spend {sortConfig.key === "spend" ? (sortConfig.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                onClick={() => onSort("roas")}
                className="py-2.5 px-3 font-label font-bold text-right whitespace-nowrap cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                ROAS {sortConfig.key === "roas" ? (sortConfig.dir === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest text-on-surface font-data">
            {data.map((row) => (
              <tr
                key={row.period}
                onClick={() => row.is_anomaly && onAnomalyClick(row.period, "roas")}
                className={`${
                  row.is_anomaly
                    ? "bg-tertiary-container/10 hover:bg-tertiary-container/20 cursor-pointer"
                    : "hover:bg-surface-container-lowest"
                } transition-colors`}
              >
                <td className={`py-3 px-3 whitespace-nowrap font-medium ${row.is_anomaly ? "text-tertiary" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    {row.is_anomaly && (
                      <span className="material-symbols-outlined text-[13px] text-tertiary shrink-0 animate-pulse">
                        warning
                      </span>
                    )}
                    <span className="truncate">{formatShortLabel(row.period, sourceTag)}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-on-surface-variant font-mono">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="py-3 px-3 text-right text-on-surface-variant font-mono">
                  {formatCurrency(row.spend)}
                </td>
                <td
                  className={`py-3 px-3 text-right font-bold font-mono ${
                    row.is_anomaly ? "text-tertiary" : "text-primary"
                  }`}
                >
                  {formatNumber(row.roas)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="p-xl max-w-[1500px] space-y-xl mx-auto">
      {/* Header section: Ultra-clean and modern Layout */}
      <header className="mb-xl flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight">
            Subaquatic Observatory
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Marketing telemetry bounded by strict pipeline scope
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
          <DateRangePicker />
          {/* Pure Query Origin Panel */}
          <LineageHUD
            telemetry={{
              source: metadata?.sql_ref || "bq://mellow.dw.subaquatic_observatory_v1",
              confidence: "High",
              engine: metadata?.engine || "Decision-Tracer-BQ-v1",
            }}
          />
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="flex items-center gap-8 border-b border-surface-container-highest mb-xl px-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab("ripples")}
          className={`relative pb-4 font-label text-label transition-colors ${
            activeTab === "ripples" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Aggregated Stratum
          {activeTab === "ripples" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("flux")}
          className={`relative pb-4 font-label text-label transition-colors ${
            activeTab === "flux" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Channel Flux
          {activeTab === "flux" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("tides")}
          className={`relative pb-4 font-label text-label transition-colors ${
            activeTab === "tides" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Audience Tides
          {activeTab === "tides" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
      </nav>

      {/* Main Visual Display Grid */}
      <div className="flex flex-col gap-lg items-stretch min-h-[500px]">
        {activeTab === "ripples" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start w-full">
            {renderMetricTable(
              "Daily Tactical",
              "Granular day pulses",
              sortedDaily,
              dailySort,
              (k) =>
                setDailySort((p) => ({
                  key: k,
                  dir: p.key === k && p.dir === "desc" ? "asc" : "desc",
                })),
              "Daily",
              metadata?.sql_ref || "bq://mellow.dw.tactical_daily_cvr"
            )}
            {renderMetricTable(
              "Weekly Stratum",
              "Aggregated week blocks",
              sortedWeekly,
              weeklySort,
              (k) =>
                setWeeklySort((p) => ({
                  key: k,
                  dir: p.key === k && p.dir === "desc" ? "asc" : "desc",
                })),
              "Weekly",
              "bq://mellow.dw.stratum_weekly_cvr"
            )}
            {renderMetricTable(
              "Monthly Horizon",
              "Macro efficiency waves",
              sortedMonthly,
              monthlySort,
              (k) =>
                setMonthlySort((p) => ({
                  key: k,
                  dir: p.key === k && p.dir === "desc" ? "asc" : "desc",
                })),
              "Monthly",
              "bq://mellow.dw.horizon_monthly_cvr"
            )}
          </div>
        )}

        {activeTab === "flux" && (
          <section className="flex-1 card-professional flex flex-col w-full">
            <header className="mb-6 flex justify-between items-end gap-2">
              <div>
                <h2 className="font-h2 text-h2 text-on-surface">Channel Flux</h2>
                <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                  Revenue Distribution by Channel
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StockInsightButton
                  item={{
                    title: "Channel Flux Distribution",
                    type: "chart",
                    metricsSummary: "Top Channel: Organic Search",
                    sourceRef: "bq://mellow.dw.channel_revenue_flux",
                    notes: "Revenue yield distribution breakdown by primary attribution parameters.",
                    chartPayload: channelFluxData.map((d) => ({ name: d.name, value: d.value })),
                  }}
                  variant="icon"
                />
                <LineageHUD
                  telemetry={{
                    source: "bq://mellow.dw.channel_revenue_flux",
                    confidence: "High",
                    engine: "Decision-Tracer-BQ-v1",
                  }}
                />
              </div>
            </header>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <BarChart data={channelFluxData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--color-outline)", fontSize: 12 }} />
                  <YAxis tickFormatter={(val) => `$${val / 1000}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--color-outline)", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "#f4f4f1" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary-container)" radius={[4, 4, 0, 0]} name="Revenue">
                    {channelFluxData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "var(--color-primary)" : "var(--color-primary-container)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {activeTab === "tides" && (
          <section className="flex-1 card-professional flex flex-col w-full">
            <header className="mb-6 flex justify-between items-end gap-2">
              <div>
                <h2 className="font-h2 text-h2 text-on-surface">Audience Tides</h2>
                <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                  Daily User Activity Waves
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StockInsightButton
                  item={{
                    title: "Audience Tides Waveform",
                    type: "chart",
                    metricsSummary: "Peak Hour: 20:00",
                    sourceRef: "bq://mellow.dw.audience_activity_tides",
                    notes: "Comparative daily user activation pulses comparing returning vs new telemetry.",
                    chartPayload: audienceTidesData.map((d) => ({ time: d.time, returning: d.returning, new: d.new })),
                  }}
                  variant="icon"
                />
                <LineageHUD
                  telemetry={{
                    source: "bq://mellow.dw.audience_activity_tides",
                    confidence: "High",
                    engine: "Decision-Tracer-BQ-v1",
                  }}
                />
              </div>
            </header>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <AreaChart data={audienceTidesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-container)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-primary-container)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "var(--color-outline)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-outline)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="returning"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReturning)"
                    name="Returning Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stroke="var(--color-primary-container)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNew)"
                    name="New Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
