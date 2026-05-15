"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrategyNode } from "./types";

interface GenealogyHUDProps {
  STRATEGY_NODES: StrategyNode[];
  CURRENT_PATH_D: string;
  RECOMMENDED_PATH_D: string;
  optimisticApproved: boolean;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  selectedNode: StrategyNode;
}

export const GenealogyHUD: React.FC<GenealogyHUDProps> = ({
  STRATEGY_NODES,
  CURRENT_PATH_D,
  RECOMMENDED_PATH_D,
  optimisticApproved,
  selectedNodeId,
  setSelectedNodeId,
  selectedNode,
}) => {
  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-[0_8px_40px_rgba(69,101,85,0.06)] border border-outline-variant/30 relative overflow-hidden flex flex-col p-xl min-h-[650px]">
      {/* Organic Background Dot Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #87A996 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header Title inside HUD */}
      <div className="flex justify-between items-start relative z-20 mb-md">
        <div>
          <h3 className="font-h2 text-h2 text-on-surface">Genealogy HUD</h3>
          <p className="font-label text-label text-outline mt-0.5">
            Interactive Cubic Bezier Curves. Hover nodes to evaluate predictive
            path indicators.
          </p>
        </div>
        {optimisticApproved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-label text-xs uppercase tracking-wider shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              check_circle
            </span>
            Action Approved
          </motion.div>
        )}
      </div>

      {/* Embedded Mathematical SVG Canvas rendering layer */}
      <div className="relative flex-1 w-full my-auto min-h-[400px] overflow-x-auto overflow-y-hidden custom-scrollbar">
        <svg
          className="absolute inset-0 w-full h-full min-w-[1000px] overflow-visible z-0"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Shadow Filter for Nodes */}
            <filter
              id="node-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#87A996"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Base Faint Reference Guide Path */}
          <path
            d={CURRENT_PATH_D}
            fill="none"
            stroke="rgba(135, 169, 150, 0.15)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Current Active Trajectory Path (Sage Green) */}
          <motion.path
            d={CURRENT_PATH_D}
            fill="none"
            stroke="#87A996"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* AI Predictive Alternative Path (Terracotta Dashed) */}
          <motion.path
            d={RECOMMENDED_PATH_D}
            fill="none"
            stroke="#D4A373"
            strokeWidth="4"
            strokeDasharray="10 10"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          />

          {/* Optimistic Approved Flow Halo overlay effect */}
          {optimisticApproved && (
            <motion.path
              d={
                selectedNode.type === "recommended"
                  ? RECOMMENDED_PATH_D
                  : CURRENT_PATH_D
              }
              fill="none"
              stroke="#87A996"
              strokeWidth="12"
              strokeOpacity="0.3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Render Strategy Interactive Nodes */}
          {STRATEGY_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isRec = node.type === "recommended";
            const nodeColor = isRec ? "#D4A373" : "#87A996";

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => setSelectedNodeId(node.id)}
              >
                {/* Outer Glow Target Base */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="28"
                  fill="transparent"
                  className="transition-all duration-300"
                />
                {/* Halo pulse when selected */}
                {isSelected && (
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r="18"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {/* Main Visible Node Anchor Point */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isSelected ? "11" : "8"}
                  fill={isSelected ? "#FDFCF8" : nodeColor}
                  stroke={nodeColor}
                  strokeWidth={isSelected ? "4" : "0"}
                  filter={isSelected ? "url(#node-glow)" : undefined}
                  className="transition-all duration-300 group-hover:scale-125"
                />
                {/* Static Label Reference Text */}
                <text
                  x={node.cx}
                  y={node.cy - 20}
                  textAnchor="middle"
                  fill="#4A524D"
                  className={`font-label text-[11px] transition-all duration-300 ${
                    isSelected ? "font-bold fill-on-surface" : "opacity-80"
                  }`}
                >
                  {node.label}
                </text>
                {/* Micro KPI Badge near node */}
                <text
                  x={node.cx}
                  y={node.cy + 24}
                  textAnchor="middle"
                  fill={nodeColor}
                  className="font-data-sm text-[10px] font-semibold tracking-wide"
                >
                  ROI {node.roi}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Interactive Advisor Summary Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[30px] left-[5%] max-w-[340px] bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-lg border border-outline-variant/40 shadow-[0_12px_40px_rgba(0,0,0,0.06)] pointer-events-none z-20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    selectedNode.type === "recommended"
                      ? "text-[#D4A373]"
                      : "text-primary"
                  }`}
                >
                  {selectedNode.type === "recommended"
                    ? "tips_and_updates"
                    : "timeline"}
                </span>
                <span
                  className={`font-label text-[10px] uppercase tracking-wider font-semibold ${
                    selectedNode.type === "recommended"
                      ? "text-[#D4A373]"
                      : "text-primary"
                  }`}
                >
                  {selectedNode.type === "recommended"
                    ? "AI Advisor"
                    : "Core Node"}
                </span>
              </div>
              <span className="font-data-sm text-xs text-on-surface font-bold bg-surface-container-low px-2 py-0.5 rounded">
                CVR {selectedNode.cvr}
              </span>
            </div>

            <h4 className="font-h2 text-[15px] text-on-surface mb-1">
              {selectedNode.label}
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {selectedNode.insight}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Multi-Source Data Lineage Footnotes */}
      <div className="relative z-20 mt-auto pt-lg border-t border-outline-variant/30 border-dashed grid grid-cols-3 gap-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20 shrink-0">
            <span className="material-symbols-outlined text-outline text-[20px]">
              database
            </span>
          </div>
          <div>
            <div className="font-label text-[10px] text-outline uppercase tracking-wider">
              Source Layer
            </div>
            <div className="font-data-sm text-xs text-on-surface font-medium truncate">
              BigQuery Live
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20 shrink-0">
            <span className="material-symbols-outlined text-outline text-[20px]">
              analytics
            </span>
          </div>
          <div>
            <div className="font-label text-[10px] text-outline uppercase tracking-wider">
              Core Pipeline
            </div>
            <div className="font-data-sm text-xs text-on-surface font-medium truncate">
              GA4 Tracking Engine
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20 shrink-0">
            <span className="material-symbols-outlined text-[#D4A373] text-[20px]">
              hub
            </span>
          </div>
          <div>
            <div className="font-label text-[10px] text-[#D4A373] uppercase tracking-wider">
              Inference Engine
            </div>
            <div className="font-data-sm text-xs text-on-surface font-medium truncate">
              Social Graph ML
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
