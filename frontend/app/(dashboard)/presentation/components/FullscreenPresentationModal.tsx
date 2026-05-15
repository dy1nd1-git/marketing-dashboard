import React from "react";
import { SlidePage } from "./types";
import { InsightItem } from "../../../../src/context/InsightCartContext";

interface FullscreenPresentationModalProps {
  isFullscreenMode: boolean;
  setIsFullscreenMode: (val: boolean) => void;
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  deck: SlidePage[];
  renderNodeVisual: (item: InsightItem) => React.ReactNode;
}

export const FullscreenPresentationModal: React.FC<
  FullscreenPresentationModalProps
> = ({
  isFullscreenMode,
  setIsFullscreenMode,
  activeSlideIndex,
  setActiveSlideIndex,
  deck,
  renderNodeVisual,
}) => {
  if (!isFullscreenMode) return null;

  const activeSlide = deck[activeSlideIndex] || deck[0];

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300 select-none print:hidden">
      {/* Top Info Bar */}
      <header className="flex items-center justify-between text-outline shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">
            co_present
          </span>
          <span className="font-label text-xs tracking-wider uppercase font-bold text-on-surface">
            Mellow Live Horizon
          </span>
          <span className="text-[10px] bg-surface-container text-primary px-2 py-0.5 rounded-full border border-outline-variant/30 font-bold">
            Slide {activeSlideIndex + 1} of {deck.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-outline hidden sm:inline">
            Use{" "}
            <kbd className="px-1.5 py-0.5 bg-surface-container rounded text-on-surface border border-outline-variant/20 font-bold">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-surface-container rounded text-on-surface border border-outline-variant/20 font-bold">
              →
            </kbd>{" "}
            or Space to flip
          </span>
          <button
            onClick={() => setIsFullscreenMode(false)}
            className="p-2 bg-surface hover:bg-surface-container text-outline hover:text-on-surface rounded-full transition-all border border-outline-variant/30 shadow-xs cursor-pointer"
            aria-label="Exit full screen"
            title="Exit Present Mode (ESC)"
          >
            <span className="material-symbols-outlined text-base block">close</span>
          </button>
        </div>
      </header>

      {/* Master Display Stage centered horizontally and scaled perfectly */}
      <div className="flex-1 flex items-center justify-center my-4 relative max-w-[1400px] w-full mx-auto">
        {/* Left Flip Trigger */}
        <button
          onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={activeSlideIndex === 0}
          className="absolute left-0 z-10 p-3 sm:p-4 bg-surface hover:bg-surface-container text-on-surface rounded-full transition-all disabled:opacity-30 disabled:hover:bg-surface border border-outline-variant/30 shadow-md transform -translate-x-2 sm:-translate-x-6 cursor-pointer"
          aria-label="Previous slide"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl block">
            chevron_left
          </span>
        </button>

        {/* Inner Replicated Canvas Frame mirroring dynamic layout aesthetics faithfully */}
        <div
          className={`w-full aspect-[16/9] max-h-[75vh] border rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col overflow-y-auto relative transition-all ${
            activeSlide.theme === "dark"
              ? "bg-[#1E1E1E] text-white border-stone-700"
              : activeSlide.theme === "mellow"
              ? "bg-[#F5F4EE] text-on-surface border-[#87A996]/40"
              : "bg-white text-on-surface border-outline-variant/40"
          }`}
        >
          {/* Header block */}
          <div
            className={`border-b pb-4 mb-6 shrink-0 ${
              activeSlide.theme === "dark"
                ? "border-stone-800"
                : "border-outline-variant/10"
            }`}
          >
            <h1
              className={`font-h1 text-2xl sm:text-4xl font-bold tracking-tight ${
                activeSlide.theme === "dark" ? "text-white" : "text-on-surface"
              }`}
            >
              {activeSlide.title || "Untitled Presentation Horizon"}
            </h1>
            {activeSlide.subtitle && (
              <p
                className={`text-sm font-label mt-1 ${
                  activeSlide.theme === "dark"
                    ? "text-stone-400"
                    : "text-primary"
                }`}
              >
                {activeSlide.subtitle}
              </p>
            )}
          </div>

          {/* Placed Nodes Grid rendered with dynamic metrics fidelity */}
          <div className="flex-1 flex flex-col gap-8 content-start">
            {activeSlide.nodes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-outline font-label text-xs">
                No visual artifacts mounted on this layer.
              </div>
            ) : (
              activeSlide.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`border rounded-xl p-6 shadow-xs flex flex-col gap-3 ${
                    activeSlide.theme === "dark"
                      ? "bg-stone-900/90 border-stone-800 text-stone-200"
                      : "bg-surface-container-lowest border-outline-variant/40 text-on-surface"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 border-b pb-2 ${
                      activeSlide.theme === "dark"
                        ? "border-stone-800/40"
                        : "border-outline-variant/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm text-primary">
                      {node.item.type === "table" ? "table_chart" : "analytics"}
                    </span>
                    <span
                      className={`font-label font-bold text-lg ${
                        activeSlide.theme === "dark"
                          ? "text-stone-200"
                          : "text-on-surface"
                      }`}
                    >
                      {node.item.title}
                    </span>
                  </div>
                  {/* Fully faithful live layout reconstruction */}
                  {renderNodeVisual(node.item)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Flip Trigger */}
        <button
          onClick={() =>
            setActiveSlideIndex((prev) => Math.min(prev + 1, deck.length - 1))
          }
          disabled={activeSlideIndex === deck.length - 1}
          className="absolute right-0 z-10 p-3 sm:p-4 bg-surface hover:bg-surface-container text-on-surface rounded-full transition-all disabled:opacity-30 disabled:hover:bg-surface border border-outline-variant/30 shadow-md transform translate-x-2 sm:translate-x-6 cursor-pointer"
          aria-label="Next slide"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl block">
            chevron_right
          </span>
        </button>
      </div>

      {/* Prompter Speaker Notes footer bar */}
      <footer className="shrink-0 bg-surface border border-outline-variant/30 rounded-xl p-3 sm:p-4 shadow-xs flex items-start gap-2 sm:gap-3 max-w-[1200px] w-full mx-auto">
        <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5 block">
          record_voice_over
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-label font-bold uppercase tracking-wider text-outline block mb-0.5">
            Executive Narrative / Prompter Notes
          </span>
          <p className="text-xs font-body text-on-surface italic leading-relaxed truncate sm:whitespace-normal">
            {activeSlide.executiveNotes ||
              "No speaker note narrative configured for this layer."}
          </p>
        </div>
      </footer>
    </div>
  );
};
