"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineageHUD } from "../../../src/components/dashboard/LineageHUD";
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

interface WeeklyROI {
  week: string;
  avg_revenue: number;
  avg_spend: number;
  net_roas: number;
  is_anomaly?: boolean;
  z_score?: number;
  lineage?: Lineage;
}

interface ResponseMetadata {
  engine: string;
  confidence: string;
  sql_ref?: string;
}

export default function DailyDashboard() {
  const router = useRouter();
  const [dailyData, setDailyData] = useState<DailyCVR[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyROI[]>([]);
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ripples" | "flux" | "tides">(
    "ripples",
  );

  // Sorting state
  const [dailySort, setDailySort] = useState<{
    key: keyof DailyCVR;
    dir: "asc" | "desc";
  }>({ key: "date", dir: "desc" });
  const [weeklySort, setWeeklySort] = useState<{
    key: keyof WeeklyROI;
    dir: "asc" | "desc";
  }>({ key: "week", dir: "desc" });

  useEffect(() => {
    async function fetchData() {
      try {
        const [dailyRes, weeklyRes] = await Promise.all([
          fetch("http://localhost:8080/api/v1/marketing/daily-cvr"),
          fetch("http://localhost:8080/api/v1/marketing/weekly-roi"),
        ]);

        const dailyJson = await dailyRes.json();
        const weeklyJson = await weeklyRes.json();

        setDailyData(dailyJson.data || []);
        setWeeklyData(weeklyJson.data || []);
        setMetadata(dailyJson.metadata);
      } catch (error) {
        console.error("Failed to fetch marketing data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDailySort = (key: keyof DailyCVR) => {
    setDailySort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
  };

  const handleWeeklySort = (key: keyof WeeklyROI) => {
    setWeeklySort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
  };

  const sortedDaily = [...dailyData].sort((a, b) => {
    const valA = a[dailySort.key];
    const valB = b[dailySort.key];
    
    // Fallback for non-comparable types (like Lineage objects)
    if (typeof valA === 'object' || typeof valB === 'object') return 0;
    
    if (valA! < valB!) return dailySort.dir === "asc" ? -1 : 1;
    if (valA! > valB!) return dailySort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const sortedWeekly = [...weeklyData].sort((a, b) => {
    const valA = a[weeklySort.key];
    const valB = b[weeklySort.key];
    
    if (typeof valA === 'object' || typeof valB === 'object') return 0;
    
    if (valA! < valB!) return weeklySort.dir === "asc" ? -1 : 1;
    if (valA! > valB!) return weeklySort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (val: number) => `${(val * 100).toFixed(1)}%`;
  const formatNumber = (val: number) => val.toFixed(2);

  const onAnomalyClick = (date: string, metric: string) => {
    router.push(
      `/analise?date_range=${date}&metric=${metric}&segment_id=all_users`,
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh] text-on-surface-variant font-body-md">
        Loading daily analytics...
      </div>
    );
  }

  return (
    <div className="p-xl max-w-[1400px] space-y-xl">
      {/* Header section (replaces previous components to match Stitch HTML) */}
      <header className="mb-xl flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight">
            Subaquatic Observatory
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-on-surface-variant opacity-70">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Engine: {metadata?.engine || "Initializing..."}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>Confidence: {metadata?.confidence || "Calculating..."}</span>
            <span className="hidden sm:inline">|</span>
            <LineageHUD
              telemetry={{
                source: "bq://mellow-dw.engine.subaquatic_observatory_v1",
                confidence: (metadata?.confidence === "Low" || metadata?.confidence === "Medium" ? metadata.confidence : "High"),
                engine: metadata?.engine || "Decision-Tracer-BQ-v1",
              }}
              align="left"
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex items-center gap-8 border-b border-surface-container-highest mb-xl px-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab("ripples")}
          className={`relative pb-4 font-label text-label transition-colors ${activeTab === "ripples" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          7-Day Ripples
          {activeTab === "ripples" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("flux")}
          className={`relative pb-4 font-label text-label transition-colors ${activeTab === "flux" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Channel Flux
          {activeTab === "flux" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("tides")}
          className={`relative pb-4 font-label text-label transition-colors ${activeTab === "tides" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Audience Tides
          {activeTab === "tides" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container rounded-t-full"></div>
          )}
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row gap-lg items-stretch min-h-[600px]">
        {activeTab === "ripples" && (
          <>
            {/* Left Column: 7-Day Ripples */}
            <section className="flex-1 card-professional flex flex-col">
              <header className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="font-h2 text-h2 text-on-surface">
                    7-Day Ripples
                  </h2>
                  <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                    Daily tactical metrics
                  </p>
                </div>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-label text-label rounded-full">
                  Recent
                </span>
              </header>

              <div className="flex-1 overflow-auto rounded-xl border border-surface-container-highest relative">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-container-highest bg-surface-container-low">
                      <th
                        onClick={() => handleDailySort("date")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Day{" "}
                        {dailySort.key === "date"
                          ? dailySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleDailySort("revenue")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Revenue{" "}
                        {dailySort.key === "revenue"
                          ? dailySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleDailySort("spend")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Spend{" "}
                        {dailySort.key === "spend"
                          ? dailySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleDailySort("roas")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        ROAS{" "}
                        {dailySort.key === "roas"
                          ? dailySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleDailySort("ctr")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        CTR{" "}
                        {dailySort.key === "ctr"
                          ? dailySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest font-data-lg text-data-lg text-on-surface">
                    {sortedDaily.map((row) => {
                      const isAnomaly = row.is_anomaly;

                      return (
                        <tr
                          key={row.date}
                          onClick={() =>
                            isAnomaly && onAnomalyClick(row.date, "roas")
                          }
                          className={`${isAnomaly ? "bg-tertiary-container/10 hover:bg-tertiary-container/20 cursor-pointer" : "hover:bg-surface-container"} transition-colors group relative overflow-hidden`}
                        >
                          <td
                            className={`py-5 px-6 whitespace-nowrap ${isAnomaly ? "font-medium text-tertiary flex items-center gap-2 anomaly-glow" : ""}`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                {isAnomaly && (
                                  <span className="material-symbols-outlined text-[18px]">
                                    warning
                                  </span>
                                )}
                                <span>
                                  {new Date(row.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="mt-1.5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <LineageHUD
                                  telemetry={{
                                    source: row.lineage?.source || `bq://mellow.dw.daily_nodes_${row.date}`,
                                    confidence: isAnomaly ? "Low" : "High",
                                    zScore: row.z_score,
                                    timestamp: row.lineage?.timestamp,
                                  }}
                                  compact
                                />
                                <span className="text-[10px] text-on-surface-variant opacity-60 truncate max-w-[120px]">
                                  {row.lineage?.source?.split("/").pop() || "daily_cvr"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "text-error" : ""}`}
                          >
                            {formatCurrency(row.revenue)}
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "text-error" : ""}`}
                          >
                            {formatCurrency(row.spend)}
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "font-data font-bold text-tertiary" : "font-data"}`}
                          >
                            {formatNumber(row.roas)}
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "text-error" : ""}`}
                          >
                            {formatPercentage(row.ctr)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right Column: 3-Month Sediment */}
            <section className="flex-1 card-professional flex flex-col">
              <header className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="font-h2 text-h2 text-on-surface">
                    3-Month Sediment
                  </h2>
                  <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                    Weekly aggregate stability
                  </p>
                </div>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-label text-label rounded-full">
                  Q3 View
                </span>
              </header>

              <div className="flex-1 overflow-auto rounded-xl border border-surface-container-highest relative">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-container-highest bg-surface-container-low">
                      <th
                        onClick={() => handleWeeklySort("week")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Week{" "}
                        {weeklySort.key === "week"
                          ? weeklySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleWeeklySort("avg_revenue")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Avg Revenue{" "}
                        {weeklySort.key === "avg_revenue"
                          ? weeklySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleWeeklySort("avg_spend")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Avg Spend{" "}
                        {weeklySort.key === "avg_spend"
                          ? weeklySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th
                        onClick={() => handleWeeklySort("net_roas")}
                        className="py-4 px-6 font-label text-label text-on-surface-variant text-right whitespace-nowrap cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        Net ROAS{" "}
                        {weeklySort.key === "net_roas"
                          ? weeklySort.dir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest font-data-lg text-data-lg text-on-surface">
                    {sortedWeekly.map((row) => {
                      const isAnomaly = row.is_anomaly;

                      return (
                        <tr
                          key={row.week}
                          onClick={() =>
                            isAnomaly && onAnomalyClick(row.week, "net_roas")
                          }
                          className={`${isAnomaly ? "bg-tertiary-container/10 hover:bg-tertiary-container/20 cursor-pointer" : "hover:bg-surface-container"} transition-colors group relative overflow-hidden`}
                        >
                          <td
                            className={`py-5 px-6 whitespace-nowrap text-sm font-data ${isAnomaly ? "font-medium text-tertiary flex items-center gap-2 anomaly-glow" : "text-on-surface-variant"}`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                {isAnomaly && (
                                  <span className="material-symbols-outlined text-[16px]">
                                    error
                                  </span>
                                )}
                                <span>{row.week}</span>
                              </div>
                              <span className="text-[10px] opacity-50">
                                {row.lineage?.source}
                              </span>
                            </div>
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "text-error" : ""}`}
                          >
                            {formatCurrency(row.avg_revenue)}
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "text-error" : ""}`}
                          >
                            {formatCurrency(row.avg_spend)}
                          </td>
                          <td
                            className={`py-5 px-6 text-right ${isAnomaly ? "font-bold text-error" : ""}`}
                          >
                            {formatNumber(row.net_roas)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "flux" && (
          <section className="flex-1 card-professional flex flex-col w-full">
            <header className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="font-h2 text-h2 text-on-surface">
                  Channel Flux
                </h2>
                <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                  Revenue Distribution by Channel
                </p>
              </div>
            </header>
            <div className="flex-1 w-full h-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelFluxData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-outline-variant)"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-outline)", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-outline)", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f4f4f1" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--color-primary-container)"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  >
                    {channelFluxData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "var(--color-primary)"
                            : "var(--color-primary-container)"
                        }
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
            <header className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="font-h2 text-h2 text-on-surface">
                  Audience Tides
                </h2>
                <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                  Daily User Activity Waves
                </p>
              </div>
            </header>
            <div className="flex-1 w-full h-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={audienceTidesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="colorReturning"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary-container)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary-container)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-outline-variant)"
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-outline)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-outline)", fontSize: 12 }}
                  />
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
