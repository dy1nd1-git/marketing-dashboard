import React, { Suspense } from "react";
import { MarketingProvider } from "@/src/context/MarketingContext";
import { InsightCartProvider } from "@/src/context/InsightCartContext";
import { InsightCartDrawer } from "@/src/components/dashboard/InsightCartDrawer";
import { SidebarShell } from "./components/SidebarShell";

export const dynamic = "force-dynamic";
/**
 * DashboardLayout: Server Component.
 * "use client" is NOT present here — sidebar state is isolated in SidebarShell.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MarketingProvider>
        <InsightCartProvider>
          <SidebarShell>{children}</SidebarShell>
          <InsightCartDrawer />
        </InsightCartProvider>
      </MarketingProvider>
    </Suspense>
  );
}
