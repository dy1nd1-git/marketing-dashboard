import React from "react";
import { PivotLogDashboard } from "./components/PivotLogDashboard";
import { KPICard } from "./components/KPICard";
import { SegmentSelector } from "@/src/components/dashboard/SegmentSelector";
import { DateRangePicker } from "@/src/components/dashboard/DateRangePicker";
import { ConversionFunnel } from "./components/ConversionFunnel";
import { AIInsightsCluster } from "./components/AIInsightsCluster";
import { ChannelPerformanceTable } from "./components/ChannelPerformanceTable";
import { fetchDashboardData, fetchPivotData } from "@/src/lib/api";

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

  console.log(
    `[Dashboard Debug] Fetching for dates: ${startDate} to ${endDate}`,
  );

  // Fetch real data from BigQuery (via API)
  const dashboardData = await fetchDashboardData(startDate, endDate);

  if (pivotId && isCompare) {
    const pivotData = await fetchPivotData(pivotId);
    return <PivotLogDashboard data={pivotData} showBadge={showBadge} />;
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
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/20 print:hidden mb-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">
              Home
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none shrink-0">
              Top
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide shrink-0">
              Overall
            </span>
          </div>
          <p className="text-body-md text-outline">
            Overview of total marketing performance and ROI insights.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto print:hidden">
          <DateRangePicker />
          <div className="h-8 w-px bg-outline-variant/20 hidden sm:block" />
          <SegmentSelector />
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
                icon:
                  kpi.trendIcon === "arrow_upward"
                    ? "trending_up"
                    : kpi.trendIcon === "arrow_downward"
                      ? "trending_down"
                      : "remove",
                colorClass: kpi.trendTextClass,
                bgColorClass: kpi.trendBgClass,
              }}
            />
          );
        })}
      </section>

      {/* Main Analytics Section (Funnel & AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xl">
        <ConversionFunnel funnel={dashboardData.funnel || []} />
        <AIInsightsCluster insights={dashboardData.insights || []} />
      </div>

      {/* Deep Dive Channel Table */}
      <ChannelPerformanceTable channels={dashboardData.channels || []} />
    </main>
  );
}
