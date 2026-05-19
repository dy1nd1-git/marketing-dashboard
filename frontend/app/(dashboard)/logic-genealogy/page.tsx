"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useIsClient } from "../../../src/hooks/useIsClient";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketingContext } from "../../../src/context/MarketingContext";
import { HistoryLogItem, StrategyNode } from "../../../src/types/genealogy";
import { SelectionHistoryPanel } from "./components/SelectionHistoryPanel";
import { DocumentPanel } from "./components/DocumentPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { GenealogyHUD } from "./components/GenealogyHUD";

const CURRENT_PATH_D =
  "M 150,450 C 300,450 300,300 450,300 C 625,300 650,210 800,210";
const RECOMMENDED_PATH_D =
  "M 450,300 C 475,200 450,180 500,180 C 675,180 700,90 850,90";

const STRATEGY_NODES: StrategyNode[] = [
  {
    id: "node-1",
    type: "current",
    cx: 150,
    cy: 450,
    label: "Awareness Phase",
    roi: "120%",
    cvr: "2.4%",
    sql: "SELECT phase, sum(spend) FROM `project.dataset.ads`\nWHERE phase = 'awareness' GROUP BY 1",
    insight:
      "Initial acquisition costs are stable but drop-off prior to checkout is elevated.",
  },
  {
    id: "node-2",
    type: "current",
    cx: 450,
    cy: 300,
    label: "Mid-Funnel Retargeting",
    roi: "240%",
    cvr: "4.8%",
    sql: "SELECT phase, avg(cvr) FROM `project.dataset.ads`\nWHERE target = 'retargeting' AND days < 14",
    insight:
      "Strong click-through resilience. Users engaged here show higher lifetime retention.",
  },
  {
    id: "node-3",
    type: "current",
    cx: 800,
    cy: 210,
    label: "Current Conversion Core",
    roi: "342%",
    cvr: "6.2%",
    sql: "SELECT final_roi, total_conversions FROM `project.dataset.ga4`\nWHERE is_active = true",
    insight:
      "Current trajectory mirrors the 2023 Spring Campaign success. Baseline established.",
  },
  {
    id: "node-rec-1",
    type: "recommended",
    cx: 500,
    cy: 180,
    label: "Organic Social Pivot",
    roi: "410%",
    cvr: "8.5%",
    sql: "SELECT predicted_lift FROM `ml.roi_models`\nWHERE scenario = 'organic_shift_15pct'",
    insight:
      "Reallocating 15% budget towards organic creator nodes shows a highly compressed CPA probability.",
  },
  {
    id: "node-rec-2",
    type: "recommended",
    cx: 850,
    cy: 90,
    label: "Compounded Future ROI",
    roi: "485%",
    cvr: "11.2%",
    sql: "SELECT cumulative_roi FROM `ml.forecast_engine`\nWHERE horizon_days = 90",
    insight:
      "Compounding network effects expected to achieve +40% efficiency gains over the baseline curve.",
  },
];

const INITIAL_DEMO_HISTORY: HistoryLogItem[] = [
  {
    id: "hist-1",
    timestamp: "2026-05-12 14:20",
    type: "exploration",
    title: "Explored Context Segment: Paid Social",
    detail:
      "Focused dashboard context parameters to review Paid Social channel efficiency curves.",
    badge: "Explored",
  },
  {
    id: "hist-2",
    timestamp: "2026-05-10 09:15",
    type: "approval",
    title: "Approved Q2 Creative Reallocation",
    detail:
      "Executed strategy to shift 10% budget from static banners to high-engagement video networks.",
    badge: "Executed",
  },
  {
    id: "hist-3",
    timestamp: "2026-05-08 17:45",
    type: "exploration",
    title: "Explored Context Segment: Organic Search",
    detail:
      "Evaluated mid-funnel conversion leakage and long-term retention resilience.",
    badge: "Explored",
  },
];

