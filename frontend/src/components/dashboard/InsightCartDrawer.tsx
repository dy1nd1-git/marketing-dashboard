"use client";

import React, { useState } from "react";
import { useInsightCart, InsightItem } from "../../context/InsightCartContext";

export const InsightCartDrawer: React.FC = () => {
  const { items, removeInsight, clearCart } = useInsightCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, item: InsightItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      {/* Floating Cart Trigger Badge Button */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Insight Cart"
          className="flex items-center gap-2 px-4 py-3 bg-surface text-on-surface rounded-full shadow-2xl border border-outline-variant/30 hover:border-outline-variant transition-all cursor-pointer group"
        >
          <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">
            shopping_cart
          </span>
          <span className="font-label text-xs font-bold tracking-wide">
            Insights
          </span>
          {items.length > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-primary text-on-primary rounded-full text-[11px] font-bold flex items-center justify-center animate-scale-in">
              {items.length}
            </span>
          )}
        </button>
      </div>

      {/* Slide-in Cart Drawer Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-surface border-l border-outline-variant/20 shadow-2xl z-50 transition-transform duration-300 flex flex-col print:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              shopping_cart
            </span>
            <h3 className="font-label text-sm font-bold text-on-surface">
              Insight Cart Palette
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                aria-label="Clear all insights"
                className="p-1.5 text-outline hover:text-error rounded-md hover:bg-error-container/10 transition-colors cursor-pointer text-xs font-label flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  delete_sweep
                </span>
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close cart drawer"
              className="p-1 text-outline hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Drawer Content / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-outline/60 px-4">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-40">
                inbox
              </span>
              <p className="text-xs font-body">
                Cart is empty. Stock important metrics and charts from the dashboard to build your presentation slides.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      {item.type === "chart"
                        ? "show_chart"
                        : item.type === "kpi"
                        ? "query_stats"
                        : item.type === "funnel"
                        ? "filter_alt"
                        : "priority_high"}
                    </span>
                    <h4 className="font-label text-xs font-bold text-on-surface line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => removeInsight(item.id)}
                    aria-label="Remove item"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-outline hover:text-error rounded transition-opacity cursor-pointer absolute top-2 right-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      close
                    </span>
                  </button>
                </div>

                <p className="font-mono text-[10px] text-primary font-semibold mb-1.5">
                  {item.metricsSummary}
                </p>

                {item.notes && (
                  <p className="font-body text-[11px] text-on-surface-variant bg-surface-container/30 p-1.5 rounded text-left border-l-2 border-primary/40 line-clamp-2 mb-1.5">
                    {item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between text-[9px] text-outline pt-1 border-t border-outline-variant/10">
                  <span className="font-mono truncate max-w-[180px]">
                    {item.sourceRef}
                  </span>
                  <span>
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Quick Link */}
        <div className="p-3 border-t border-outline-variant/10 bg-surface-container-lowest flex flex-col gap-2">
          <p className="text-[10px] text-outline text-center">
            💡 Drag cards into the Slide Deck Canvas to construct your presentation.
          </p>
        </div>
      </div>
    </>
  );
};
