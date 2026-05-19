"use client";

import React, { useState, Suspense } from "react";
import { Sidebar } from "../../src/components/layout/Sidebar";
import { MarketingProvider } from "../../src/context/MarketingContext";
import { InsightCartProvider } from "../../src/context/InsightCartContext";
import { InsightCartDrawer } from "../../src/components/dashboard/InsightCartDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MarketingProvider>
        <InsightCartProvider>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main
            className={`min-h-screen flex flex-col transition-all duration-300 print:ml-0 print:block print:w-full ${
              isSidebarCollapsed ? "ml-20" : "ml-[300px]"
            }`}
          >
            <div className="flex-1 p-6 print:p-0 overflow-x-hidden print:overflow-visible">
              {children}
            </div>
          </main>
          <InsightCartDrawer />
        </InsightCartProvider>
      </MarketingProvider>
    </Suspense>
  );
}
