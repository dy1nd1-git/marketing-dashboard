"use client";

import React, { createContext, useContext, ReactNode, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface MarketingContextType {
  segment: string;
  setSegment: (segment: string) => void;
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;
  isPending: boolean;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Purely derived state from URL parameters
  const segment = searchParams?.get("segment") || "Overall";
  
  // Default to last 30 days if not present
  const today = new Date();
  const defaultEnd = today.toISOString().split("T")[0];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const defaultStart = thirtyDaysAgo.toISOString().split("T")[0];

  const startDate = searchParams?.get("start") || defaultStart;
  const endDate = searchParams?.get("end") || defaultEnd;

  const updateParams = (updates: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.entries(updates).forEach(([key, value]) => {
      current.set(key, value);
    });
    
    const search = current.toString();
    const query = search ? `?${search}` : "";

    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  };

  const setSegment = (newSegment: string) => updateParams({ segment: newSegment });
  const setDateRange = (start: string, end: string) => updateParams({ start, end });

  return (
    <MarketingContext.Provider value={{ segment, setSegment, startDate, endDate, setDateRange, isPending }}>
      {children}
    </MarketingContext.Provider>
  );
};

export const useMarketingContext = () => {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error("useMarketingContext must be used within a MarketingProvider");
  }
  return context;
};
