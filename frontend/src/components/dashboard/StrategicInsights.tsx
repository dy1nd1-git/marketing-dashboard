import React from "react";
import { InsightData } from "../../types/marketing";

export interface StrategicInsightsProps {
  data: InsightData[];
}

export const StrategicInsights: React.FC<StrategicInsightsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <h3 className="text-h3">AI Strategic Insights</h3>
      </div>
      {data.map((insight, index) => {
        let bgClass = "";
        let borderClass = "";
        let textClass = "";
        let iconBgClass = "";

        if (insight.type === "success") {
          bgClass = "bg-primary/5";
          borderClass = "border-primary";
          textClass = "text-primary";
          iconBgClass = "bg-primary";
        } else if (insight.type === "warning") {
          bgClass = "bg-error-container/20";
          borderClass = "border-error";
          textClass = "text-error";
          iconBgClass = "bg-error";
        } else if (insight.type === "info") {
          bgClass = "bg-secondary-container/10";
          borderClass = "border-secondary";
          textClass = "text-secondary";
          iconBgClass = "bg-secondary";
        }

        return (
          <div
            key={index}
            className={`${bgClass} border-l-4 ${borderClass} p-6 rounded-2xl relative overflow-hidden`}
          >
            <div className="flex items-start gap-4">
              <div className={`${iconBgClass} rounded-xl p-2 text-white`}>
                <span className="material-symbols-outlined text-sm">
                  {insight.icon}
                </span>
              </div>
              <div>
                <h4 className={`text-label-md ${textClass}`}>{insight.title}</h4>
                <p className="text-body-md text-slate-700 mt-2">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
