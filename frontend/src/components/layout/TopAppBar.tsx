import React from "react";

export const TopAppBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0px_4px_20px_rgba(71,85,105,0.05)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-label-md">Campaigns</span>
          <span className="material-symbols-outlined text-slate-300 text-sm">
            chevron_right
          </span>
          <div className="bg-surface-container-highest px-3 py-1 rounded-full flex items-center gap-2">
            <span className="text-primary text-label-sm">April 2026</span>
            <span className="text-slate-400 text-xs">&gt;</span>
            <span className="text-primary text-label-sm">Week 3</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button className="px-4 py-1.5 text-label-sm text-slate-500">
            7d
          </button>
          <button className="px-4 py-1.5 text-label-sm bg-white text-primary rounded-lg shadow-sm font-bold">
            30d
          </button>
          <button className="px-4 py-1.5 text-label-sm text-slate-500">
            90d
          </button>
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-slate-600">
            Compare to Previous
          </span>
          <button className="w-10 h-5 bg-primary-container rounded-full relative">
            <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-label-md text-slate-700 hover:bg-slate-50">
            <span className="material-symbols-outlined text-base">
              ios_share
            </span>
            <span>Export</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <a
              className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg text-label-md text-slate-700"
              href="#"
            >
              <span className="material-symbols-outlined text-indigo-500">
                auto_awesome
              </span>{" "}
              Genspark Prompt
            </a>
            <a
              className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg text-label-md text-slate-700"
              href="#"
            >
              <span className="material-symbols-outlined text-orange-500">
                slideshow
              </span>{" "}
              Google Slides
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
