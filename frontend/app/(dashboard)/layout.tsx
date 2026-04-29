import React from "react";
import { Sidebar } from "../../src/components/layout/Sidebar";
import { TopAppBar } from "../../src/components/layout/TopAppBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <TopAppBar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </>
  );
}
