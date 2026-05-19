import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "../../../../src/hooks/useIsClient";
import { LineageTelemetry } from "../../../../src/types/marketing";

interface LineageHUDProps {
  telemetry: LineageTelemetry;
  compact?: boolean;
}

export const LineageHUD: React.FC<LineageHUDProps> = ({
  telemetry,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    align: "left" | "right";
    showAbove: boolean;
  }>({ top: 0, left: 0, align: "left", showAbove: false });

  const toggleOpen = () => {
    if (!isOpen) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isRightHalf = rect.left > window.innerWidth / 2;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const showAbove = spaceBelow < 200 && spaceAbove > spaceBelow;

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
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* Trigger Button: Ultra-light, highly transparent and discrete design */}
      <button
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-label="Query Origin Info. Click to inspect."
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-label text-[11px] text-on-surface-variant/60 hover:text-on-surface bg-transparent hover:bg-surface-container-lowest/50 transition-all cursor-pointer border border-outline-variant/30 hover:border-outline-variant/70"
      >
        <span className="material-symbols-outlined text-[13px] text-primary/70">
          database
        </span>
        {!compact && <span className="font-normal tracking-tight">Query Origin</span>}
      </button>

      {/* Popover HUD Overlay: Pure, unadorned source reference panel */}
      {isClient && isOpen && createPortal(
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
          aria-label="Query Origin Detail"
        >
          <div className="w-80 sm:w-96 bg-white dark:bg-[#1E1F25] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xl text-left transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-xs tracking-tight">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  database
                </span>
                <span>Query Origin Reference</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close panel"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-3 font-body">
              {/* Source Origin Path Only */}
              <div>
                <span className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Canonical Source Path
                </span>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all shadow-2xs font-bold">
                  {telemetry.source}
                </div>
              </div>

              {/* Sync Timestamp Info */}
              <div className="flex items-center justify-between pt-1 text-[9px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                <span className="font-semibold uppercase tracking-wider">
                  Verified Timestamp
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
