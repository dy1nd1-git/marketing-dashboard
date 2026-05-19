"use client";

import { useState, useEffect, Suspense, useTransition, useRef } from "react";

import { mapToChartData } from "./utils/metrics";
import { useMarketingContext } from "../../../src/context/MarketingContext";
import { useInsightCart } from "../../../src/context/InsightCartContext";
import { executeAnalysisAction } from "../../../src/lib/aiAnalysis";
import { DateRangePicker } from "../../../src/components/dashboard/DateRangePicker";
import { useIsClient } from "../../../src/hooks/useIsClient";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface AnalysisResult {
  id: string;
  title: string;
  prompt: string;
  sql: string;
  chartType: "line" | "bar";
  data: { name: string; value: number }[];
  insight: string;
  actions?: string[]; // Added for Task-023
  timestamp: string;
  addedAt?: string;
}

function AnaliseContent() {
  const { segment } = useMarketingContext();
  const { addInsight } = useInsightCart();

  // Defer initialization to client-side mount tick to prevent SSR hydration mismatches
  const isClient = useIsClient();
  const [chartReady, setChartReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setChartReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (chartReady && containerRef.current && typeof window !== "undefined" && "ResizeObserver" in window) {
      setChartWidth(containerRef.current.clientWidth || 800);
      const observer = new window.ResizeObserver((entries) => {
        if (entries[0]) {
          setChartWidth(entries[0].contentRect.width || 800);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [chartReady]);

  const [isPending, startTransition] = useTransition();

  const [tabs, setTabs] = useState<AnalysisResult[]>(() => {
    try {
      const savedTabs = localStorage.getItem("exploration_tabs");
      if (savedTabs) {
        const parsed = JSON.parse(savedTabs);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    try {
      const savedTabs = localStorage.getItem("exploration_tabs");
      if (savedTabs) {
        const parsed = JSON.parse(savedTabs);
        if (parsed && parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return null;
  });

  const [cartItems, setCartItems] = useState<AnalysisResult[]>(() => {
    try {
      const savedCart = localStorage.getItem("exploration_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [prompt, setPrompt] = useState("");

  // Custom states for generative AI traceability & copy actions
  const [isSqlExpanded, setIsSqlExpanded] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem("exploration_tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("exploration_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCopySql = async (sqlText: string) => {
    try {
      await navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // Ignored
    }
  };

  const handleAnalyze = (targetPrompt?: string) => {
    const analysisPrompt = targetPrompt || prompt;
    if (analysisPrompt.trim()) {
      startTransition(async () => {
        try {
          const res = await executeAnalysisAction(analysisPrompt);

          // Map backend response using robust modular metric utility
          const chartData = mapToChartData(res.data, analysisPrompt);

          const isComparison =
            analysisPrompt.includes("比較") || analysisPrompt.includes("割合");

          const realResult: AnalysisResult = {
            id: crypto.randomUUID(),
            title: isComparison
              ? "AI Structural Comparison"
              : "AI Intelligence Trend",
            prompt: analysisPrompt,
            sql: res.metadata?.execution_sql || "N/A",
            chartType: isComparison ? "bar" : "line",
            data: chartData,
            insight: res.analysis,
            actions: res.actions,
            timestamp: new Date().toISOString(),
          };

          setTabs((prev) => [realResult, ...prev]);
          setActiveTabId(realResult.id);
          setPrompt("");
        } catch (error) {
          console.error("Failed to execute analysis:", error);
          alert(
            error instanceof Error
              ? error.message
              : "AI分析エンジンの呼び出しに失敗しました。バックエンドとAPIキーの設定を確認してください。",
          );
        }
      });
    }
  };

  const onDropToCart = (analysisData: AnalysisResult) => {
    const packageData = { ...analysisData, addedAt: new Date().toISOString() };
    setCartItems((prev) => [...prev, packageData]);

    // Presentation Master のストックパレットへシームレス同時プール
    addInsight({
      title: analysisData.title,
      type: analysisData.chartType === "bar" ? "chart" : "chart",
      metricsSummary: `AI Prompt: "${analysisData.prompt}"`,
      sourceRef: `bq://exploration.ai.${analysisData.chartType}`,
      notes: analysisData.insight,
      chartPayload: analysisData.data.map((d) => ({
        name: d.name,
        value: d.value,
      })),
    });
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!isClient) {
    return (
      <div className="p-10 pb-32 min-h-screen bg-background relative flex flex-col font-sans">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[380px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-outline font-mono">
            Initializing Sandbox Engine...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 pb-32 min-h-screen bg-background relative flex flex-col font-sans">
      {/* Header & Top Input Bar - Standardized Parallel Row */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Row 1: Title with Icon & Input Bar */}
        <div className="flex justify-between items-center gap-8">
          <div className="flex-1 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[32px] shrink-0">
              troubleshoot
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none shrink-0">
              Deep Analysis
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide shrink-0">
              {segment}
            </span>
          </div>

          <div className="flex-1 max-w-[700px] flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-2 px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all focus-within:shadow-md">
            <div className="pl-4 text-primary opacity-80">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent px-2 py-2 text-data-lg focus:outline-none placeholder:text-outline/60 font-data-sm text-on-surface"
              placeholder="// [INPUT]: Try '推移' or '比較'..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  handleAnalyze();
                }
              }}
            />
            <button
              className="bg-primary text-on-primary hover:opacity-90 w-10 h-10 flex items-center justify-center rounded-full shadow-sm disabled:opacity-50 transition-all hover:scale-[1.02] shrink-0"
              onClick={() => handleAnalyze()}
              disabled={isPending || !prompt.trim()}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Subtitle & Suggestions + DatePicker */}
        <div className="flex justify-between items-center gap-8">
          <p className="text-body-md text-outline flex-1">
            Analyze and pivot your marketing data.
          </p>
          <div className="flex-1 max-w-[700px] flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 pl-2">
            <div className="flex flex-wrap gap-1.5 justify-start">
              <span className="text-[10px] text-outline font-semibold tracking-wider uppercase self-center mr-1.5">
                Suggestions:
              </span>
              <button
                onClick={() => {
                  setPrompt(
                    "過去30日間のコンバージョン率（CVR）の推移を分析せよ",
                  );
                  handleAnalyze(
                    "過去30日間のコンバージョン率（CVR）の推移を分析せよ",
                  );
                }}
                className="bg-[#FDFCF8] hover:bg-[#87A996]/10 text-[#456555] border border-[#87A996]/20 px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer transition-all hover:scale-[1.01] hover:border-[#87A996]/50"
              >
                CVR Trend Analysis
              </button>
              <button
                onClick={() => {
                  setPrompt("広告費と売上成長の相関関係を検証せよ");
                  handleAnalyze("広告費と売上成長の相関関係を検証せよ");
                }}
                className="bg-[#FDFCF8] hover:bg-[#87A996]/10 text-[#456555] border border-[#87A996]/20 px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer transition-all hover:scale-[1.01] hover:border-[#87A996]/50"
              >
                Spend vs Revenue
              </button>
              <button
                onClick={() => {
                  setPrompt("昨日のROAS急落の要因とアノマリーを特定せよ");
                  handleAnalyze("昨日のROAS急落の要因とアノマリーを特定せよ");
                }}
                className="bg-[#FDFCF8] hover:bg-[#87A996]/10 text-[#456555] border border-[#87A996]/20 px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer transition-all hover:scale-[1.01] hover:border-[#87A996]/50"
              >
                ROAS Anomaly Detection
              </button>
            </div>
            <div className="shrink-0 self-center">
              <DateRangePicker />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left Area: Dynamic Canvas */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Tabs UI */}
          {tabs.length > 0 && (
            <div className="flex gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-4 py-2 rounded-t-[12px] text-data-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTabId === tab.id
                      ? "bg-surface-container-lowest text-primary border-t border-l border-r border-outline-variant/30 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.05)]"
                      : "text-outline hover:bg-surface-container-low/50 hover:text-on-surface"
                  }`}
                >
                  {tab.title}
                  <span
                    className="opacity-40 hover:opacity-100 hover:text-red-500 rounded-full p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTabs = tabs.filter((t) => t.id !== tab.id);
                      setTabs(newTabs);
                      if (activeTabId === tab.id) {
                        setActiveTabId(
                          newTabs.length > 0 ? newTabs[0].id : null,
                        );
                      }
                    }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Canvas Content */}
          {isPending ? (
            <div className="bg-surface-container-lowest rounded-[20px] rounded-tl-none p-6 shadow-[0_10px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 flex flex-col gap-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="w-1/3 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100/60 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-slate-100 rounded-full w-24"></div>
              </div>

              {/* Chart Shimmer */}
              <div className="h-[650px] w-full bg-[#FDFCF8] rounded-xl border border-slate-100 flex items-center justify-center">
                <span className="text-[11px] font-bold text-[#87A996] tracking-widest uppercase">
                  AI AGGREGATING PIPELINE TELEMETRY...
                </span>
              </div>

              {/* Insight Box Shimmer */}
              <div className="bg-[#f0f4f1]/50 border border-dashed border-[#d6e3db]/60 rounded-[16px] p-5 space-y-3">
                <div className="h-4 bg-slate-200/50 rounded w-1/4"></div>
                <div className="h-3 bg-slate-200/40 rounded w-full"></div>
                <div className="h-3 bg-slate-200/40 rounded w-5/6"></div>
              </div>
            </div>
          ) : activeTab ? (
            <div className="bg-surface-container-lowest rounded-[20px] rounded-tl-none p-6 shadow-[0_10px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-on-surface text-lg">
                    {activeTab.title}
                  </h3>
                  <p className="text-data-sm text-outline mt-1 font-data-sm italic">
                    &quot;{activeTab.prompt}&quot;
                  </p>
                </div>
                <button
                  className="px-3 py-1.5 bg-primary/10 text-primary text-data-sm rounded-full font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                  onClick={() => onDropToCart(activeTab)}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Save to Cart
                </button>
              </div>

              {/* Dynamic Recharts */}
              <div ref={containerRef} className={`h-[650px] w-full mt-4 ${!chartReady ? "flex items-center justify-center" : "relative block"}`}>
                {!chartReady || chartWidth === 0 ? (
                  <div className="text-outline/40 text-data-sm animate-pulse">
                    Initializing visualization...
                  </div>
                ) : (
                  <>
                    {activeTab.chartType === "line" ? (
                      <LineChart
                        width={chartWidth}
                        height={650}
                        data={activeTab.data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(135,169,150,0.2)"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6e7a73" }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6e7a73" }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                          }}
                          itemStyle={{ color: "#456555", fontWeight: 600 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#456555"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "#456555",
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart
                        width={chartWidth}
                        height={650}
                        data={activeTab.data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(135,169,150,0.2)"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6e7a73" }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6e7a73" }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                          }}
                          itemStyle={{ color: "#456555", fontWeight: 600 }}
                          cursor={{ fill: "rgba(69,101,85,0.05)" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#456555"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={60}
                        />
                      </BarChart>
                    )}
                  </>
                )}
              </div>

              {/* AI Insight Box */}
              <div className="bg-[#f0f4f1] border border-[#d6e3db] rounded-[16px] p-5 mt-4">
                <div className="flex items-center gap-2 mb-2 text-[#2e4238] font-semibold text-data-sm">
                  <svg
                    className="w-4 h-4 text-[#d4a373]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                  </svg>
                  AI Generated Insight
                </div>
                <p className="text-[#456555] text-data-sm leading-relaxed">
                  {activeTab.insight}
                </p>

                {activeTab.actions && activeTab.actions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#d6e3db]">
                    <div className="text-[11px] font-bold text-[#6e7a73] uppercase tracking-wider mb-2">
                      Recommended Actions
                    </div>
                    <ul className="space-y-2">
                      {activeTab.actions.map((action, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-data-sm text-[#456555]"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#d4a373] shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Generated SQL Accordion: Decisions chain of trust traceability */}
              {activeTab.sql && activeTab.sql !== "N/A" && (
                <div className="border border-outline-variant/40 rounded-xl overflow-hidden mt-2">
                  <button
                    onClick={() => setIsSqlExpanded(!isSqlExpanded)}
                    className="w-full px-4 py-3 bg-surface-container-low hover:bg-surface-container-low/75 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-[#87A996]">
                        terminal
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant font-label">
                        AI Generated Execution SQL
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-xs text-outline">
                      {isSqlExpanded
                        ? "keyboard_arrow_up"
                        : "keyboard_arrow_down"}
                    </span>
                  </button>

                  {isSqlExpanded && (
                    <div className="bg-slate-900 p-4 relative flex flex-col font-mono text-[11px] border-t border-outline-variant/40">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] text-slate-400 font-mono tracking-wider">
                          GENERATED BY GEMINI 1.5 FLASH
                        </span>
                        <button
                          onClick={() => handleCopySql(activeTab.sql || "")}
                          className="text-[9px] text-[#87A996] hover:text-[#769785] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[11px]">
                            {copiedSql ? "check" : "content_copy"}
                          </span>
                          {copiedSql ? "COPIED" : "COPY SQL"}
                        </button>
                      </div>
                      <pre className="text-emerald-400 leading-relaxed overflow-x-auto max-h-48 custom-scrollbar select-all whitespace-pre-wrap">
                        <code>{activeTab.sql}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="w-full bg-surface-container-lowest rounded-[20px] p-8 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center h-full min-h-[480px]">
              <div className="w-20 h-20 bg-[#f0f4f1] rounded-full flex items-center justify-center mb-6 shrink-0">
                <svg
                  className="w-10 h-10 text-primary opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2 tracking-tight">
                No active analysis
              </h3>
              <p className="text-outline text-data-sm w-full text-center leading-relaxed whitespace-normal">
                Use the input bar above to query your marketing data. E.g.
                &quot;推移&quot; or &quot;比較&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Right Area: Insight Cart */}
        <div className="w-80 bg-surface-container-low/50 rounded-[24px] p-6 h-full min-h-[480px] border border-outline-variant/20 shadow-inner flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-2">
            <svg
              className="w-5 h-5 text-outline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="font-semibold text-on-surface">Insight Cart</h2>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-[16px] shadow-sm relative group transition-all hover:shadow-md hover:border-primary/30"
              >
                <h4 className="font-medium text-[14px] text-on-surface mb-1 truncate pr-6">
                  {item.title}
                </h4>
                <p className="text-[12px] text-outline line-clamp-2 leading-snug mb-2">
                  &quot;{item.prompt}&quot;
                </p>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-outline/60 bg-surface-container-low px-2 py-0.5 rounded-sm">
                    {item.chartType.toUpperCase()}
                  </span>
                  <button
                    className="text-outline/40 hover:text-red-400 transition-colors"
                    onClick={() =>
                      setCartItems((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-data-sm text-outline/60">
                  Cart is empty. Generate an analysis and save it here.
                </p>
              </div>
            )}
          </div>

          <button
            className="w-full py-3 mt-4 bg-on-surface text-surface-container-lowest rounded-[12px] font-medium text-data-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
          >
            Export Presentation ({cartItems.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-gray-400">Loading workspace...</div>}
    >
      <AnaliseContent />
    </Suspense>
  );
}
