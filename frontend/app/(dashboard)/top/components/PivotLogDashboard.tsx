"use client";

import React from "react";
import { PivotDetails } from "../../../../src/types/marketing";
import { PivotChart } from "./PivotChart";

interface PivotLogDashboardProps {
  data: PivotDetails;
  showBadge: boolean;
}

export const PivotLogDashboard: React.FC<PivotLogDashboardProps> = ({
  data,
  showBadge,
}) => {
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#2F2F2F] text-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight mb-2">
              Decision Tracer{" "}
              <span className="font-semibold text-slate-400 ml-2">
                Pivot Log
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Analysis Mode: Comparing predictions vs actuals since{" "}
              <span className="font-mono text-slate-300">{data.pivotDate}</span>
            </p>
          </div>

          {/* Status Badge */}
          {showBadge && (
            <div>
              {data.status === "achieved" ? (
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#50C878] bg-[#50C878]/10 text-[#50C878] font-medium tracking-wide">
                  <span className="mr-2">✅</span> 達成
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-slate-400 bg-slate-400/10 text-slate-300 font-medium tracking-wide">
                  <span className="mr-2">⚠️</span> 乖離
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-[#242424] border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-300">
              Revenue Trajectory
            </h2>

            {/* Legend */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-slate-300 rounded-full"></div>
                <span className="text-slate-400">実績 (Actuals)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0 border-t-2 border-dashed border-[#50C878]"></div>
                <span className="text-slate-400">予測 (Predicted)</span>
              </div>
            </div>
          </div>

          <PivotChart data={data.timeline} details={data} />
        </div>
      </div>
    </div>
  );
};
