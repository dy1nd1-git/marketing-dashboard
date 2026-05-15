"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketingContext } from "../../../src/context/MarketingContext";
import { useInsightCart } from "../../../src/context/InsightCartContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalysisResult {
  id: string;
  title: string;
  prompt: string;
  sql: string;
  chartType: "line" | "bar";
  data: { name: string; value: number }[];
  insight: string;
  timestamp: string;
  addedAt?: string;
}

function AnaliseContent() {
  const searchParams = useSearchParams();
  const { segment } = useMarketingContext();
  const { addInsight } = useInsightCart();
  const metric = searchParams?.get("metric") || "revenue";

  const [prompt, setPrompt] = useState("");

  const [tabs, setTabs] = useState<AnalysisResult[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem("exploration_tabs");
      const savedCart = localStorage.getItem("exploration_cart");
      setTimeout(() => {
        if (savedTabs) {
          const parsed = JSON.parse(savedTabs);
          setTabs(parsed);
          if (parsed.length > 0) setActiveTabId(parsed[0].id);
        }
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }, 0);
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem("exploration_tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("exploration_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  async function executeAIGeneratedAnalysis(promptText: string) {
    setIsAnalyzing(true);
    try {
      console.log(`[AI Logic] Converting prompt to SQL: "${promptText}"`);
      const mockSql = `SELECT date, metric_value FROM \`project.dataset.marketing_data\` WHERE metric = '${metric}' AND segment = '${segment}' AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)`;

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Determine chart type and data based on keyword
      const isComparison =
        promptText.includes("比較") ||
        promptText.includes("割合") ||
        promptText.includes("デバイス");
      const chartType = isComparison ? "bar" : "line";
      const title = isComparison ? "Conversion Comparison" : "ROAS Trendline";

      let mockData = [];
      if (isComparison) {
        mockData = [
          { name: "Desktop", value: 4500 },
          { name: "Mobile", value: 8200 },
          { name: "Tablet", value: 1200 },
        ];
      } else {
        mockData = [
          { name: "Mon", value: 1200 },
          { name: "Tue", value: 1900 },
          { name: "Wed", value: 1500 },
          { name: "Thu", value: 2100 },
          { name: "Fri", value: 2400 },
          { name: "Sat", value: 1800 },
          { name: "Sun", value: 2600 },
        ];
      }

      const mockResult: AnalysisResult = {
        id: crypto.randomUUID(),
        title: title,
        prompt: promptText,
        sql: mockSql,
        chartType: chartType,
        data: mockData,
        insight: `【AI Insight】 該当セグメントにおいて、指定期間中の${isComparison ? "比較結果としてモバイルの割合が圧倒的に高い" : "コンバージョン率が前週比で20%増加している"}ことが確認できます。`,
        timestamp: new Date().toISOString(),
      };

      setTabs((prev) => [mockResult, ...prev]);
      setActiveTabId(mockResult.id);
      setPrompt("");
    } catch (error) {
      console.error("Failed to execute analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }

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
      chartPayload: analysisData.data.map((d) => ({ name: d.name, value: d.value })),
    });
  };

  const handleAnalyze = () => {
    if (prompt.trim()) {
      executeAIGeneratedAnalysis(prompt);
    }
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="p-10 pb-32 min-h-screen bg-background relative flex flex-col font-sans">
      {/* Header & Top Input Bar */}
      <div className="mb-8 flex justify-between items-start gap-8">
        <div className="w-1/3">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none">
              Exploration
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide">
              {segment}
            </span>
          </div>
          <p className="text-body-md text-outline">
            Analyze and pivot your marketing data.
          </p>
        </div>

        {/* Top Input Bar */}
        <div className="flex-1 max-w-[700px]">
          <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-2 px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all focus-within:shadow-md">
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
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <button
              className="bg-primary text-on-primary hover:opacity-90 w-10 h-10 flex items-center justify-center rounded-full shadow-sm disabled:opacity-50 transition-all hover:scale-[1.02] shrink-0"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prompt.trim()}
            >
              {isAnalyzing ? (
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
      </div>

      <div className="flex gap-8 flex-1 items-start">
        {/* Left Area: Dynamic Canvas */}
        <div className="flex-1 flex flex-col gap-6">
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
          {activeTab ? (
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
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab.chartType === "line" ? (
                    <LineChart
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
                </ResponsiveContainer>
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
              </div>
            </div>
          ) : (
            // Empty State
            <div className="bg-surface-container-lowest rounded-[20px] p-12 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center h-[500px]">
              <div className="w-20 h-20 bg-[#f0f4f1] rounded-full flex items-center justify-center mb-6">
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
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                No active analysis
              </h3>
              <p className="text-outline text-data-sm max-w-md">
                Use the input bar above to query your marketing data. E.g.
                &quot;推移&quot; or &quot;比較&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Right Area: Insight Cart */}
        <div className="w-80 bg-surface-container-low/50 rounded-[24px] p-6 h-full min-h-[600px] border border-outline-variant/20 shadow-inner flex flex-col">
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

export default function AnalisePage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-gray-400">Loading workspace...</div>}
    >
      <AnaliseContent />
    </Suspense>
  );
}
