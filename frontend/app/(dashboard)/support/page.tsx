import React from "react";

export default function SupportPage() {
  return (
    <main className="p-xl max-w-[1400px]">
      {/* Header & Breadcrumbs Section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/20 print:hidden mb-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">
              help
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none shrink-0">
              Support
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide shrink-0">
              Help Desk
            </span>
          </div>
          <p className="text-body-md text-outline">
            Get professional assistance with your marketing telemetry insights.
          </p>
        </div>
      </section>

      {/* Main Support Card */}
      <section className="card-professional p-xl max-w-2xl bg-white shadow-[0_20px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 rounded-3xl mt-lg">
        <h3 className="font-h2 text-xl text-on-surface mb-md">Need Help?</h3>
        <p className="text-sm text-outline leading-relaxed">
          Contact our specialist team to troubleshoot API latencies or metric discrepancies.
        </p>
      </section>
    </main>
  );
}
