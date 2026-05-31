import React from "react";

export function DashboardPageLoading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        {/* Outer subtle ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#87a996]/20" />
        {/* Inner spinning active arc */}
        <div className="absolute inset-0 rounded-full border-4 border-[#456555] border-t-transparent animate-spin" />
      </div>
      <p className="text-[#6e7a73] font-medium text-body-md animate-pulse">
        Loading workspace...
      </p>
    </div>
  );
}
