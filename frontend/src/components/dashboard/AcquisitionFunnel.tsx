import React from "react";
import { FunnelLayerData } from "../../types/marketing";

export interface AcquisitionFunnelProps {
  data: FunnelLayerData[];
}

export const AcquisitionFunnel: React.FC<AcquisitionFunnelProps> = ({
  data,
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(71,85,105,0.05)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-h3">Acquisition Funnel</h3>
        <div className="flex items-center gap-2 text-slate-400 text-label-sm">
          <span className="w-3 h-3 bg-indigo-600 rounded-sm"></span> High
          Retention
        </div>
      </div>
      <div className="space-y-6 relative">
        {data.map((layer, index) => (
          <div key={index} className="relative group flex justify-center">
            <div
              className={`${layer.widthClass} h-16 ${layer.colorClassMain} rounded-xl flex items-center px-6 transition-all ${layer.colorClassHover}`}
            >
              <div className="flex-1">
                <div
                  className={`text-label-sm ${layer.textSubClass} uppercase tracking-wider`}
                >
                  {layer.label}
                </div>
                <div
                  className={`text-label-md font-bold ${layer.textMainClass}`}
                >
                  {layer.value}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-label-sm ${layer.textSubClass}`}>
                  {layer.metricLabel}
                </div>
                <div
                  className={`text-label-md font-bold ${
                    layer.textMainClass === "text-white"
                      ? "text-white"
                      : "text-indigo-600"
                  }`}
                >
                  {layer.metricValue}
                </div>
              </div>
            </div>
            {layer.dropValue && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-error text-label-sm font-bold bg-error-container/20 px-2 py-1 rounded-lg">
                {layer.dropValue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
