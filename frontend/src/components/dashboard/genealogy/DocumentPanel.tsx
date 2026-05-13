"use client";

import React from "react";
import { motion } from "framer-motion";

export const DocumentPanel: React.FC = () => {
  return (
    <motion.div
      key="document-panel"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-surface-container-lowest rounded-2xl p-xl border border-outline-variant/30 shadow-sm flex flex-col gap-md max-w-4xl mx-auto w-full min-h-[600px]"
    >
      <h2 className="font-h2 text-h2 text-on-surface border-b pb-sm">
        Strategic Documentation
      </h2>
      <div className="space-y-6 text-on-surface-variant font-body-md text-body-md leading-relaxed mt-2">
        <section>
          <h3 className="font-semibold text-on-surface text-lg mb-1">
            Organic Precision Lineage Specification
          </h3>
          <p>
            This blueprint represents automated trajectory inference derived from
            real-time BigQuery mapping. Paths reflect a minimum threshold
            statistical confidence of P &lt; 0.05 optimized over multi-touch
            conversion points.
          </p>
        </section>
        <section className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20">
          <h4 className="font-label text-label text-on-surface uppercase tracking-wider mb-2">
            Mathematical Node Bindings
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-data-sm font-data-sm">
            <li>Node 1 (Awareness): Fixed Baseline Integration</li>
            <li>Node 2 (Retargeting): Mid-Funnel Re-engagement Anchor</li>
            <li>Node 3 (Core): Active Production Baseline (Sage Green)</li>
            <li>
              Recommended Branch: Predictive Uplift Trajectory (Terracotta)
            </li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
};
