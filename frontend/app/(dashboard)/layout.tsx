"use client";

import React, { useState } from "react";
import { Sidebar } from "../../src/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-[300px]"}`}>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </>
  );
}
