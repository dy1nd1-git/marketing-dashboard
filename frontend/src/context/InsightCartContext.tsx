"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface InsightItem {
  id: string;
  title: string;
  type: "chart" | "kpi" | "funnel" | "anomaly" | "table" | "general";
  metricsSummary: string;
  sourceRef: string;
  notes?: string;
  timestamp: string;
  chartPayload?: Record<string, unknown>[];
}

interface InsightCartContextType {
  items: InsightItem[];
  addInsight: (item: Omit<InsightItem, "id" | "timestamp">) => void;
  removeInsight: (id: string) => void;
  clearCart: () => void;
}

const InsightCartContext = createContext<InsightCartContextType | undefined>(undefined);

export const InsightCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InsightItem[]>([]);

  // Restore cart state safely from client localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mellow_insight_cart");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignored gracefully
    }
  }, []);

  // Save cart modifications persisting locally
  const saveItems = (newItems: InsightItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("mellow_insight_cart", JSON.stringify(newItems));
    } catch {
      // Ignored gracefully
    }
  };

  const addInsight = (item: Omit<InsightItem, "id" | "timestamp">) => {
    const newItem: InsightItem = {
      ...item,
      id: `insight_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    saveItems([...items, newItem]);
  };

  const removeInsight = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    saveItems([]);
  };

  return (
    <InsightCartContext.Provider value={{ items, addInsight, removeInsight, clearCart }}>
      {children}
    </InsightCartContext.Provider>
  );
};

export const useInsightCart = (): InsightCartContextType => {
  const context = useContext(InsightCartContext);
  if (!context) {
    throw new Error("useInsightCart must be used within an InsightCartProvider");
  }
  return context;
};
