import React from "react";

interface KPICardProps {
  icon: string;
  iconColorClass: string;
  iconBgColorClass: string;
  label: string;
  value: string;
  trend: {
    label: string;
    icon?: string;
    colorClass: string;
    bgColorClass: string;
  };
  chartBarClass: string;
  chartGradientClass: string;
  chartData: number[];
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  iconColorClass,
  iconBgColorClass,
  label,
  value,
  trend,
  chartBarClass,
  chartGradientClass,
  chartData,
}) => {
  return (
    <div className="card-professional flex flex-col justify-between soft-pulse min-h-[170px]">
      <div className="flex justify-between items-start mb-lg">
        {/* Icon - Using solid container colors from globals.css */}
        <div
          className={`w-14 h-14 rounded-2xl ${iconBgColorClass} flex items-center justify-center transition-all duration-300`}
        >
          <span
            className={`material-symbols-outlined ${iconColorClass} text-2xl`}
          >
            {icon}
          </span>
        </div>

        {/* Trend Badge - Using solid container colors from globals.css */}
        <div
          className={`flex items-center gap-1.5 ${trend.colorClass} ${trend.bgColorClass} px-4 py-2 rounded-full font-data font-bold text-sm tracking-tight`}
        >
          {trend.icon && (
            <span className="material-symbols-outlined text-[16px]">
              {trend.icon}
            </span>
          )}
          {trend.label}
        </div>
      </div>

      <div className="mb-md">
        <p className="text-outline font-label text-[11px] uppercase tracking-[0.15em] mb-2 opacity-80">
          {label}
        </p>
        <h3 className="font-data text-3xl font-medium text-on-surface tracking-tighter leading-none">
          {value}
        </h3>
      </div>

      {/* Chart Area - Using solid tonal background from globals.css */}
      <div
        className={`h-16 w-full ${chartGradientClass} rounded-xl flex items-end p-1`}
      >
        <div className="w-full flex items-end justify-between gap-1 h-full px-1">
          {chartData.map((height, idx) => {
            return (
              <div
                key={idx}
                className={`${chartBarClass} w-full rounded-t-[2px]`}
                style={{ height: `${height}%` }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
