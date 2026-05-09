import React from "react";
import { PivotDetails } from "../../types/marketing";

interface MemoCardProps {
  details: PivotDetails;
  visible: boolean;
  x: number;
  y: number;
}

export const MemoCard: React.FC<MemoCardProps> = ({ details, visible, x, y }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-[#1A1A1A] border border-slate-700 rounded-md p-4 shadow-2xl w-80 duration-0"
      style={{
        left: `${x + 20}px`, // offset to the right of the point
        top: `${y - 100}px`, // offset slightly above the point
      }}
    >
      <div className="space-y-4">
        {/* Decision Memo */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Decision Memo</h4>
          <p className="text-sm text-slate-200 leading-relaxed">{details.memo.intent}</p>
        </div>

        {/* Consultant Diagnosis */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Consultant Diagnosis</h4>
          <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
            {details.memo.diagnosis.map((item, idx) => (
              <li key={idx} className="leading-snug">{item}</li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        <div className="pt-2 border-t border-slate-700">
          <p className="text-sm font-medium text-emerald-400">{details.memo.conclusion}</p>
        </div>
      </div>
    </div>
  );
};
