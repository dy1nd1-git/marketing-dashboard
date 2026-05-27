"use client";

import React, { useState } from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";

/**
 * SidebarShell: Isolates sidebar collapse state as a client component leaf.
 * This allows layout.tsx to remain a Server Component.
 */
export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
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
    </>
  );
}
