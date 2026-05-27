import React from "react";
import { StockInsightButton } from "@/src/components/dashboard/StockInsightButton";
import { DashboardInsight } from "@/src/types/marketing";

interface AIInsightsClusterProps {
  insights: DashboardInsight[];
}

export function AIInsightsCluster({ insights }: AIInsightsClusterProps) {
  return (
    <section className="lg:col-span-5 grid grid-cols-2 gap-md">
      {(insights || []).map((insight, index) => (
        <div
          key={insight.title}
          className={`p-lg rounded-3xl shadow-[0_20px_30px_rgba(135,169,150,0.05)] relative group ${
            index === 0
              ? "bg-white col-span-1"
              : "card-professional col-span-1 border-l-4 border-secondary/20"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`material-symbols-outlined ${index === 0 ? "text-primary-container" : "text-secondary"}`}
            >
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
  );
}
