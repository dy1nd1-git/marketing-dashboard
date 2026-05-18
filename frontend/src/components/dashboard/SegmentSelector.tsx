"use client";

import React from "react";
import { useMarketingContext } from "../../context/MarketingContext";

export const SegmentSelector = () => {
  const { segment, setSegment, isPending } = useMarketingContext();

  const segments = ["Overall", "Paid Social", "Organic Search"];

  return (
    <div className="flex gap-2 items-center">
      {segments.map((s) => {
        const isActive = segment === s;
        return (
          <button
            key={s}
            onClick={() => setSegment(s)}
            disabled={isPending}
            className={`px-md py-1.5 rounded-full text-label cursor-pointer transition-all duration-300 ${
              isActive
                ? "bg-primary-container text-white shadow-sm"
                : "bg-surface-container text-outline hover:bg-secondary-container/15 hover:text-secondary"
            } ${isPending ? "opacity-60 cursor-wait" : ""}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};
