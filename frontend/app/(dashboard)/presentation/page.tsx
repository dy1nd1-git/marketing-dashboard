"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  useInsightCart,
  InsightItem,
} from "../../../src/context/InsightCartContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { SlideNode, SlidePage } from "../../../src/types/presentation";
import { PresentationSidebar } from "./components/PresentationSidebar";
import { FullscreenPresentationModal } from "./components/FullscreenPresentationModal";
import { ExportGuidanceModal } from "./components/ExportGuidanceModal";
import { PrintDeckEngine } from "./components/PrintDeckEngine";
import { PresentationCanvasStage } from "./components/PresentationCanvasStage";
import { generateAiPrompt } from "./utils/promptGenerator";

// Sparklines mockup telemetry bounds enabling rich graphical visual feedback
const mockTrendData = [
  { p: "D1", v: 12 },
  { p: "D2", v: 19 },
  { p: "D3", v: 15 },
  { p: "D4", v: 22 },
  { p: "D5", v: 28 },
  { p: "D6", v: 25 },
  { p: "D7", v: 35 },
];

const mockFunnelData = [
  { name: "Imp", val: 100 },
  { name: "Click", val: 70 },
  { name: "Cart", val: 45 },
  { name: "Buy", val: 15 },
];

function PresentationDeckEngine() {
  const { items: cartItems } = useInsightCart();

  // Master deck initialization using Lazy Initial State to reconstruct deck from localStorage
  const [deck, setDeck] = useState<SlidePage[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("mellow_slide_deck");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Ignored gracefully
    }
    return [
      {
        id: "slide_initial",
        title: "Mellow Marketing ROI Review",
        subtitle: "Q1 Campaign Performance Strategic Horizons",
        theme: "light",
        nodes: [],
        executiveNotes:
          "Overall spend efficiency remained highly robust through strategic pivot reallocations.",
      },
    ];
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activePanelTab, setActivePanelTab] = useState<"palette" | "inspector">(
    "palette",
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen slideshow keyboard controller hooks supporting arrow flips and direct escape closures
  useEffect(() => {
    if (!isFullscreenMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setActiveSlideIndex((prev) => Math.min(prev + 1, deck.length - 1));
      } else if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setIsFullscreenMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenMode, deck.length]);

  const saveDeck = (newDeck: SlidePage[]) => {
    setDeck(newDeck);
    try {
      localStorage.setItem("mellow_slide_deck", JSON.stringify(newDeck));
    } catch {
      // Ignored gracefully
    }
  };

  // --- Spreadsheet Export (CSV) ---
  const exportToCsv = () => {
    try {
      // 1. Prepare Headers
      const headers = [
        "Slide Index",
        "Slide Title",
        "Artifact Title",
        "Type",
        "Metrics Summary",
        "Executive Notes",
      ];

      // 2. Map Data
      const rows = deck.flatMap((slide, sIdx) =>
        slide.nodes.map((node) => [
          sIdx + 1,
          `"${(slide.title || "Untitled Slide").replace(/"/g, '""')}"`,
          `"${node.item.title.replace(/"/g, '""')}"`,
          node.item.type,
          `"${(node.item.metricsSummary || "").replace(/"/g, '""')}"`,
          `"${(slide.executiveNotes || "").replace(/"/g, '""')}"`,
        ]),
      );

      // 3. Construct CSV String
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // 4. Trigger Download with BOM for Excel UTF-8 support
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `mellow_presentation_data_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV Export Failed:", error);
    }
  };

  // --- AI Analysis Orchestration (Phase 1: Data-Centric Reconstruction Prompt) ---
  const copyAiPrompt = () => {
    try {
      const prompt = generateAiPrompt(deck);
      navigator.clipboard.writeText(prompt);
      alert(`Data Blueprint (${deck.length} slides) copied!`);
    } catch (error) {
      console.error("Prompt Generation Failed:", error);
    }
  };

  const activeSlide = deck[activeSlideIndex] || deck[0];

  // HTML5 Native Drag and Drop dropzone mapping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;

      const droppedItem: InsightItem = JSON.parse(dataStr);

      // Prevent identical item insertion on the current targeted layer
      if (activeSlide.nodes.some((n) => n.item.id === droppedItem.id)) {
        return;
      }

      const newNode: SlideNode = {
        id: crypto.randomUUID(),
        item: { ...droppedItem },
        position: { x: 0, y: 0 },
        height: 400,
      };

      const updatedDeck = deck.map((slide, idx) => {
        if (idx === activeSlideIndex) {
          return {
            ...slide,
            nodes: [...slide.nodes, newNode],
          };
        }
        return slide;
      });

      saveDeck(updatedDeck);
    } catch {
      // Ignored gracefully
    }
  };

  const handleDragStartFromCart = (e: React.DragEvent, item: InsightItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Slide Deck navigation mutators
  const addSlide = () => {
    const newSlide: SlidePage = {
      id: `slide_${Date.now()}`,
      title: `Strategic Focus Area ${deck.length + 1}`,
      subtitle: "Tactical Execution Timeline",
      theme: "light",
      nodes: [],
      executiveNotes:
        "Provide contextual narrative supporting metric variance.",
      footerText: `ROI Analysis | ${new Date().toLocaleDateString()}`,
    };
    saveDeck([...deck, newSlide]);
    setActiveSlideIndex(deck.length);
  };

  const removeSlide = (e: React.MouseEvent, targetIdx: number) => {
    e.stopPropagation();
    if (deck.length <= 1) return; // Retain baseline parent frame

    const updated = deck.filter((_, idx) => idx !== targetIdx);
    saveDeck(updated);
    setActiveSlideIndex(Math.min(activeSlideIndex, updated.length - 1));
  };

  const updateActiveSlideField = (field: Partial<SlidePage>) => {
    const updatedDeck = deck.map((slide, idx) => {
      if (idx === activeSlideIndex) {
        return { ...slide, ...field };
      }
      return slide;
    });
    saveDeck(updatedDeck);
  };

  const removeNodeFromActiveSlide = (nodeId: string) => {
    const updatedDeck = deck.map((slide, idx) => {
      if (idx === activeSlideIndex) {
        return {
          ...slide,
          nodes: slide.nodes.filter((n) => n.id !== nodeId),
        };
      }
      return slide;
    });
    saveDeck(updatedDeck);
  };

  const updateNodeTitle = (nodeId: string, newTitle: string) => {
    const updatedDeck = deck.map((slide, idx) => {
      if (idx === activeSlideIndex) {
        return {
          ...slide,
          nodes: slide.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, item: { ...node.item, title: newTitle } }
              : node,
          ),
        };
      }
      return slide;
    });
    saveDeck(updatedDeck);
  };

  const updateNodeHeight = (nodeId: string, newHeight: number) => {
    const updatedDeck = deck.map((slide, idx) => {
      if (idx === activeSlideIndex) {
        return {
          ...slide,
          nodes: slide.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, height: Math.max(120, Math.min(newHeight, 800)) }
              : node,
          ),
        };
      }
      return slide;
    });
    saveDeck(updatedDeck);
  };

  // Dynamic Visual Rendering Engine producing rich native charts per item type
  const renderNodeVisual = (
    item: InsightItem,
    isExportingMode: boolean = false,
    customHeight?: number,
  ) => {
    // 優先ペイロードデータの抽出
    const activeTrendData =
      item.chartPayload && item.chartPayload.length > 0
        ? item.chartPayload
        : mockTrendData;
    const activeFunnelData =
      item.chartPayload && item.chartPayload.length > 0
        ? item.chartPayload
        : mockFunnelData;

    // Use custom height or default (increased for better fill)
    const displayH = customHeight || 400;
    // For export, we want to fill more of the 1280px slide width (minus padding)
    const exportWidth = 1000;

    // 0. ネイティブHTMLテーブル表示対応
    if (
      item.type === "table" ||
      item.title.toLowerCase().includes("matrix") ||
      item.title.toLowerCase().includes("table")
    ) {
      const rowMatch = item.metricsSummary?.match(/\d+/);
      const targetRowCount = rowMatch ? parseInt(rowMatch[0], 10) : 18;

      const fallbackRows = Array.from({ length: targetRowCount }, (_, i) => {
        const weekNum = targetRowCount - i;
        const rev = 12000 + ((i * 430) % 6000);
        const spd = 3000 + ((i * 95) % 1500);
        return {
          Period: `Week ${weekNum} (2026)`,
          Revenue: `$${rev.toLocaleString()}`,
          Spend: `$${spd.toLocaleString()}`,
          ROAS: (rev / spd).toFixed(2),
        };
      });

      const rows =
        item.chartPayload && item.chartPayload.length > 0
          ? item.chartPayload
          : fallbackRows;

      const headers =
        rows.length > 0
          ? Object.keys(rows[0])
          : ["Period", "Revenue", "Spend", "ROAS"];

      return (
        <div
          className={`w-full overflow-x-auto my-3 border rounded-xl ${
            isExportingMode
              ? ""
              : activeSlide.theme === "dark"
                ? "border-outline-variant/20 bg-stone-900/60"
                : "bg-white/60 border-outline-variant/20"
          }`}
          style={{
            minHeight: `${displayH}px`,
            height: isExportingMode ? "100%" : `${displayH}px`,
            width: isExportingMode ? `${exportWidth}px` : "100%",
            border: isExportingMode
              ? "1px solid rgba(135,169,150,0.3)"
              : undefined,
            backgroundColor: isExportingMode
              ? "rgba(255,255,255,0.6)"
              : undefined,
            borderRadius: isExportingMode ? "12px" : undefined,
            overflowX: "auto",
          }}
        >
          <table
            className="w-full text-left border-collapse"
            style={{
              width: "100%",
              fontSize: isExportingMode ? "14px" : "11px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(135,169,150,0.2)",
                  backgroundColor: isExportingMode
                    ? "#F5F4EE"
                    : activeSlide.theme === "dark"
                      ? "#2A2A2A"
                      : "#FAFAFA",
                }}
              >
                {headers.map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: isExportingMode ? "12px" : "10px",
                      color: "#87A996",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    backgroundColor:
                      rIdx % 2 === 1
                        ? activeSlide.theme === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)"
                        : "transparent",
                  }}
                >
                  {headers.map((h) => (
                    <td
                      key={h}
                      style={{ padding: "12px", fontFamily: "monospace" }}
                    >
                      {String((r as Record<string, unknown>)[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 1. Funnel Layout
    if (item.type === "funnel") {
      const firstEntry = activeFunnelData[0] || {};
      const valKey =
        "val" in firstEntry
          ? "val"
          : "value" in firstEntry
            ? "value"
            : Object.keys(firstEntry).find(
                (k) => typeof firstEntry[k] === "number",
              ) || "val";
      const nameKey =
        "name" in firstEntry
          ? "name"
          : "label" in firstEntry
            ? "label"
            : "step" in firstEntry
              ? "step"
              : "name";

      const chartProps = isExportingMode
        ? { width: exportWidth, height: displayH }
        : {};

      const chartContent = (
        <BarChart
          {...chartProps}
          data={activeFunnelData}
          layout="vertical"
          margin={{ top: 10, right: 30, bottom: 20, left: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            opacity={0.3}
          />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#87A996" }} />
          <YAxis
            dataKey={nameKey}
            type="category"
            tick={{ fontSize: 11, fill: "#87A996", fontWeight: "bold" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor:
                activeSlide.theme === "dark" ? "#1E1E1E" : "#FFFFFF",
              borderColor: "#87A996",
              borderRadius: "8px",
              fontSize: "11px",
            }}
          />
          <Bar
            dataKey={valKey}
            fill="#87A996"
            radius={[0, 4, 4, 0]}
            barSize={displayH > 400 ? 24 : displayH < 200 ? 10 : 16}
            isAnimationActive={false}
          >
            {activeFunnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.12} />
            ))}
          </Bar>
        </BarChart>
      );

      return (
        <div
          className="w-full my-3 block"
          style={{
            minHeight: `${displayH}px`,
            height: isExportingMode ? "100%" : `${displayH}px`,
          }}
        >
          {isExportingMode ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {chartContent}
            </div>
          ) : !isMounted ? (
            <div className="flex items-center justify-center h-full text-outline/20 text-[10px]">
              Loading Visualization...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={displayH} minWidth={0}>
              {chartContent}
            </ResponsiveContainer>
          )}
        </div>
      );
    }

    // 2. KPI / Matrix layout
    if (item.type === "kpi") {
      const match = item.metricsSummary.match(/([0-9.]+[MKBx%]?)/);
      const highlightedValue = match ? match[0] : "High";

      const firstEntry = activeTrendData[0] || {};
      const valKey =
        "v" in firstEntry
          ? "v"
          : "value" in firstEntry
            ? "value"
            : Object.keys(firstEntry).find(
                (k) => typeof firstEntry[k] === "number",
              ) || "v";

      const kpiH = Math.max(60, displayH / 2.5);
      const kpiW = kpiH * 2;
      const chartProps = isExportingMode ? { width: kpiW, height: kpiH } : {};

      const chartContent = (
        <BarChart {...chartProps} data={activeTrendData}>
          <Bar
            dataKey={valKey}
            fill="#87A996"
            radius={[2, 2, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      );

      return (
        <div
          style={{
            minHeight: `${displayH}px`,
            height: isExportingMode ? "100%" : `${displayH}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: displayH < 200 ? "10px" : "20px 40px",
            backgroundColor: isExportingMode
              ? "rgba(135,169,150,0.1)"
              : undefined,
            borderRadius: "16px",
            border: isExportingMode
              ? "1px solid rgba(135,169,150,0.2)"
              : undefined,
            margin: "12px 0",
          }}
          className={
            isExportingMode
              ? ""
              : "bg-primary-container/10 rounded-xl border border-primary/10"
          }
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                display: "block",
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "#8E9199",
              }}
            >
              Principal Metric
            </span>
            <span
              style={{
                fontSize: displayH < 200 ? "24px" : "48px",
                fontWeight: "bold",
                color: "#87A996",
                letterSpacing: "-0.02em",
              }}
            >
              {highlightedValue}
            </span>
          </div>
          <div
            style={{
              width: `${kpiW}px`,
              height: `${kpiH}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isExportingMode ? (
              chartContent
            ) : !isMounted ? (
              <div className="text-outline/20 text-[8px]">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={kpiH} minWidth={0}>
                {chartContent}
              </ResponsiveContainer>
            )}
          </div>
        </div>
      );
    }

    // 3. Area Charts
    const firstEntry = activeTrendData[0] || {};
    const valKey =
      "v" in firstEntry
        ? "v"
        : "value" in firstEntry
          ? "value"
          : "revenue" in firstEntry
            ? "revenue"
            : Object.keys(firstEntry).find(
                (k) => typeof firstEntry[k] === "number",
              ) || "v";
    const xKey =
      "period" in firstEntry
        ? "period"
        : "date" in firstEntry
          ? "date"
          : "name" in firstEntry
            ? "name"
            : "label" in firstEntry
              ? "label"
              : Object.keys(firstEntry)[0] || "period";

    const chartProps = isExportingMode
      ? { width: exportWidth, height: displayH }
      : {};

    const chartContent = (
      <AreaChart
        {...chartProps}
        data={activeTrendData}
        margin={{ top: 10, right: 30, bottom: 20, left: 10 }}
      >
        <defs>
          <linearGradient
            id={`gradient_${item.id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#87A996" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#87A996" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#87A996" }} />
        <YAxis tick={{ fontSize: 10, fill: "#87A996" }} />
        <Tooltip
          contentStyle={{
            backgroundColor:
              activeSlide.theme === "dark" ? "#1E1E1E" : "#FFFFFF",
            borderColor: "#87A996",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        <Area
          type="monotone"
          dataKey={valKey}
          stroke="#87A996"
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#gradient_${item.id})`}
          isAnimationActive={false}
        />
      </AreaChart>
    );

    return (
      <div
        className="w-full my-3 block"
        style={{
          minHeight: `${displayH}px`,
          height: isExportingMode ? "100%" : `${displayH}px`,
        }}
      >
        {isExportingMode ? (
          <div className="flex justify-center">{chartContent}</div>
        ) : !isMounted ? (
          <div className="flex items-center justify-center h-full text-outline/20 text-[10px]">
            Loading Visualization...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={displayH} minWidth={0}>
            {chartContent}
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  return (
    <main className="max-w-[1600px] mx-auto p-2 sm:p-6 h-[calc(100vh-100px)] flex flex-col gap-4 print:p-0 print:m-0 print:h-auto print:block">
      {/* Upper Dashboard Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/20 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              co_present
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none">
              Presentation Master
            </h1>
          </div>
          <p className="text-body-md text-outline">
            Drag analytics artifacts directly from your stock palette to compose tactical deck layers.
          </p>
        </div>

        {/* Deck Global Control Panel */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={copyAiPrompt}
            className="px-4 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-label font-bold hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm relative overflow-hidden group"
          >
            <span className="material-symbols-outlined text-sm animate-pulse">
              auto_awesome
            </span>
            <span>Copy Deck Blueprint for AI</span>
            <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          <button
            onClick={() => setIsFullscreenMode(true)}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-label font-bold hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm relative overflow-hidden group"
          >
            <span className="material-symbols-outlined text-sm animate-pulse">
              slideshow
            </span>
            <span>Present Mode</span>
            {/* Absolute shimmering micro-animation strip */}
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-2 bg-surface text-on-surface border border-outline-variant/40 rounded-xl text-xs font-label hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Deck</span>
          </button>
        </div>
      </section>

      {/* Main Builder Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px] print:hidden">
        {/* Center Canvas Stage / Massively Expanded to 8 Columns on Left */}
        {/* Center Canvas Stage decoupled to optimized subcomponent */}
        <PresentationCanvasStage
          deck={deck}
          activeSlideIndex={activeSlideIndex}
          setActiveSlideIndex={setActiveSlideIndex}
          removeSlide={removeSlide}
          activeSlide={activeSlide}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          updateNodeTitle={updateNodeTitle}
          removeNodeFromActiveSlide={removeNodeFromActiveSlide}
          renderNodeVisual={renderNodeVisual}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          updateNodeHeight={updateNodeHeight}
          addSlide={addSlide}
        />

        {/* Integrated Sidebar decoupled to optimized subcomponent */}
        <PresentationSidebar
          activePanelTab={activePanelTab}
          setActivePanelTab={setActivePanelTab}
          cartItems={cartItems}
          handleDragStartFromCart={handleDragStartFromCart}
          activeSlide={activeSlide}
          updateActiveSlideField={updateActiveSlideField}
          selectedNodeId={selectedNodeId}
          updateNodeHeight={updateNodeHeight}
        />
      </div>

      {/* Decoupled Immersive Fullscreen Presentation Stage */}
      <FullscreenPresentationModal
        isFullscreenMode={isFullscreenMode}
        setIsFullscreenMode={setIsFullscreenMode}
        activeSlideIndex={activeSlideIndex}
        setActiveSlideIndex={setActiveSlideIndex}
        deck={deck}
        renderNodeVisual={renderNodeVisual}
      />

      {/* Export Orchestrator Guidance Modal */}
      <ExportGuidanceModal
        isExportModalOpen={isExportModalOpen}
        setIsExportModalOpen={setIsExportModalOpen}
        deck={deck}
        setIsExporting={setIsExporting}
        onExportCsv={exportToCsv}
      />

      {/* Print-only Dedicated Full Deck Stage Rendering */}
      <PrintDeckEngine
        deck={deck}
        renderNodeVisual={renderNodeVisual}
        isExporting={isExporting}
      />
      {isExporting && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .recharts-responsive-container {
            min-width: 1px !important;
            min-height: 1px !important;
          }
        `,
          }}
        />
      )}
    </main>
  );
}

export default dynamic(() => Promise.resolve(PresentationDeckEngine), {
  ssr: false,
});
