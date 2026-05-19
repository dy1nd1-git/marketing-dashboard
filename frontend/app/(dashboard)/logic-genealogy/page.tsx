"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useIsClient } from "../../../src/hooks/useIsClient";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketingContext } from "../../../src/context/MarketingContext";
import { HistoryLogItem } from "../../../src/types/genealogy";
import { SelectionHistoryPanel } from "./components/SelectionHistoryPanel";
import { DocumentPanel } from "./components/DocumentPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { GenealogyHUD } from "./components/GenealogyHUD";

import {
  CURRENT_PATH_D,
  RECOMMENDED_PATH_D,
  STRATEGY_NODES,
  INITIAL_DEMO_HISTORY,
} from "./mockData";

function LogicCanvasPage() {
  const { segment } = useMarketingContext();
  const [activeTab, setActiveTab] = useState<
    "Genealogy" | "Document" | "History"
  >("Genealogy");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-rec-1");
  const isClient = useIsClient();
  const [historyLogs, setHistoryLogs] = useState<HistoryLogItem[]>(() => {
    try {
      const saved = localStorage.getItem("logic_canvas_history");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEMO_HISTORY;
  });
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
          localStorage.setItem("logic_canvas_history", JSON.stringify(updated));
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
            Trace statistical evidence and approve predictive strategy
            workflows.
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

export default function Page() {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#111111] p-6 flex items-center justify-center">
        <div className="text-gray-400">Loading workspace...</div>
      </div>
    );
  }
  return <LogicCanvasPage />;
}
