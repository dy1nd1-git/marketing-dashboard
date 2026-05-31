"use client";

import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <div className="relative w-16 h-16">
        {/* Outer ring spinning clockwise */}
        <div className="absolute inset-0 rounded-full border-4 border-[#87a996]/20 border-t-[#456555] animate-spin" />
        {/* Inner ring spinning counter-clockwise */}
        <div className="absolute inset-2 rounded-full border-4 border-[#ffca98]/20 border-t-[#d4a373] animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
      </div>
      <p className="text-xs font-semibold tracking-widest text-[#727973] uppercase animate-pulse">
        Trace Route Context...
      </p>
    </div>
  );
}
