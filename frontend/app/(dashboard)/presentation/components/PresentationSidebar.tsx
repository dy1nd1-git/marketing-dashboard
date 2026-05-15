import React from "react";
import { SlidePage } from "./types";
import { InsightItem } from "../../../../src/context/InsightCartContext";

interface PresentationSidebarProps {
  activePanelTab: "palette" | "inspector";
  setActivePanelTab: (tab: "palette" | "inspector") => void;
  cartItems: InsightItem[];
  handleDragStartFromCart: (e: React.DragEvent, item: InsightItem) => void;
  activeSlide: SlidePage;
  updateActiveSlideField: (field: Partial<SlidePage>) => void;
  selectedNodeId: string | null;
  updateNodeHeight: (nodeId: string, height: number) => void;
}

export const PresentationSidebar: React.FC<PresentationSidebarProps> = ({
  activePanelTab,
  setActivePanelTab,
  cartItems,
  handleDragStartFromCart,
  activeSlide,
  updateActiveSlideField,
  selectedNodeId,
  updateNodeHeight,
}) => {
  return (
    <section className="lg:col-span-4 bg-surface border border-outline-variant/30 rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs gap-3 order-2">
      {/* Prominent Integrated Tab Control Strip */}
      <div className="flex bg-surface-container rounded-xl p-1 gap-1 shrink-0">
        <button
          onClick={() => setActivePanelTab("palette")}
          className={`flex-1 py-2 rounded-lg font-label text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activePanelTab === "palette"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-outline hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm">palette</span>
          <span>Stocked Palette ({cartItems.length})</span>
        </button>
        <button
          onClick={() => setActivePanelTab("inspector")}
          className={`flex-1 py-2 rounded-lg font-label text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activePanelTab === "inspector"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-outline hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>Slide Inspector</span>
        </button>
      </div>

      {/* Conditional Content Rendering based on Active Tab */}
      {activePanelTab === "palette" ? (
        <div className="flex-1 flex flex-col overflow-hidden gap-2">
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-outline/50 p-2">
                <span className="material-symbols-outlined text-3xl mb-1 opacity-30">
                  category
                </span>
                <p className="text-[11px] font-body">
                  No items in stock. Pin charts from daily analysis pages to fill this workspace.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStartFromCart(e, item)}
                  className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-primary/60 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing group relative"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-xs text-primary">
                      {item.type === "chart" ? "timeline" : "analytics"}
                    </span>
                    <h3 className="font-label text-xs font-bold text-on-surface truncate">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-mono text-[10px] text-secondary font-semibold truncate">
                    {item.metricsSummary}
                  </p>
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xs text-outline">
                      drag_indicator
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="text-[10px] text-outline text-center pt-2 border-t border-outline-variant/10 shrink-0">
            💡 Drag charts directly onto canvas
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-y-auto gap-3 pr-1">
          {/* Title Editor */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-[10px] text-outline font-bold uppercase">
              Slide Title
            </label>
            <input
              type="text"
              value={activeSlide.title}
              onChange={(e) => updateActiveSlideField({ title: e.target.value })}
              className="px-3 py-2 bg-surface-container rounded-lg text-xs font-label text-on-surface border border-outline-variant/20 focus:border-primary outline-none transition-colors"
              placeholder="e.g. Executive Summary"
            />
          </div>

          {/* Subtitle Editor */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-[10px] text-outline font-bold uppercase">
              Subtitle Context
            </label>
            <input
              type="text"
              value={activeSlide.subtitle || ""}
              onChange={(e) => updateActiveSlideField({ subtitle: e.target.value })}
              className="px-3 py-2 bg-surface-container rounded-lg text-xs font-label text-on-surface border border-outline-variant/20 focus:border-primary outline-none transition-colors"
              placeholder="Optional tactical timeframe label"
            />
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-[10px] text-outline font-bold uppercase">
              Visual Theme
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["light", "mellow", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateActiveSlideField({ theme: t })}
                  className={`py-2 rounded-md text-[11px] font-label capitalize border transition-all ${
                    activeSlide.theme === t
                      ? "bg-primary text-on-primary border-primary font-bold shadow-2xs"
                      : "bg-surface-container text-outline hover:text-on-surface border-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Executive Narrative / Speaker Notes Editor */}
          <div className="flex flex-col gap-1 flex-1 min-h-[100px]">
            <label className="font-label text-[10px] text-outline font-bold uppercase flex justify-between">
              <span>Executive Narrative</span>
              <span className="text-[9px] lowercase opacity-60">Speaker notes</span>
            </label>
            <textarea
              value={activeSlide.executiveNotes}
              onChange={(e) => updateActiveSlideField({ executiveNotes: e.target.value })}
              rows={4}
              className="p-2.5 bg-surface-container rounded-lg text-xs font-body text-on-surface border border-outline-variant/20 focus:border-primary outline-none transition-colors resize-none flex-1"
              placeholder="Summarize key architectural takeaways or target shifts displayed on this canvas..."
            />
          </div>

          {/* Selected Node Properties (Conditionally Rendered) */}
          {selectedNodeId && (
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 mt-4 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">
                  straighten
                </span>
                <h4 className="font-label font-bold text-xs text-primary uppercase tracking-wider">
                  Visual Proportions
                </h4>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] text-outline block uppercase font-mono mb-1">Height (px)</span>
                  <div className="font-mono text-sm font-bold text-primary">
                    {activeSlide.nodes.find(n => n.id === selectedNodeId)?.height || 280}px
                  </div>
                </div>
                <button
                  onClick={() => updateNodeHeight(selectedNodeId, 280)}
                  className="px-3 py-1.5 bg-surface-container rounded-lg text-[10px] font-bold text-outline hover:text-primary hover:bg-primary/10 transition-colors border border-outline-variant/30"
                >
                  Reset Default
                </button>
              </div>
              <p className="text-[9px] text-outline mt-3 italic px-1">
                Drag the handle at the bottom of the artifact on the canvas to resize manually.
              </p>
            </div>
          )}

          {/* Custom Footer Editor */}
          <div className="mt-4 pt-4 border-t border-outline-variant/10">
            <label className="text-[10px] font-mono text-outline uppercase font-bold mb-2 block">
              Custom Footer Text (Meta)
            </label>
            <input
              type="text"
              value={activeSlide.footerText || ""}
              onChange={(e) => updateActiveSlideField({ footerText: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 text-xs font-label focus:border-primary outline-none transition-colors"
              placeholder="e.g. 2026/05/15 | Internal Project"
            />
          </div>

          <div className="pt-2 border-t border-outline-variant/10 shrink-0">
            <div className="p-2.5 bg-secondary-container/20 rounded-xl border border-secondary/20 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-xs">info</span>
                <span className="text-[10px] font-bold font-label">
                  Local Persistence
                </span>
              </div>
              <p className="text-[10px] text-outline leading-tight">
                All layers sync instantly to secure browser memory. Refreshing does not discard configurations.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