export default function LogicCanvasPage() {
  const { segment } = useMarketingContext();
  const [activeTab, setActiveTab] = useState<
    "Genealogy" | "Document" | "History"
  >("Genealogy");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-rec-1");
  const isClient = useIsClient();
  const [historyLogs, setHistoryLogs] = useState<HistoryLogItem[]>(INITIAL_DEMO_HISTORY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("logic_canvas_history");
      if (saved) {
        setTimeout(() => setHistoryLogs(JSON.parse(saved)), 0);
      }
    } catch {}
  }, []);
  const [optimisticApproved, setOptimisticApproved] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Track exploration segment switches in history log dynamically
  useEffect(() => {
    if (!segment) return;
    setTimeout(() => {
      setHistoryLogs((prev) => {
        // Avoid duplicate consecutive logging
        if (prev.length > 0 && prev[0].title.includes(segment)) return prev;

        const newLog: HistoryLogItem = {
          id: crypto.randomUUID(),
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
          type: "exploration",
          title: `Explored Context Segment: ${segment}`,
          detail: `Synchronized global workspace states to focus visual HUD evaluation on ${segment}.`,
          badge: "Explored",
        };
        const updated = [newLog, ...prev];
        try {
          localStorage.setItem("logic_canvas_history", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed saving log", e);
        }
        return updated;
      });
    }, 0);
  }, [segment]);

  const selectedNode =
    STRATEGY_NODES.find((n) => n.id === selectedNodeId) || STRATEGY_NODES[3];

  const handleApproveAction = () => {
    if (isPending || optimisticApproved) return;

    startTransition(async () => {
      // Simulate API execution pipeline
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setOptimisticApproved(true);

      // Record persistent selection decision log
      const approvalLog: HistoryLogItem = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        type: "approval",
        title: `Approved Action: ${selectedNode.label}`,
        detail: `Optimistically triggered baseline reallocation. Target Metrics: CVR ${selectedNode.cvr} / ROI ${selectedNode.roi}.`,
        badge: "Executed",
      };

      setHistoryLogs((prev) => {
        const updated = [approvalLog, ...prev];
        try {
          localStorage.setItem(
            "logic_canvas_history",
            JSON.stringify(updated),
          );
        } catch (e) {
          console.error("Storage error", e);
        }
        return updated;
      });
    });
  };

  if (!isClient) {
    return (
      <div className="p-xl flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-xl flex flex-col gap-xl max-w-[1500px] mx-auto min-h-screen">
      {/* Top Controls & Navigation Shell */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/20 print:hidden mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">
              account_tree
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none shrink-0">
              Logic Genealogy
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide shrink-0">
              {segment}
            </span>
          </div>
          <p className="text-body-md text-outline">
            Trace statistical evidence and approve predictive strategy workflows.
          </p>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex items-center bg-surface-container-lowest rounded-full p-1.5 border border-outline-variant/40 shadow-sm">
          {(["Genealogy", "Document", "History"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-label text-label transition-all duration-300 relative ${
                  isActive
                    ? "text-on-surface font-semibold shadow-sm"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-surface-container-low rounded-full border border-outline-variant/30 z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab === "History" && (
                    <span className="w-2 h-2 rounded-full bg-[#D4A373]" />
                  )}
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Responsive Render Area */}
      <AnimatePresence mode="wait">
        {activeTab === "History" ? (
          <SelectionHistoryPanel historyLogs={historyLogs} />
        ) : activeTab === "Document" ? (
          <DocumentPanel />
        ) : (
          /* Main Interactive Logic Canvas Grid */
          <motion.div
            key="canvas-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-12 gap-lg flex-1 items-stretch"
          >
            <GenealogyHUD
              STRATEGY_NODES={STRATEGY_NODES}
              CURRENT_PATH_D={CURRENT_PATH_D}
              RECOMMENDED_PATH_D={RECOMMENDED_PATH_D}
              optimisticApproved={optimisticApproved}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              selectedNode={selectedNode}
            />
            <EvidencePanel
              selectedNode={selectedNode}
              onApprove={handleApproveAction}
              isApproving={isPending}
              optimisticApproved={optimisticApproved}
              onAddToCart={() => {
                alert(
                  `Saved strategy context for "${selectedNode.label}" to persistent Insight Cart.`,
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
