import React from "react";
import Image from "next/image";
import { PivotLogDashboard } from "../../src/components/dashboard/PivotLogDashboard";
import { KPICard } from "../../src/components/dashboard/KPICard";
import { SegmentSelector } from "../../src/components/dashboard/SegmentSelector";

const kpiData = [
  {
    icon: "payments",
    iconColorClass: "text-primary-container",
    iconBgColorClass: "bg-primary-container/10",
    label: "Total Revenue",
    value: "$284,930",
    trend: {
      label: "12.5%",
      icon: "trending_up",
      colorClass: "text-primary-container", // Matches #87A996 in HTML
      bgColorClass: "bg-primary-container/10",
    },
    chartBarClass: "bg-primary-container",
    chartGradientClass: "from-primary-container/5",
    chartData: [40, 60, 45, 80, 55, 95, 70],
  },
  {
    icon: "shopping_bag",
    iconColorClass: "text-tertiary",
    iconBgColorClass: "bg-tertiary/10",
    label: "Total Spend",
    value: "$42,105",
    trend: {
      label: "2.1%",
      icon: "trending_down",
      colorClass: "text-tertiary",
      bgColorClass: "bg-tertiary/20",
    },
    chartBarClass: "bg-tertiary",
    chartGradientClass: "from-tertiary/5",
    chartData: [80, 70, 75, 40, 35, 25, 30],
  },
  {
    icon: "insights",
    iconColorClass: "text-primary",
    iconBgColorClass: "bg-primary/10",
    label: "Average ROAS",
    value: "6.77x",
    trend: {
      label: "Active",
      icon: "bolt",
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
    chartBarClass: "bg-primary",
    chartGradientClass: "from-primary/5",
    chartData: [30, 40, 50, 60, 70, 85, 90],
  },
  {
    icon: "shopping_cart",
    iconColorClass: "text-on-tertiary-container",
    iconBgColorClass: "bg-tertiary-container/20",
    label: "Conversions",
    value: "3,492",
    trend: {
      label: "412",
      icon: "add",
      colorClass: "text-on-tertiary-container",
      bgColorClass: "bg-tertiary-container/20",
    },
    chartBarClass: "bg-tertiary-container",
    chartGradientClass: "from-tertiary-container/10",
    chartData: [45, 55, 40, 65, 50, 80, 70],
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pivotId = params.pivot as string | undefined;
  const isCompare = params.compare === "true";
  const showBadge = params.badge === "show";

  if (pivotId && isCompare) {
    return <PivotLogDashboard pivotId={pivotId} showBadge={showBadge} />;
  }

  return (
    <main className="p-xl max-w-[1400px]">
      {/* Header & Breadcrumbs Section */}
      <section className="mb-xl">
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-end">
            <h2 className="font-h1 text-h1 text-on-surface">Exploration</h2>
            <div className="flex gap-2">
              <SegmentSelector />
            </div>
          </div>
        </div>
      </section>

      {/* KPI Summary Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {kpiData.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
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
            <button className="text-primary-container font-label flex items-center gap-2 hover:opacity-70 transition-opacity">
              View Detail{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="space-y-md">
            {/* Funnel Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label text-on-surface">
                  Awareness (Impressions)
                </span>
                <span className="font-data-sm text-outline">1.2M Users</span>
              </div>
              <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-full rounded-full flex items-center px-4">
                  <span className="text-[10px] text-white font-bold tracking-tighter">
                    100% BASELINE
                  </span>
                </div>
              </div>
            </div>

            {/* Funnel Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label text-on-surface">
                  Consideration (Clicks)
                </span>
                <span className="font-data-sm text-outline">840K Users</span>
              </div>
              <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
                <div className="h-full bg-primary-container/80 w-[70%] rounded-full flex items-center px-4">
                  <span className="text-[10px] text-white font-bold tracking-tighter">
                    70% RETENTION
                  </span>
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 flex items-center text-secondary font-data-sm">
                <span className="material-symbols-outlined text-sm mr-1">
                  arrow_drop_down
                </span>
                30%
              </div>
            </div>

            {/* Funnel Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label text-on-surface">
                  Intent (Add to Cart)
                </span>
                <span className="font-data-sm text-outline">125K Users</span>
              </div>
              <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
                <div className="h-full bg-primary-container/60 w-[45%] rounded-full flex items-center px-4">
                  <span className="text-[10px] text-white font-bold tracking-tighter">
                    45% OF CLICKS
                  </span>
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 flex items-center text-secondary font-data-sm">
                <span className="material-symbols-outlined text-sm mr-1">
                  arrow_drop_down
                </span>
                25%
              </div>
            </div>

            {/* Funnel Step 4 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label text-on-surface">
                  Purchase (Success)
                </span>
                <span className="font-data-sm text-outline">3.4K Users</span>
              </div>
              <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
                <div className="h-full bg-primary-container/40 w-[15%] rounded-full flex items-center px-4">
                  <span className="text-[10px] text-white font-bold tracking-tighter">
                    2.7% CONV.
                  </span>
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 flex items-center text-secondary font-data-sm">
                <span className="material-symbols-outlined text-sm mr-1">
                  arrow_drop_down
                </span>
                30%
              </div>
            </div>
          </div>
        </section>

        {/* AI Strategic Insight Bento Cluster */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-md">
          <div className="bg-white p-lg rounded-3xl shadow-[0_20px_30px_rgba(135,169,150,0.05)] col-span-1">
            <span className="material-symbols-outlined text-primary-container mb-2">
              auto_awesome
            </span>
            <h4 className="font-label text-sm text-on-surface mb-2">
              Top Success
            </h4>
            <p className="text-xs text-outline leading-relaxed">
              Paid social scaling increased ROAS by 14% this week.
            </p>
          </div>
          <div className="card-professional col-span-1 border-l-4 border-secondary/20">
            <span className="material-symbols-outlined text-secondary mb-2">
              lightbulb
            </span>
            <h4 className="font-label text-sm text-on-surface mb-2">
              Opportunity
            </h4>
            <p className="text-xs text-outline leading-relaxed">
              SMS retargeting shows 4x higher intent than email.
            </p>
          </div>
          <div className="card-professional col-span-2 text-white !bg-primary">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">
                psychology
              </span>
              <h4 className="font-label text-sm">Root Cause Analysis</h4>
            </div>
            <p className="text-sm font-body-md opacity-90">
              Cart abandonment spiked on Tuesday due to a regional shipping API
              latency. Recommend a &quot;Free Express Shipping&quot; voucher for
              affected segments.
            </p>
          </div>
        </section>
      </div>

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
              {/* Meta Ads Row */}
              <tr className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                      <Image
                        alt="Meta Ads"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt3m5lFNyrN4AviSKvR9A3l5N1h3dTt9NwpOrdjZOL4XhtCaaIp6QqwE93KUvPuKpovNAXaPbJS7Ixxum64Nswq4qBXVqpbHZKlYL0SCXNN--78dcr6qbj5fkbqF3pGpiGuad57frekiXOVCdAi_2APTLAGtdpqjZfglKaNCAktmMqbmBqaEeih_znagBNsKoWbFUgHbxGha55ijIbJF_HgHH8jNJRwO-V-PbMPuby2l2HhMIijPdgn7HFI2q9zw0S2FOwc8J-X6pJ"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-label text-sm text-on-surface">
                        Meta Ads
                      </p>
                      <p className="text-xs text-outline">Paid Social</p>
                    </div>
                  </div>
                </td>
                <td className="px-xl py-lg font-data text-on-surface-variant">
                  $24,300
                </td>
                <td className="px-xl py-lg font-data text-on-surface-variant">
                  $182,500
                </td>
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container w-[80%]"></div>
                    </div>
                    <span className="font-data text-primary">7.51x</span>
                  </div>
                </td>
                <td className="px-xl py-lg text-right">
                  <button className="px-md py-2 bg-[#F5F4EE] text-primary-container rounded-full text-xs font-label hover:bg-primary-container hover:text-white transition-all duration-300">
                    Deep Dive
                  </button>
                </td>
              </tr>
              {/* Google Search Row */}
              <tr className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                      <Image
                        alt="Google Search"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGJuutBxxvWq2_sRo5TRfutzBA2M0i9r4CkfZP3SKzcW66q1qlSdqQ_v0oaiuMOvWPQCODZTAjM_Ah9Rfhk5zmpv0k1lWK_SHkSNoQyQ-TJvM6sh04ImwpXCj2FTIxEtNRWcGPqtEl3mnTh79S9LgyQN-TnIeXOOQvZpGoePjRJUQiaJgMwYQiWACWPbjxOOa5RqwoVFZ__GXEgdJWq7O0_01fc2oKrwq-SZYJiKvaXaD9CAQNuClL2LOZ7RbGqNDpj9Ph6_6p4tjq"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-label text-sm text-on-surface">
                        Google Search
                      </p>
                      <p className="text-xs text-outline">PPC</p>
                    </div>
                  </div>
                </td>
                <td className="px-xl py-lg font-data-sm text-on-surface-variant">
                  $12,100
                </td>
                <td className="px-xl py-lg font-data-sm text-on-surface-variant">
                  $64,200
                </td>
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container/60 w-[55%]"></div>
                    </div>
                    <span className="font-data-sm text-primary">5.30x</span>
                  </div>
                </td>
                <td className="px-xl py-lg text-right">
                  <button className="px-md py-2 bg-[#F5F4EE] text-primary-container rounded-full text-xs font-label hover:bg-primary-container hover:text-white transition-all duration-300">
                    Deep Dive
                  </button>
                </td>
              </tr>
              {/* TikTok Row */}
              <tr className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                      <Image
                        alt="TikTok Spark"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoPj18iOrl-i2zmfsA9LCj8dFL7dmTWPHMWpXTRnNDiAmAidb9mXSxOl2G1jgCYEbPFBZyatzrArTfTWUv1r-j2Wvi13WfkH3l5KBBuzRF9yqHPqRwJJJZb63KOBU49s5CBaEfrrv8poQizvCZYQqCbLkSJ2PfPTYBfUdb0Ft5ReHDUo5RaiN53go6SvfYFLWFsJ2MkssCGhAE5548ySg7FsWRRTeuI7D0IJJmzuwekxwFceImCR5fehCCdn3bou-bsp4aFT5KVxFk"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-label text-sm text-on-surface">
                        TikTok Spark
                      </p>
                      <p className="text-xs text-outline">Social Commerce</p>
                    </div>
                  </div>
                </td>
                <td className="px-xl py-lg font-data-sm text-on-surface-variant">
                  $5,705
                </td>
                <td className="px-xl py-lg font-data-sm text-on-surface-variant">
                  $38,230
                </td>
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container/80 w-[75%]"></div>
                    </div>
                    <span className="font-data-sm text-primary">6.70x</span>
                  </div>
                </td>
                <td className="px-xl py-lg text-right">
                  <button className="px-md py-2 bg-[#F5F4EE] text-primary-container rounded-full text-xs font-label hover:bg-primary-container hover:text-white transition-all duration-300">
                    Deep Dive
                  </button>
                </td>
              </tr>
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
