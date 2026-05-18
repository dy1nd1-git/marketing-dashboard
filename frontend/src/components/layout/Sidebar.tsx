"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Top", path: "/top", icon: "home" },
    { name: "Daily Analysis", path: "/daily-analysis", icon: "insert_chart" },
    { name: "Deep Analysis", path: "/deep-analysis", icon: "troubleshoot" },
    { name: "Logic Genealogy", path: "/logic-genealogy", icon: "account_tree" },
    { name: "Presentation Master", path: "/presentation", icon: "co_present" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col transition-all duration-300 border-r border-surface-container bg-surface z-50 print:hidden ${isCollapsed ? "w-20" : "w-[300px]"}`}
    >
      {/* Brand Logo Section */}
      <div
        className={`p-6 flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between"}`}
      >
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              explore
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-primary mb-1 leading-none">
                Decision Tracer
              </h1>
              <p className="text-[10px] font-label uppercase tracking-widest text-outline">
                Marketing Suite
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 flex items-center justify-center text-primary hover:bg-primary-container/20 rounded-xl transition-colors cursor-pointer ${isCollapsed ? "w-10 h-10 bg-primary-container/10" : "w-8 h-8"}`}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? "menu" : "chevron_left"}
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 space-y-2 mt-4 ${isCollapsed ? "px-2" : "px-4"}`}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname?.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 py-3 rounded-xl font-semibold transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "text-on-primary-container bg-primary-container/30 border-r-4 border-primary" : "text-stone-500 hover:text-primary hover:bg-primary-container/10 border-r-4 border-transparent"}`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive
                    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-label whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className={`space-y-2 mb-4 ${isCollapsed ? "px-2" : "px-4"}`}>
        <Link
          className={`flex items-center gap-3 py-3 rounded-xl text-stone-500 hover:text-primary transition-all duration-300 border-r-4 border-transparent ${isCollapsed ? "justify-center px-0" : "px-4"}`}
          href="/settings"
        >
          <span className="material-symbols-outlined">settings</span>
          {!isCollapsed && (
            <span className="text-label whitespace-nowrap">Settings</span>
          )}
        </Link>
        <Link
          className={`flex items-center gap-3 py-3 rounded-xl text-stone-500 hover:text-primary transition-all duration-300 border-r-4 border-transparent ${isCollapsed ? "justify-center px-0" : "px-4"}`}
          href="/support"
        >
          <span className="material-symbols-outlined">help</span>
          {!isCollapsed && (
            <span className="text-label whitespace-nowrap">Support</span>
          )}
        </Link>
      </div>

      {/* Primary Action */}
      <div
        className={`border-t border-surface-container ${isCollapsed ? "p-4 flex justify-center" : "p-6"}`}
      >
        <button
          className={`bg-primary text-white py-3 rounded-2xl font-label flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-primary/10 ${isCollapsed ? "w-12 h-12 rounded-full p-0" : "w-full"}`}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {!isCollapsed && (
            <span className="whitespace-nowrap">New Analysis</span>
          )}
        </button>
      </div>
    </aside>
  );
};
