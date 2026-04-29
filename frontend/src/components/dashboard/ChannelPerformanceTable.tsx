import React from "react";
import { ChannelPerformance } from "../../types/marketing";

export interface ChannelPerformanceTableProps {
  data: ChannelPerformance[];
}

export const ChannelPerformanceTable: React.FC<ChannelPerformanceTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(71,85,105,0.05)] border border-slate-50 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-h3">Channel Performance</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-label-md hover:bg-slate-100">
            Filter
          </button>
          <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-label-md hover:bg-slate-100">
            Sort By ROI
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-label-sm text-slate-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-8 py-4 text-label-sm text-slate-500 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-8 py-4 text-label-sm text-slate-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-8 py-4 text-label-sm text-slate-500 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-8 py-4 text-label-sm text-slate-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((channel) => {
              let iconBg = "";
              let iconText = "";
              let roasBg = "";
              let roasText = "";
              let barClasses: string[] = [];

              if (channel.color === "indigo") {
                iconBg = "bg-indigo-100";
                iconText = "text-indigo-600";
                roasBg = "bg-secondary-container/20";
                roasText = "text-on-secondary-container";
                barClasses = ["bg-indigo-200 h-1/2", "bg-indigo-300 h-2/3", "bg-indigo-500 h-full"];
              } else if (channel.color === "slate") {
                iconBg = "bg-orange-100";
                iconText = "text-orange-600";
                roasBg = "bg-slate-100";
                roasText = "text-slate-600";
                barClasses = ["bg-slate-200 h-full", "bg-slate-300 h-2/3", "bg-slate-400 h-1/2"];
              } else if (channel.color === "green") {
                iconBg = "bg-green-100";
                iconText = "text-green-600";
                roasBg = "bg-secondary-container/20";
                roasText = "text-on-secondary-container";
                barClasses = ["bg-green-200 h-1/2", "bg-green-400 h-3/4", "bg-green-600 h-full"];
              }

              return (
                <tr key={channel.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconText} font-bold`}>
                        {channel.icon}
                      </div>
                      <div>
                        <div className="text-label-md text-slate-800">
                          {channel.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {channel.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-label-md">{channel.spend}</td>
                  <td className="px-8 py-6 text-label-md">{channel.revenue}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 ${roasBg} ${roasText} rounded-full text-label-sm`}>
                      {channel.roas}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1 items-end h-6 w-20">
                      {barClasses.map((cls, idx) => (
                        <div key={idx} className={`${cls.split(" ")[0]} w-full ${cls.split(" ")[1]} rounded-t-sm`}></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-primary text-label-md font-bold flex items-center gap-1 ml-auto hover:underline">
                      Deep Dive{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
