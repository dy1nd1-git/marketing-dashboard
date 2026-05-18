import React, { useState, useEffect } from "react";
import { SlidePage } from "../../../../src/types/presentation";
import { InsightItem } from "../../../../src/context/InsightCartContext";

interface PresentationCanvasStageProps {
  deck: SlidePage[];
  activeSlideIndex: number;
  setActiveSlideIndex: (idx: number) => void;
  removeSlide: (e: React.MouseEvent, targetIdx: number) => void;
  activeSlide: SlidePage;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  updateNodeTitle: (nodeId: string, newTitle: string) => void;
  removeNodeFromActiveSlide: (nodeId: string) => void;
  renderNodeVisual: (
    item: InsightItem,
    isExporting?: boolean,
    height?: number,
  ) => React.ReactNode;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeHeight: (nodeId: string, height: number) => void;
  addSlide: () => void;
}

export const PresentationCanvasStage: React.FC<
  PresentationCanvasStageProps
> = ({
  deck,
  activeSlideIndex,
  setActiveSlideIndex,
  removeSlide,
  activeSlide,
  handleDragOver,
  handleDrop,
  updateNodeTitle,
  removeNodeFromActiveSlide,
  renderNodeVisual,
  selectedNodeId,
  setSelectedNodeId,
  updateNodeHeight,
  addSlide,
}) => {
  const [resizingNodeId, setResizingNodeId] = useState<string | null>(null);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleResizeStart = (
    e: React.MouseEvent,
    nodeId: string,
    currentHeight: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingNodeId(nodeId);
    setStartY(e.clientY);
    setStartHeight(currentHeight || 280);
    setSelectedNodeId(nodeId);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingNodeId) return;
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(120, startHeight + deltaY);
      updateNodeHeight(resizingNodeId, newHeight);
    };

    const handleMouseUp = () => {
      setResizingNodeId(null);
    };

    if (resizingNodeId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingNodeId, startY, startHeight, updateNodeHeight]);

  return (
    <section className="lg:col-span-8 flex flex-col bg-surface-container-lowest/40 border border-outline-variant/20 rounded-2xl p-3 sm:p-6 overflow-hidden relative order-1">
      {/* Deck Selector Controller Strip */}
      <div className="w-full flex items-center gap-2 pb-3 mb-2 border-b border-outline-variant/10 shrink-0">
        <button
          onClick={addSlide}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shrink-0 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add</span>
        </button>

        <div className="h-6 w-px bg-outline-variant/20 mx-1 shrink-0" />

        {/* Scrollable Slide List */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-label text-outline uppercase tracking-wider pl-1 shrink-0">
            Slides:
          </span>
          {deck.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-label cursor-pointer transition-all border shrink-0 ${
                idx === activeSlideIndex
                  ? "bg-primary text-on-primary border-primary font-bold shadow-xs scale-105"
                  : "bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container"
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="max-w-[80px] truncate">{slide.title}</span>
              {deck.length > 1 && (
                <button
                  onClick={(e) => removeSlide(e, idx)}
                  className="p-0.5 opacity-60 hover:opacity-100 rounded hover:bg-error/20 transition-opacity flex items-center justify-center"
                  aria-label="Delete slide"
                >
                  <span className="material-symbols-outlined text-[11px]">
                    close
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 16:9 Canvas Drop Target */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => setSelectedNodeId(null)}
        className={`w-full aspect-[16/9] min-h-[360px] max-h-[720px] rounded-xl transition-all flex flex-col p-6 relative overflow-y-auto border-2 border-dashed ${
          activeSlide.theme === "dark"
            ? "bg-[#1E1E1E] text-white border-stone-700"
            : activeSlide.theme === "mellow"
              ? "bg-[#F5F4EE] text-on-surface border-[#87A996]/40"
              : "bg-white text-on-surface border-outline-variant/40"
        } shadow-lg custom-scrollbar`}
      >
        {/* Absolute watermark indicator */}
        <div className="absolute right-4 bottom-4 pointer-events-none opacity-5">
          <span className="material-symbols-outlined text-8xl">co_present</span>
        </div>

        {/* Slide Master Header */}
        <div className="border-b border-outline-variant/10 pb-3 mb-4 flex flex-col gap-0.5 shrink-0">
          <h2
            className={`font-h1 text-xl sm:text-2xl font-bold tracking-tight ${
              activeSlide.theme === "dark" ? "text-white" : "text-on-surface"
            }`}
          >
            {activeSlide.title || "Untitled Presentation Horizon"}
          </h2>
          {activeSlide.subtitle && (
            <p
              className={`text-xs font-label ${
                activeSlide.theme === "dark" ? "text-stone-400" : "text-primary"
              }`}
            >
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        {/* Placed Nodes Grid */}
        <div className="flex-1 flex flex-col gap-6 content-start">
          {activeSlide.nodes.length === 0 ? (
            <div className="col-span-full h-full min-h-[120px] flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant/20 rounded-xl p-4">
              <span className="material-symbols-outlined text-3xl text-primary animate-bounce mb-1 opacity-60">
                input
              </span>
              <p className="text-xs font-label font-bold text-outline">
                Drop Insights Here
              </p>
            </div>
          ) : (
            activeSlide.nodes.map((node) => {
              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  className={`rounded-xl border relative group transition-all flex flex-col justify-between p-5 pb-8 ${
                    selectedNodeId === node.id
                      ? "ring-2 ring-primary border-primary shadow-lg bg-primary/5"
                      : activeSlide.theme === "dark"
                        ? "bg-stone-900 border-stone-800 text-stone-200"
                        : "bg-surface-container-lowest border-outline-variant/40 text-on-surface"
                  } hover:shadow-md`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className="material-symbols-outlined text-sm text-primary shrink-0">
                          {node.item.type === "table"
                            ? "table_chart"
                            : "analytics"}
                        </span>
                        <input
                          type="text"
                          value={node.item.title}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateNodeTitle(node.id, e.target.value)
                          }
                          className="font-label font-bold bg-transparent border-b border-transparent hover:border-outline-variant/40 focus:border-primary outline-none truncate w-full transition-colors text-base"
                          placeholder="Visual Title..."
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNodeFromActiveSlide(node.id);
                          if (selectedNodeId === node.id)
                            setSelectedNodeId(null);
                        }}
                        className="p-1 text-outline hover:text-error transition-colors rounded shrink-0 relative z-10"
                        aria-label="Remove node"
                      >
                        <span className="material-symbols-outlined text-xs sm:text-sm">
                          delete
                        </span>
                      </button>
                    </div>

                    {renderNodeVisual(node.item, false, node.height)}
                  </div>

                  {/* Manual Resize Handle */}
                  <div
                    onMouseDown={(e) =>
                      handleResizeStart(e, node.id, node.height || 280)
                    }
                    className={`absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex items-center justify-center group/handle transition-colors hover:bg-primary/10 rounded-b-xl ${
                      resizingNodeId === node.id ? "bg-primary/20" : ""
                    }`}
                  >
                    <div className="w-12 h-1 bg-outline-variant/30 rounded-full group-hover/handle:bg-primary/40" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Slide Master Footer */}
        {(activeSlide.executiveNotes || activeSlide.footerText) && (
          <div className="mt-auto pt-3 border-t border-outline-variant/10 flex items-center justify-between gap-1.5 shrink-0">
            <div className="flex items-start gap-1.5 flex-1">
              {activeSlide.executiveNotes && (
                <>
                  <span className="material-symbols-outlined text-xs text-secondary shrink-0 mt-0.5">
                    format_quote
                  </span>
                  <p className="text-[11px] font-body italic opacity-90 text-left leading-tight">
                    {activeSlide.executiveNotes}
                  </p>
                </>
              )}
            </div>
            {activeSlide.footerText && (
              <span className="text-[10px] font-mono opacity-40 whitespace-nowrap">
                {activeSlide.footerText}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
