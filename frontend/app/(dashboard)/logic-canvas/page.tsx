'use client';

import React from 'react';
import Image from 'next/image';

export default function LogicCanvasPage() {
  return (
    <div className="p-container-padding flex flex-col gap-xl">
      {/* Canvas Header */}
      <div className="grid grid-cols-12 gap-gutter items-center">
        <div className="col-span-3 flex items-center gap-md">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <div className="font-h2 text-h2 text-on-surface">ROI: 342%</div>
            <div className="font-label text-label text-primary">Goal: 85%</div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="bg-surface-container-lowest rounded-2xl p-md border border-outline-variant/20 shadow-[0_4px_30px_rgba(69,101,85,0.05)] flex items-center gap-md relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-l-2xl"></div>
            <span className="material-symbols-outlined text-primary ml-sm">auto_awesome</span>
            <p className="font-body-md text-body-md text-on-surface-variant flex-1">Early signs of conversion lift in organic channels.</p>
          </div>
        </div>
        <div className="col-span-3 flex justify-end items-center gap-md">
          <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/30">
            <button className="px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm font-label text-label text-on-surface">Canvas</button>
            <button className="px-4 py-2 rounded-full font-label text-label text-on-surface-variant hover:text-on-surface">Document</button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 gap-gutter flex-1 items-stretch">
        {/* Central Logistics Genealogy HUD */}
        <div className="col-span-8 bg-surface-container-lowest rounded-2xl shadow-[0_8px_40px_rgba(69,101,85,0.08)] border border-surface-variant relative overflow-hidden flex flex-col p-xl min-h-[600px]">
          {/* Background Faint Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #c1c8c2 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
          
          {/* Title */}
          <h3 className="font-h2 text-h2 text-on-surface relative z-10 mb-xl">Genealogy HUD</h3>
          
          {/* Vector Paths Container */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
            {/* Path A (Current) - Thick Sage */}
            <path className="stroke-primary" d="M 150,500 Q 150,300 400,250 T 700,100" fill="none" strokeLinecap="round" strokeWidth="6"></path>
            {/* Path B (AI Recommended) - Terracotta Dashed */}
            <path className="stroke-[#D4A373]" d="M 450,500 Q 450,350 600,200 T 800,150" fill="none" strokeDasharray="8 8" strokeLinecap="round" strokeWidth="4"></path>
          </svg>
          
          {/* Floating Insight Bubbles */}
          <div className="relative z-10 flex-1 w-full h-full">
            <div className="absolute top-[120px] left-[10%] max-w-[320px] bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-lg border border-outline-variant/30 shadow-[0_12px_40px_rgba(125,86,45,0.1)]">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-[#D4A373] text-[18px]">lightbulb</span>
                <span className="font-label text-label text-[#D4A373] uppercase tracking-wider">Advisor</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Current trajectory mirrors the 2023 Spring Campaign success. Recommend shifting 15% budget to Plan B for optimal ROI.
              </p>
            </div>
          </div>
          
          {/* Bottom Source Icons */}
          <div className="relative z-10 mt-auto flex justify-between items-end px-xl pt-xl border-t border-surface-variant border-dashed">
            <div className="flex flex-col items-center gap-sm">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center border border-outline-variant/30 shadow-sm relative group cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">database</span>
                <div className="absolute -top-2 w-1 h-8 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              </div>
              <span className="font-data-sm text-data-sm text-on-surface-variant">BigQuery</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center border border-outline-variant/30 shadow-sm relative group cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">analytics</span>
                <div className="absolute -top-2 w-1 h-12 bg-primary rounded-full"></div>
              </div>
              <span className="font-data-sm text-data-sm text-on-surface-variant">GA4 Core</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center border border-outline-variant/30 shadow-sm relative group cursor-pointer hover:border-[#D4A373] transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">hub</span>
                <div className="absolute -top-2 w-1 h-6 bg-[#D4A373] rounded-full"></div>
              </div>
              <span className="font-data-sm text-data-sm text-on-surface-variant">Social Graph</span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="col-span-4 flex flex-col gap-lg">
          {/* Summary Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-surface-variant">
            <div className="flex items-center gap-md mb-lg">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">strategy</span>
              <h4 className="font-label text-label text-on-surface uppercase tracking-widest">Strategy Shift</h4>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Reallocating resources towards organic social nodes shows a high probability of compounding returns over the next quarter.
            </p>
            {/* Decorative Graphic Image */}
            <div className="w-full h-40 bg-surface-container rounded-2xl overflow-hidden relative mb-lg">
              <Image 
                alt="Abstract Data Visualization" 
                className="mix-blend-multiply opacity-80 object-cover"
                fill
                unoptimized
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmZ1nVtAo2ZX7gv89zuPHWteAF3BYB2b32CgBpJF-SJXc2rkGcFB93Mtb_evhUiYkaQY_fbYcIgRJ4Ng-hzq-QX7w58xUtaYPKL4wEyB3TZmmvmw83JgWVhVYJ6wPcbbzkNHe_42CY0BCSt3UHEe0OkK78V78_RrKtCiqPlw1JwLion-RrpBlSQgYGMXhTziUWsxeZ-fjSh4tLYsrVeiwDNK0vELICZEovKp4VCsn6I-3NhtKwACNn3nZ2uVsCullrm_tellzMijfW" 
              />
            </div>
          </div>
          
          {/* Logic Evidence Card */}
          <div className="bg-surface-container-low rounded-2xl p-lg flex-1 border border-outline-variant/20">
            <h4 className="font-label text-label text-on-surface-variant uppercase tracking-widest mb-md">Logic Evidence</h4>
            <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant overflow-x-auto">
              <pre className="font-data-sm text-data-sm text-primary"><code>{`// Statistical Significance
P < 0.05, r = 0.82

// Extraction Query
SELECT 
    roi, conversion_rate 
FROM 
    campaign_data 
WHERE 
    channel = 'organic' 
    AND quarter = 'Q3'
ORDER BY 
    impact DESC;`}</code></pre>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-xl flex items-center justify-between px-10 bg-[#FDFCF8]/95 dark:bg-stone-950/95 h-24 border-t border-stone-100 dark:border-stone-800 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-2xl">
        <div className="font-['Manrope'] font-bold uppercase tracking-widest text-xs text-[#87A996]">
            © 2024 Logic Canvas Organic Precision
        </div>
        <div className="flex items-center gap-6 justify-end px-10">
          <button className="px-8 py-4 rounded-2xl border-2 border-[#D4A373] text-[#D4A373] font-label text-label hover:bg-[#D4A373]/5 transition-colors uppercase tracking-widest">
            ADD TO CART
          </button>
          <button className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-label text-label shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest">
            APPROVE ACTION
          </button>
        </div>
      </footer>
    </div>
  );
}
