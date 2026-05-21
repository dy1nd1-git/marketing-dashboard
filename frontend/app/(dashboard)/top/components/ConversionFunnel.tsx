import React from "react";
import { StockInsightButton } from "@/src/components/dashboard/StockInsightButton";
import { FunnelStep } from "@/src/types/marketing";

interface ConversionFunnelProps {
  funnel: FunnelStep[];
}

export function ConversionFunnel({ funnel }: ConversionFunnelProps) {
  return (
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
        {(funnel || []).map((step, index) => (
          <div key={step.label} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-on-surface">
                {step.label} ({step.subLabel})
              </span>
              <div className="flex items-center gap-3">
                {step.dropOff && (
                  <div className="flex items-center text-secondary font-data-sm">
                    <span className="material-symbols-outlined text-sm mr-0.5">
                      arrow_drop_down
                    </span>
                    {step.dropOff}%
                  </div>
                )}
                <span className="font-data-sm text-outline">
                  {step.value} Users
                </span>
              </div>
            </div>
            <div className="h-10 w-full bg-[#f5f4ee] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full flex items-center px-4 transition-all duration-1000 ease-out"
                style={{
                  width: `${step.percentage}%`,
                  opacity: 1 - index * 0.2,
                }}
              >
                <span className="text-[10px] text-white font-bold tracking-tighter">
                  {step.percentage}% {step.subLabel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
