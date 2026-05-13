import React, { useState, useRef, useEffect } from "react";
import { LineageTelemetry } from "../../types/marketing";

interface LineageHUDProps {
  telemetry: LineageTelemetry;
  align?: "left" | "right";
  compact?: boolean;
}

export const LineageHUD: React.FC<LineageHUDProps> = ({
  telemetry,
  align = "right",
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const currentTheme = confidenceColors[telemetry.confidence] || confidenceColors.High;

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
        <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.indicator}`} />
        {!compact && <span>{telemetry.confidence}</span>}
        <span className="material-symbols-outlined text-[12px] opacity-80">
          account_tree
        </span>
      </button>

      {/* Popover HUD Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Lineage Provenance Detail"
          className={`absolute bottom-full mb-2 ${
            align === "left" ? "left-0" : "right-0"
          } w-80 bg-surface-container-high border border-surface-container-highest rounded-xl p-4 shadow-2xl z-50 animate-fade-in text-left`}
        >
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-2 mb-3">
            <div className="flex items-center gap-2 text-on-surface font-label text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">
                policy
              </span>
              <span>Telemetry Lineage HUD</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close HUD"
              className="text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>

          <div className="space-y-3 font-body text-xs">
            {/* Source Origin Path */}
            <div>
              <span className="text-on-surface-variant text-[10px] block uppercase font-label">
                Canonical Source Path
              </span>
              <span className="text-on-surface font-data text-xs block truncate bg-surface-container-highest/30 px-2 py-1 rounded mt-0.5 border border-surface-container-highest">
                {telemetry.source}
              </span>
            </div>

            {/* Downstream Engine & Status */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-on-surface-variant text-[10px] block uppercase font-label">
                  Evaluation Engine
                </span>
                <span className="text-on-surface font-medium block truncate mt-0.5">
                  {telemetry.engine || "Decision-Tracer-BQ-v1"}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant text-[10px] block uppercase font-label">
                  Variance Threshold
                </span>
                <span className="text-on-surface font-data block mt-0.5">
                  {telemetry.zScore !== undefined
                    ? `Z-Score: ${telemetry.zScore}`
                    : "Calibrated"}
                </span>
              </div>
            </div>

            {/* Status Feedback Subtext */}
            <div className="bg-surface-container-low p-2 rounded border border-surface-container-highest text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-1.5 mb-0.5 font-medium text-on-surface">
                <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.indicator}`} />
                <span>{currentTheme.label}</span>
              </div>
              <p className="leading-tight opacity-90">
                {telemetry.confidence === "High"
                  ? "Telemetry verified upstream via automated schema validation tests."
                  : telemetry.confidence === "Medium"
                  ? "Intermittent anomalies detected; automated statistical fallbacks successfully invoked."
                  : "Attention: Source table schema out of threshold bounds. Using offline dynamic mocks."}
              </p>
            </div>

            {/* Sync Timestamp Info */}
            <div className="text-[9px] text-on-surface-variant text-right pt-1 opacity-70">
              Generated: {telemetry.timestamp || new Date().toISOString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
