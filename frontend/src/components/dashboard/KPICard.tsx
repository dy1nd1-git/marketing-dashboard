import React from "react";

export interface KPICardProps {
  title: string;
  value: string;
  trendIcon: string;
  trendValue: string;
  trendBgClass: string;
  trendTextClass: string;
  barClasses: string[];
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trendIcon,
  trendValue,
  trendBgClass,
  trendTextClass,
  barClasses,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_20px_rgba(71,85,105,0.05)] border border-slate-50">
      <div className="flex justify-between items-start mb-4">
        <span className="text-label-md text-slate-500">{title}</span>
        <span
          className={`${trendBgClass} ${trendTextClass} text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1`}
        >
          <span className="material-symbols-outlined text-xs">
            {trendIcon}
          </span>{" "}
          {trendValue}
        </span>
      </div>
      <div className="text-h2">{value}</div>
      <div className="mt-4 h-12 w-full flex items-end gap-1">
        {barClasses.map((cls, index) => (
          <div key={index} className={`flex-1 rounded-t-sm ${cls}`}></div>
        ))}
      </div>
    </div>
  );
};
