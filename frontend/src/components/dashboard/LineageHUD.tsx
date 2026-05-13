import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LineageTelemetry } from "../../types/marketing";

interface LineageHUDProps {
  telemetry: LineageTelemetry;
  align?: "left" | "right";
  compact?: boolean;
}

export const LineageHUD: React.FC<LineageHUDProps> = ({
  telemetry,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confidenceColors = {
    High: {
      badgeBg: "bg-emerald-400/10",
      badgeText: "text-emerald-400",
      indicator: "bg-emerald-400",
      label: "High Confidence",
    },
    Medium: {
      badgeBg: "bg-amber-400/10",
      badgeText: "text-amber-400",
      indicator: "bg-amber-400",
      label: "Moderate Variance",
    },
    Low: {
      badgeBg: "bg-rose-400/10",
      badgeText: "text-rose-400",
      indicator: "bg-rose-400",
      label: "Low Confidence / Attention Required",
    },
  };

  const currentTheme =
    confidenceColors[telemetry.confidence] || confidenceColors.High;

  // Handle outside click to close popover
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2" ref={containerRef}>
      {/* Confidence Indicator Badge Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-label={`Data Provenance Telemetry: ${currentTheme.label}. Click to inspect.`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label text-[11px] font-medium transition-all cursor-pointer border border-transparent hover:border-surface-container-highest ${currentTheme.badgeBg} ${currentTheme.badgeText}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${currentTheme.indicator}`}
        />
        {!compact && <span>{telemetry.confidence}</span>}
        <span className="material-symbols-outlined text-[12px] opacity-80">
          account_tree
        </span>
      </button>

      {/* Popover HUD Overlay converted to a portal-mounted Center Modal */}
      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Lineage Provenance Detail"
            className="w-full max-w-md bg-white dark:bg-[#1E1F25] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left transition-all transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  policy
                </span>
                <span>Telemetry Lineage Audit HUD</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close HUD"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-3 font-body">
              {/* Source Origin Path */}
              <div>
                <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Canonical Source Path
                </span>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all shadow-sm">
                  {telemetry.source}
                </div>
              </div>

              {/* Downstream Engine & Status Fields Stacked Flex Rows */}
              <div className="space-y-2 pt-1">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase shrink-0">
                    Evaluation Engine
                  </span>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {telemetry.engine || "Decision-Tracer-BQ-v1"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase shrink-0">
                    Variance Threshold
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    {telemetry.zScore !== undefined
                      ? `Z-Score: ${telemetry.zScore}`
                      : "Calibrated"}
                  </span>
                </div>
              </div>

              {/* Status Feedback Subtext */}
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                telemetry.confidence === "High"
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                  : telemetry.confidence === "Medium"
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
                  : "bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  <span className={`w-2 h-2 rounded-full ${currentTheme.indicator}`} />
                  <span>{currentTheme.label}</span>
                </div>
                <p className="leading-relaxed opacity-95 text-[11px]">
                  {telemetry.confidence === "High"
                    ? "Telemetry verified upstream via automated schema validation tests."
                    : telemetry.confidence === "Medium"
                      ? "Intermittent anomalies detected; automated statistical fallbacks successfully invoked."
                      : "Attention: Source table schema out of threshold bounds. Using offline dynamic mocks."}
                </p>
              </div>

              {/* Sync Timestamp Info */}
              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                <span className="font-semibold uppercase tracking-wider">
                  Status Verification Sync
                </span>
                <span className="font-mono font-medium text-slate-500 dark:text-slate-400">
                  {telemetry.timestamp || new Date().toISOString()}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
