
import { HeroTitle } from "../../src/components/dashboard/HeroTitle";
import { KPICard } from "../../src/components/dashboard/KPICard";
import { AcquisitionFunnel } from "../../src/components/dashboard/AcquisitionFunnel";
import { StrategicInsights } from "../../src/components/dashboard/StrategicInsights";
import { ChannelPerformanceTable } from "../../src/components/dashboard/ChannelPerformanceTable";
import { FloatingActionInsight } from "../../src/components/dashboard/FloatingActionInsight";
import { fetchDashboardData } from "../../src/lib/api";

export default async function Home() {
  const data = await fetchDashboardData();

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <HeroTitle />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.kpis.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              trendIcon={kpi.trendIcon}
              trendValue={kpi.trendValue}
              trendBgClass={kpi.trendBgClass}
              trendTextClass={kpi.trendTextClass}
              barClasses={kpi.barClasses}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <AcquisitionFunnel data={data.funnel} />
          </div>
          <div className="lg:col-span-5">
            <StrategicInsights data={data.insights} />
          </div>
        </div>
        <ChannelPerformanceTable data={data.channels} />
      </div>
      <FloatingActionInsight data={data.liveInsight} />
    </>
  );
}
