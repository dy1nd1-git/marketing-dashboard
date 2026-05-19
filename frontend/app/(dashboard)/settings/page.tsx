import React from "react";

export default function SettingsPage() {
  return (
    <main className="p-xl max-w-[1400px]">
      {/* Header & Breadcrumbs Section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/20 print:hidden mb-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">
              settings
            </span>
            <h1 className="text-[36px] font-semibold text-on-surface tracking-tight leading-none shrink-0">
              Settings
            </h1>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-medium tracking-wide shrink-0">
              System
            </span>
          </div>
          <p className="text-body-md text-outline">
            Manage your account telemetry constraints and system preferences.
          </p>
        </div>
      </section>

      {/* Main Settings Card */}
      <section className="card-professional p-xl max-w-2xl bg-white shadow-[0_20px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 rounded-3xl mt-lg">
        <h3 className="font-h2 text-xl text-on-surface mb-md">Account & Integrations</h3>
        <p className="text-sm text-outline leading-relaxed">
          Configure external BigQuery parameters, pipeline limits, and dashboard aesthetics here.
        </p>
      </section>
    </main>
  );
}
