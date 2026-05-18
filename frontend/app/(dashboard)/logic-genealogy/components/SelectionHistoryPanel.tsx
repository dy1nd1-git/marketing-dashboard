"use client";

import React from "react";
import { motion } from "framer-motion";
import { HistoryLogItem } from "../../../../src/types/genealogy";

interface SelectionHistoryPanelProps {
  historyLogs: HistoryLogItem[];
}

export const SelectionHistoryPanel: React.FC<SelectionHistoryPanelProps> = ({
  historyLogs,
}) => {
  return (
    <motion.div
      key="history-panel"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-surface-container-lowest rounded-2xl p-xl border border-outline-variant/30 shadow-sm flex flex-col gap-lg min-h-[600px]"
    >
      <div className="flex justify-between items-center pb-md border-b border-outline-variant/20">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">
            Selection &amp; Action History
          </h2>
          <p className="font-body-sm text-body-md text-outline">
            Persistent audit trail of contextual segment exploration and
            strategic pipeline executions.
          </p>
        </div>
        <span className="font-label text-label text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
          {historyLogs.length} Records Tracked
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[650px]">
        {historyLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-lg rounded-xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-md ${
              log.type === "approval"
                ? "bg-[#FDFCF8] border-[#D4A373]/30 shadow-sm hover:border-[#D4A373]/60"
                : "bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low/40"
            }`}
          >
            <div className="flex items-start gap-md">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  log.type === "approval"
                    ? "bg-[#D4A373]/15 text-[#D4A373]"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {log.type === "approval" ? "verified" : "travel_explore"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-label text-[11px] text-outline tracking-wider">
                    {log.timestamp}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      log.type === "approval"
                        ? "bg-[#D4A373] text-white shadow-xs"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {log.badge}
                  </span>
                </div>
                <h4 className="font-h2 text-[16px] text-on-surface font-semibold mb-1">
                  {log.title}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-snug max-w-3xl">
                  {log.detail}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                alert(
                  `Synchronizing specific workspace checkpoint parameters for:\n"${log.title}"`,
                );
              }}
              className="font-label text-label text-primary hover:underline self-end md:self-center shrink-0"
            >
              Restore State
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
