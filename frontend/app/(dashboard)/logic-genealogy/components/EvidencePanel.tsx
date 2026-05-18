"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StrategyNode } from "../../../../src/types/genealogy";

interface EvidencePanelProps {
  selectedNode: StrategyNode;
  onApprove: () => void;
  isApproving: boolean;
  optimisticApproved: boolean;
  onAddToCart: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  selectedNode,
  onApprove,
  isApproving,
  optimisticApproved,
  onAddToCart,
}) => {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
      {/* Active Strategy Card Container */}
      <motion.div
        key={`side-card-${selectedNode.id}`}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30 flex flex-col relative overflow-hidden"
      >
        <div className="flex items-center gap-md mb-md">
          <span
            className={`material-symbols-outlined p-2 rounded-xl ${
              selectedNode.type === "recommended"
                ? "bg-[#D4A373]/15 text-[#D4A373]"
                : "bg-primary/10 text-primary"
            }`}
          >
            strategy
          </span>
          <h4
            className={`font-label text-label uppercase tracking-widest ${
              selectedNode.type === "recommended"
                ? "text-[#D4A373]"
                : "text-primary"
            }`}
          >
            {selectedNode.type === "recommended"
              ? "Recommended Shift"
              : "Current Rationale"}
          </h4>
        </div>

        <h3 className="font-h2 text-h2 text-on-surface mb-2">
          {selectedNode.label}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-lg">
          {selectedNode.insight}
        </p>

        {/* Decorative Premium Graphic Overlay Image */}
        <div className="w-full h-36 bg-surface-container-low rounded-xl overflow-hidden relative mb-4 border border-outline-variant/20">
          <Image
            alt="Strategy Narrative Matrix"
            className="mix-blend-multiply opacity-75 object-cover"
            fill
            unoptimized
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmZ1nVtAo2ZX7gv89zuPHWteAF3BYB2b32CgBpJF-SJXc2rkGcFB93Mtb_evhUiYkaQY_fbYcIgRJ4Ng-hzq-QX7w58xUtaYPKL4wEyB3TZmmvmw83JgWVhVYJ6wPcbbzkNHe_42CY0BCSt3UHEe0OkK78V78_RrKtCiqPlw1JwLion-RrpBlSQgYGMXhTziUWsxeZ-fjSh4tLYsrVeiwDNK0vELICZEovKp4VCsn6I-3NhtKwACNn3nZ2uVsCullrm_tellzMijfW"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/90 backdrop-blur-xs rounded-lg p-2 text-center border border-outline-variant/30">
            <span className="font-data-sm text-xs font-semibold text-on-surface">
              Projected Metric Yield: ROI {selectedNode.roi}
            </span>
          </div>
        </div>

        {/* Execution Actions inside AI Strategic Card */}
        <div className="flex items-center gap-3 mt-2 w-full">
          <button
            onClick={onAddToCart}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#D4A373] text-[#D4A373] font-label text-xs hover:bg-[#D4A373]/5 transition-colors uppercase tracking-wider text-center font-bold"
          >
            Add to Cart
          </button>
          <button
            onClick={onApprove}
            disabled={isApproving || optimisticApproved}
            className={`flex-1 px-4 py-2.5 rounded-xl font-label text-xs uppercase tracking-wider shadow-sm transition-all duration-300 flex items-center justify-center gap-2 font-bold ${
              optimisticApproved
                ? "bg-primary-container text-white cursor-default"
                : "bg-primary text-on-primary hover:shadow-md hover:scale-[1.01]"
            } ${isApproving ? "opacity-75 cursor-wait" : ""}`}
          >
            {isApproving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing...
              </>
            ) : optimisticApproved ? (
              <>
                <span className="material-symbols-outlined text-sm">check</span>
                Approved
              </>
            ) : (
              "Approve Action"
            )}
          </button>
        </div>
      </motion.div>

      {/* Underlying BigQuery SQL Query Exposure block */}
      <div className="bg-surface-container-low rounded-2xl p-lg flex-1 border border-outline-variant/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-label text-label text-outline uppercase tracking-widest">
              Logic Evidence SQL
            </h4>
            <span className="font-label text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
              P &lt; 0.05 Sig.
            </span>
          </div>
          <p className="font-body-sm text-xs text-outline mb-3">
            Direct translation trace from core storage layer ensures predictive
            non-black-box auditing.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 overflow-x-auto my-auto shadow-inner custom-scrollbar">
          <pre className="font-mono text-xs text-primary leading-relaxed">
            <code>{selectedNode.sql}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
