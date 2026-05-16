import React from "react";
import { PivotLogDashboard } from "./components/PivotLogDashboard";
import { KPICard } from "./components/KPICard";
import { SegmentSelector } from "../../../src/components/dashboard/SegmentSelector";
import { StockInsightButton } from "../../../src/components/dashboard/StockInsightButton";
import { DateRangePicker } from "../../../src/components/dashboard/DateRangePicker";
import { ROASMatrix } from "./components/ROASMatrix";
import { fetchDashboardData } from "../../../src/lib/api";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pivotId = params.pivot as string | undefined;
  const isCompare = params.compare === "true";
  const showBadge = params.badge === "show";

  const startDate = params.start_date as string | undefined;
  const endDate = params.end_date as string | undefined;

  console.log(`[Dashboard Debug] Fetching for dates: ${startDate} to ${endDate}`);

  // Fetch real data from BigQuery (via API)
  const dashboardData = await fetchDashboardData(startDate, endDate);

  if (pivotId && isCompare) {
    return <PivotLogDashboard pivotId={pivotId} showBadge={showBadge} />;
  }

  // Base styles for KPIs (to be merged with dynamic data)
  const kpiStyles = [
    {
      icon: "payments",
      iconColorClass: "text-primary-container",
      iconBgColorClass: "bg-primary-container/10",
      label: "Total Revenue",
      chartBarClass: "bg-primary-container",
      chartGradientClass: "from-primary-container/5",
      chartData: [40, 60, 45, 80, 55, 95, 70],
    },
    {
      icon: "shopping_bag",
      iconColorClass: "text-tertiary",
      iconBgColorClass: "bg-tertiary/10",
      label: "Total Spend",
      chartBarClass: "bg-tertiary",
      chartGradientClass: "from-tertiary/5",
      chartData: [80, 70, 75, 40, 35, 25, 30],
    },
    {
      icon: "insights",
      iconColorClass: "text-primary",
      iconBgColorClass: "bg-primary/10",
      label: "Average ROAS",
      chartBarClass: "bg-primary",
      chartGradientClass: "from-primary/5",
      chartData: [30, 40, 50, 60, 70, 85, 90],
    },
    {
      icon: "shopping_cart",
      iconColorClass: "text-on-tertiary-container",
      iconBgColorClass: "bg-tertiary-container/20",
      label: "Conversions",
      chartBarClass: "bg-tertiary-container",
      chartGradientClass: "from-tertiary-container/10",
      chartData: [45, 55, 40, 65, 50, 80, 70],
    },
  ];

  return (
    <main className="p-xl max-w-[1400px]">
      {/* Header & Breadcrumbs Section */}
      <section className="mb-xl">
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-end">
            <h2 className="font-h1 text-h1 text-on-surface">Exploration</h2>
            <div className="flex gap-4 items-center">
              <DateRangePicker />
              <div className="h-8 w-px bg-surface-container" />
              <SegmentSelector />
            </div>
          </div>
        </div>
      </section>

      {/* KPI Summary Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {dashboardData.kpis.map((kpi, idx) => {
          const style = kpiStyles[idx];
          return (
            <KPICard 
              key={idx} 
              {...style}
              value={kpi.value}
              trend={{
                label: kpi.trendValue,
                icon: kpi.trendIcon === "arrow_upward" ? "trending_up" : (kpi.trendIcon === "arrow_downward" ? "trending_down" : "remove"),
                colorClass: kpi.trendTextClass,
                bgColorClass: kpi.trendBgClass,
              }}
            />
          );
        })}
      </section>

      {/* Main Analytics Section (Funnel & AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xl">
        {/* Heatmap Funnel */}
        <section className="lg:col-span-7 card-professional">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 className="font-h2 text-xl text-on-surface">
                Mellow Conversion Funnel
              </h3>
              <p className="text-sm text-outline mt-1">
                Deep analysis of customer drop-off points
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StockInsightButton
                item={{
                  title: "Mellow Conversion Funnel",
                  type: "funnel",
                  metricsSummary: "1.2M -> 3.4K (2.7% CONV)",
                  sourceRef: "SELECT * FROM analytics_funnel_view",
                  notes:
                    "Significant drop-off between consideration and intent detected.",
                }}
                variant="minimal"
              />
              <button className="text-primary-container font-label flex items-center gap-2 hover:opacity-70 transition-opacity">
                View Detail{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-md">
            {dashboardData.funnel.map((step, index) => (
              <div key={step.label} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label text-on-surface">
                    {step.label} ({step.subLabel})
                  </span>
                  <span className="font-data-sm text-outline">{step.value} Users</span>
                </div>
                <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-container rounded-full flex items-center px-4 transition-all duration-1000 ease-out"
                    style={{ width: `${step.percentage}%`, opacity: 1 - (index * 0.2) }}
                  >
                    <span className="text-[10px] text-white font-bold tracking-tighter">
                      {step.percentage}% {step.subLabel.toUpperCase()}
                    </span>
                  </div>
                </div>
                {step.dropOff && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 flex items-center text-secondary font-data-sm">
                    <span className="material-symbols-outlined text-sm mr-1">
                      arrow_drop_down
                    </span>
                    {step.dropOff}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AI Strategic Insight Bento Cluster */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-md">
          {dashboardData.insights.map((insight, index) => (
            <div 
              key={insight.title} 
              className={`p-lg rounded-3xl shadow-[0_20px_30px_rgba(135,169,150,0.05)] relative group ${
                index === 0 ? "bg-white col-span-1" : "card-professional col-span-1 border-l-4 border-secondary/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`material-symbols-outlined ${index === 0 ? "text-primary-container" : "text-secondary"}`}>
                  {index === 0 ? "auto_awesome" : "lightbulb"}
                </span>
                <StockInsightButton
                  item={{
                    title: insight.title,
                    type: "general",
                    metricsSummary: insight.description,
                    sourceRef: "AI Heuristics Engine v2.1",
                    notes: insight.description,
                  }}
                  variant="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h4 className="font-label text-sm text-on-surface mb-2">
                {insight.title}
              </h4>
              <p className="text-xs text-outline leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
          
          <div className="card-professional col-span-2 text-white !bg-primary relative group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim">
                  psychology
                </span>
                <h4 className="font-label text-sm">Root Cause Analysis</h4>
              </div>
              <StockInsightButton
                item={{
                  title: "Root Cause: Cart Abandonment",
                  type: "anomaly",
                  metricsSummary: "Regional Shipping API Latency Spike",
                  sourceRef: "System Trace Diagnostics Log",
                  notes:
                    "Recommend a 'Free Express Shipping' voucher for affected segments.",
                }}
                variant="minimal"
                className="!text-white opacity-80 group-hover:opacity-100"
              />
            </div>
            <p className="text-sm font-body-md opacity-90">
              Cart abandonment spiked on Tuesday due to a regional shipping API
              latency. Recommend a &quot;Free Express Shipping&quot; voucher for
              affected segments.
            </p>
          </div>
        </section>
      </div>

      {/* Efficiency Matrix Heatmap */}
      <section className="mb-xl">
        <ROASMatrix data={dashboardData.matrix || []} />
      </section>

      {/* Deep Dive Channel Table */}
      <section className="card-professional !p-0 overflow-hidden">
        <div className="px-xl py-lg border-b border-stone-50 flex justify-between items-center">
          <h3 className="font-h2 text-xl text-on-surface">
            Channel Performance Deep Dive
          </h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-stone-100 hover:bg-stone-50">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>
            </button>
            <button className="p-2 rounded-xl border border-stone-100 hover:bg-stone-50">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                  Channel
                </th>
                <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                  Investment
                </th>
                <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                  Revenue
                </th>
                <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                  Efficiency
                </th>
                <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {dashboardData.channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-xl py-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                        <span className="font-label text-xs font-bold text-primary">{channel.icon}</span>
                      </div>
                      <div>
                        <p className="font-label text-sm text-on-surface">
                          {channel.name}
                        </p>
                        <p className="text-xs text-outline">{channel.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-xl py-lg font-data text-on-surface-variant">
                    ${channel.spend.toLocaleString()}
                  </td>
                  <td className="px-xl py-lg font-data text-on-surface-variant">
                    ${channel.revenue.toLocaleString()}
                  </td>
                  <td className="px-xl py-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-container transition-all duration-1000 ease-out" 
                          style={{ width: `${Math.min(channel.roas * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-data text-primary">{channel.roas.toFixed(2)}x</span>
                    </div>
                  </td>
                  <td className="px-xl py-lg text-right">
                    <button className="px-md py-2 bg-[#F5F4EE] text-primary-container rounded-full text-xs font-label hover:bg-primary-container hover:text-white transition-all duration-300">
                      Deep Dive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAB Action (Contextual) */}
      <button className="fixed bottom-10 right-10 z-50 bg-primary-container text-white p-5 rounded-full shadow-2xl shadow-primary-container/40 soft-pulse flex items-center gap-3">
        <span className="material-symbols-outlined">smart_toy</span>
        <span className="font-label">Ask Strategist</span>
      </button>
    </main>
  );
}
