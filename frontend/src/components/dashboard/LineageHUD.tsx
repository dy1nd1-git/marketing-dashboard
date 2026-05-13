import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LineageTelemetry } from "../../types/marketing";

interface LineageHUDProps {
  telemetry: LineageTelemetry;
  compact?: boolean;
}

export const LineageHUD: React.FC<LineageHUDProps> = ({
  telemetry,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    align: "left" | "right";
    showAbove: boolean;
  }>({ top: 0, left: 0, align: "left", showAbove: false });

  useEffect(() => {
    // Next.js (SSR) 環境で createPortal を安全に利用するためのマウント判定
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const toggleOpen = () => {
    if (!isOpen) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isRightHalf = rect.left > window.innerWidth / 2;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        // 下部のスペースが狭く、上部の方が広い場合は上側に展開する
        const showAbove = spaceBelow < 320 && spaceAbove > spaceBelow;

        setCoords({
          top: showAbove ? rect.top - 8 : rect.bottom + 8,
          left: isRightHalf ? rect.right : rect.left,
          align: isRightHalf ? "right" : "left",
          showAbove,
        });
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle outside click and scroll to close popover safely
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideContainer =
        containerRef.current && !containerRef.current.contains(target);
      const isOutsidePopover =
        popoverRef.current && !popoverRef.current.contains(target);

      if (isOutsideContainer && isOutsidePopover) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as Node;
      // ポップオーバー内部のスクロール操作であれば閉じない
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2" ref={containerRef}>
      {/* Confidence Indicator Badge Trigger */}
      <button
        onClick={toggleOpen}
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

      {/* Popover HUD Overlay converted to a precise floating popover */}
      {mounted && isOpen && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-[100] animate-fade-in"
          style={{
            top: coords.showAbove ? undefined : `${coords.top}px`,
            bottom: coords.showAbove ? `${window.innerHeight - coords.top}px` : undefined,
            left: coords.align === "left" ? `${coords.left}px` : undefined,
            right: coords.align === "right" ? `${window.innerWidth - coords.left}px` : undefined,
          }}
          role="dialog"
          aria-modal="false"
          aria-label="Lineage Provenance Detail"
        >
          <div className="w-80 sm:w-96 bg-white dark:bg-[#1E1F25] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xl text-left transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-xs tracking-tight">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  policy
                </span>
                <span>Lineage Audit HUD</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close HUD"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-2.5 font-body">
              {/* Source Origin Path */}
              <div>
                <span className="text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase block mb-0.5">
                  Canonical Source Path
                </span>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all shadow-2xs">
                  {telemetry.source}
                </div>
              </div>

              {/* Downstream Engine & Status Fields */}
              <div className="space-y-1.5 pt-0.5">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase shrink-0">
                    Evaluation Engine
                  </span>
                  <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                    {telemetry.engine || "Decision-Tracer-BQ-v1"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase shrink-0">
                    Variance Threshold
                  </span>
                  <span className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    {telemetry.zScore !== undefined
                      ? `Z-Score: ${telemetry.zScore}`
                      : "Calibrated"}
                  </span>
                </div>
              </div>

              {/* Status Feedback Subtext */}
              <div className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                telemetry.confidence === "High"
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                  : telemetry.confidence === "Medium"
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
                  : "bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.indicator}`} />
                  <span>{currentTheme.label}</span>
                </div>
                <p className="leading-relaxed opacity-95 text-[10px]">
                  {telemetry.confidence === "High"
                    ? "Telemetry verified upstream via automated schema validation tests."
                    : telemetry.confidence === "Medium"
                      ? "Intermittent anomalies detected; automated statistical fallbacks successfully invoked."
                      : "Attention: Source table schema out of threshold bounds. Using offline dynamic mocks."}
                </p>
              </div>

              {/* Sync Timestamp Info */}
              <div className="flex items-center justify-between pt-1.5 text-[9px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                <span className="font-semibold uppercase tracking-wider">
                  Status Verification Sync
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
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
