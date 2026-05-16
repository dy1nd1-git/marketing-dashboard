"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useMarketingContext } from "../../context/MarketingContext";

interface Preset {
  label: string;
  days?: number;
  type?: "this_month" | "last_month";
}

const PRESETS: Preset[] = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
  { label: "This Month", type: "this_month" },
  { label: "Last Month", type: "last_month" },
];

/**
 * Sub-component for the popover content.
 * Uses the 'key' pattern to reset internal state when props change.
 */
const PopoverContent = ({ 
  startDate, 
  endDate, 
  onApply, 
  onCancel, 
  coords 
}: { 
  startDate: string, 
  endDate: string, 
  onApply: (start: string, end: string) => void, 
  onCancel: () => void,
  coords: { top: number, left: number }
}) => {
  // ⭕ Initialize state directly from props - no useEffect needed!
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const handlePreset = (preset: Preset) => {
    const end = new Date();
    const start = new Date();
    
    if (preset.days) {
      start.setDate(end.getDate() - preset.days);
    } else if (preset.type === "this_month") {
      start.setDate(1);
    } else if (preset.type === "last_month") {
      end.setDate(0);
      start.setMonth(end.getMonth());
      start.setDate(1);
    }

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    onApply(startStr, endStr);
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" key="calendar-portal-root">
      {/* Clickable Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-auto bg-black/5" 
        onClick={onCancel} 
      />
      
      <motion.div
        key="calendar-popover"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="absolute bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-3xl p-6 flex flex-col gap-6 pointer-events-auto"
        style={{
          top: coords.top + 12,
          left: Math.max(16, Math.min(coords.left, window.innerWidth - 360)),
          width: 340,
        }}
      >
        {/* Presets Grid */}
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className="px-4 py-2 text-xs font-label text-on-surface hover:bg-primary-container/10 rounded-xl text-left transition-colors cursor-pointer border border-surface-container/30"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="h-px bg-surface-container/50" />

        {/* Custom Range Inputs */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start-date" className="text-[10px] font-label uppercase tracking-widest text-outline px-1">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              className="w-full bg-surface-container/30 border border-surface-container/50 rounded-xl px-4 py-2 text-sm font-data focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="end-date" className="text-[10px] font-label uppercase tracking-widest text-outline px-1">End Date</label>
            <input
              id="end-date"
              type="date"
              value={tempEnd}
              onChange={(e) => setTempEnd(e.target.value)}
              className="w-full bg-surface-container/30 border border-surface-container/50 rounded-xl px-4 py-2 text-sm font-data focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-label text-outline hover:bg-surface-container/50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(tempStart, tempEnd)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-label bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all cursor-pointer"
          >
            Apply Range
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const DateRangePicker = () => {
  const { startDate, endDate, setDateRange, isPending } = useMarketingContext();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Avoid synchronous setState in effect for strict lint rules
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
      return () => {
        window.removeEventListener("resize", updateCoords);
        window.removeEventListener("scroll", updateCoords);
      };
    }
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) updateCoords();
    setIsOpen(!isOpen);
  };

  const formattedRange = `${startDate?.replace(/-/g, "/")} - ${endDate?.replace(/-/g, "/")}`;

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <button
        onClick={toggleOpen}
        disabled={isPending}
        className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-surface border border-surface-container shadow-sm hover:border-primary-container/40 transition-all cursor-pointer group ${isPending ? "opacity-60 cursor-wait" : ""}`}
      >
        <span className="material-symbols-outlined text-primary text-[22px] group-hover:scale-110 transition-transform pointer-events-none">
          calendar_today
        </span>
        <div className="flex flex-col items-start pointer-events-none min-w-[140px]">
          <span className="text-[9px] font-label uppercase tracking-[0.15em] text-outline leading-none mb-1">
            Date Range
          </span>
          <span className="text-[13px] font-semibold text-on-surface whitespace-nowrap leading-none tracking-tight">
            {formattedRange}
          </span>
        </div>
        <span className={`material-symbols-outlined text-outline/60 text-[20px] transition-transform duration-300 pointer-events-none ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <PopoverContent 
              key={`${startDate}-${endDate}`} // ⭕ Best Practice: Reset on date change
              startDate={startDate}
              endDate={endDate}
              coords={coords}
              onApply={(start, end) => {
                setDateRange(start, end);
                setIsOpen(false);
              }}
              onCancel={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
