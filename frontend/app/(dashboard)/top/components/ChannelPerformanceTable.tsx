import React from "react";
import { ChannelStats } from "@/src/types/marketing";

interface ChannelPerformanceTableProps {
  channels: ChannelStats[];
}

export function ChannelPerformanceTable({ channels }: ChannelPerformanceTableProps) {
  return (
    <section className="card-professional !p-0 overflow-hidden">
      <div className="px-xl py-lg border-b border-stone-50 flex justify-between items-center">
        <h3 className="font-h2 text-xl text-on-surface">
          Channel Performance Deep Dive
        </h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl border border-stone-100 hover:bg-stone-50">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
          </button>
          <button className="p-2 rounded-xl border border-stone-100 hover:bg-stone-50">
            <span className="material-symbols-outlined text-sm">
              download
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                Channel
              </th>
              <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                Investment
              </th>
              <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                Revenue
              </th>
              <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline">
                Efficiency
              </th>
              <th className="px-xl py-md font-label text-xs uppercase tracking-widest text-outline text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {(channels || []).map((channel) => (
              <tr
                key={channel.id}
                className="hover:bg-stone-50/50 transition-colors group"
              >
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                      <span className="font-label text-xs font-bold text-primary">
                        {channel.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-label text-sm text-on-surface">
                        {channel.name}
                      </p>
                      <p className="text-xs text-outline">
                        {channel.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-xl py-lg font-data text-on-surface-variant">
                  ${channel.spend.toLocaleString()}
                </td>
                <td className="px-xl py-lg font-data text-on-surface-variant">
                  ${channel.revenue.toLocaleString()}
                </td>
                <td className="px-xl py-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(channel.roas * 10, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-data text-primary">
                      {channel.roas.toFixed(2)}x
                    </span>
                  </div>
                </td>
                <td className="px-xl py-lg text-right">
                  <button className="px-md py-2 bg-[#F5F4EE] text-primary-container rounded-full text-xs font-label hover:bg-primary-container hover:text-white transition-all duration-300">
                    Deep Dive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
