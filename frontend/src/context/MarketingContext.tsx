"use client";

import React, { createContext, useContext, ReactNode, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface MarketingContextType {
  segment: string;
  setSegment: (segment: string) => void;
  isPending: boolean;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Purely derived state from URL parameters to avoid useEffect synchronization
  const segment = searchParams?.get("segment") || "Overall";

  const setSegment = (newSegment: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    current.set("segment", newSegment);
    
    const search = current.toString();
    const query = search ? `?${search}` : "";

    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  };

  return (
    <MarketingContext.Provider value={{ segment, setSegment, isPending }}>
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
