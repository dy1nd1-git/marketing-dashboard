import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 gap-2 w-64 border-r border-slate-200/50 bg-[#FDFBF7] z-50">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
          <span className="material-symbols-outlined">explore</span>
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-none">
            Growth Engine
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Informed Exploration
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <a
          className="flex items-center gap-3 px-4 py-3 bg-white text-indigo-600 shadow-sm rounded-xl font-bold transition-transform duration-200 hover:translate-x-1"
          href="#"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dashboard
          </span>
          <span className="text-label-md">Overview</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform duration-200 hover:translate-x-1"
          href="#"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="text-label-md">Traffic</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform duration-200 hover:translate-x-1"
          href="#"
        >
          <span className="material-symbols-outlined">query_stats</span>
          <span className="text-label-md">Conversions</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform duration-200 hover:translate-x-1"
          href="#"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-label-md">ROI Analysis</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform duration-200 hover:translate-x-1"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-md">Settings</span>
        </a>
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-100">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-label-md">New Discovery</span>
        </button>
        <a
          className="flex items-center gap-3 px-4 py-3 mt-4 text-slate-500 hover:bg-slate-100 rounded-xl"
          href="#"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md">Help Center</span>
        </a>
      </div>
    </aside>
  );
};
