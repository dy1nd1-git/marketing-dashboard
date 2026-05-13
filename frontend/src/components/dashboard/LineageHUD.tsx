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

      {/* Popover HUD Overlay converted to a Clip-Proof Center Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Lineage Provenance Detail"
            className="w-full max-w-md bg-surface-container-high border border-surface-container-highest rounded-2xl p-6 shadow-2xl text-left transition-all transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3 mb-4">
              <div className="flex items-center gap-2 text-on-surface font-label text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  policy
                </span>
                <span>Telemetry Lineage Audit HUD</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close HUD"
                className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-full hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-4 font-body text-xs">
              {/* Source Origin Path */}
              <div>
                <span className="text-on-surface-variant text-[10px] block uppercase font-label tracking-wider">
                  Canonical Source Path
                </span>
                <div className="bg-surface-container-highest/30 p-2.5 rounded-lg mt-1 border border-surface-container-highest font-data text-xs text-on-surface break-all select-all">
                  {telemetry.source}
                </div>
              </div>

              {/* Downstream Engine & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container-highest/50">
                  <span className="text-on-surface-variant text-[10px] block uppercase font-label tracking-wider">
                    Evaluation Engine
                  </span>
                  <span className="text-on-surface font-medium block truncate mt-0.5 text-sm">
                    {telemetry.engine || "Decision-Tracer-BQ-v1"}
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container-highest/50">
                  <span className="text-on-surface-variant text-[10px] block uppercase font-label tracking-wider">
                    Variance Threshold
                  </span>
                  <span className="text-on-surface font-data block mt-0.5 text-sm">
                    {telemetry.zScore !== undefined
                      ? `Z-Score: ${telemetry.zScore}`
                      : "Calibrated"}
                  </span>
                </div>
              </div>

              {/* Status Feedback Subtext */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-highest text-xs text-on-surface-variant space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-on-surface">
                  <span className={`w-2 h-2 rounded-full ${currentTheme.indicator}`} />
                  <span>{currentTheme.label}</span>
                </div>
                <p className="leading-relaxed opacity-90 text-[11px]">
                  {telemetry.confidence === "High"
                    ? "Telemetry verified upstream via automated schema validation tests."
                    : telemetry.confidence === "Medium"
                    ? "Intermittent anomalies detected; automated statistical fallbacks successfully invoked."
                    : "Attention: Source table schema out of threshold bounds. Using offline dynamic mocks."}
                </p>
              </div>

              {/* Sync Timestamp Info */}
              <div className="flex items-center justify-between pt-2 text-[10px] text-on-surface-variant border-t border-surface-container-highest/40">
                <span className="opacity-60 font-label">Status Verification Sync</span>
                <span className="font-data opacity-80">
                  {telemetry.timestamp || new Date().toISOString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
