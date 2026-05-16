"use client";

import React from "react";
import { motion } from "framer-motion";
import { ROASMatrixCell } from "../../../../src/types/marketing";

interface ROASMatrixProps {
  data: ROASMatrixCell[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);

export const ROASMatrix: React.FC<ROASMatrixProps> = ({ data }) => {
  // Find max ROAS for scaling the colors
  const maxRoas = Math.max(...data.map((c) => c.roas), 1);

  const getCellColor = (roas: number) => {
    const opacity = Math.max(0.1, (roas / maxRoas) * 0.9);
    return `rgba(135, 169, 150, ${opacity})`; // Sage Green base (#87A996)
  };

  return (
    <div className="w-full bg-white p-xl rounded-3xl shadow-[0_20px_30px_rgba(135,169,150,0.05)] border border-stone-100">
      <div className="flex justify-between items-center mb-xl">
        <div>
          <h3 className="font-h2 text-xl text-on-surface">Efficiency Heatmap</h3>
          <p className="text-sm text-outline mt-1">
            ROAS performance by Day of Week and Hour of Day
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-outline uppercase tracking-widest font-label">Low Efficiency</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((op) => (
                <div key={op} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(135, 169, 150, ${op})` }} />
              ))}
            </div>
            <span className="text-[10px] text-outline uppercase tracking-widest font-label">High Efficiency</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header (Hours) */}
          <div className="flex mb-2">
            <div className="w-12 shrink-0" /> {/* Spacer for day labels */}
            <div className="flex-1 flex justify-between px-1">
              {HOURS.map((h, i) => (
                <span key={h} className="text-[9px] text-outline w-full text-center font-label opacity-60">
                  {i % 3 === 0 ? h : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Rows */}
          <div className="space-y-1">
            {DAYS.map((day, dIdx) => (
              <div key={day} className="flex items-center group">
                <div className="w-12 shrink-0 text-xs font-label text-outline opacity-80 group-hover:text-primary-container transition-colors">
                  {day}
                </div>
                <div className="flex-1 flex gap-1 h-8">
                  {Array.from({ length: 24 }).map((_, hIdx) => {
                    const cell = data.find((c) => c.day_of_week === dIdx && c.hour_of_day === hIdx);
                    const roas = cell?.roas || 0;
                    return (
                      <motion.div
                        key={hIdx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (dIdx * 24 + hIdx) * 0.001 }}
                        className="flex-1 rounded-sm relative group/cell cursor-pointer"
                        style={{ backgroundColor: getCellColor(roas) }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-on-surface text-white text-[10px] rounded-lg opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl">
                          <span className="font-bold">{day} {hIdx}:00</span>
                          <div className="text-primary-fixed-dim">ROAS: {roas.toFixed(2)}x</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
