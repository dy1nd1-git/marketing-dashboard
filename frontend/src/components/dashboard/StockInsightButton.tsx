"use client";

import React, { useState } from "react";
import { useInsightCart, InsightItem } from "../../context/InsightCartContext";

interface StockInsightButtonProps {
  item: Omit<InsightItem, "id" | "timestamp">;
  className?: string;
  variant?: "icon" | "full" | "minimal";
}

export const StockInsightButton: React.FC<StockInsightButtonProps> = ({
  item,
  className = "",
  variant = "full",
}) => {
  const { addInsight } = useInsightCart();
  const [isStocked, setIsStocked] = useState(false);

  const handleStock = (e: React.MouseEvent) => {
    e.stopPropagation();
    addInsight(item);
    setIsStocked(true);
    setTimeout(() => setIsStocked(false), 2000);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleStock}
        aria-label="Stock to presentation deck"
        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
          isStocked
            ? "bg-secondary text-on-secondary border-secondary scale-110"
            : "bg-surface-container-lowest text-outline hover:text-primary hover:border-primary/40 border-outline-variant/30"
        } ${className}`}
        title="Add to Insight Cart Deck"
      >
        <span className="material-symbols-outlined text-sm transition-transform">
          {isStocked ? "check" : "add_shopping_cart"}
        </span>
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        onClick={handleStock}
        className={`text-xs font-label flex items-center gap-1 transition-colors cursor-pointer ${
          isStocked ? "text-secondary font-bold" : "text-outline hover:text-primary"
        } ${className}`}
      >
        <span className="material-symbols-outlined text-xs">
          {isStocked ? "check" : "add_shopping_cart"}
        </span>
        <span>{isStocked ? "Stocked!" : "Stock"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleStock}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-label flex items-center gap-1.5 transition-all cursor-pointer border ${
        isStocked
          ? "bg-secondary text-on-secondary border-secondary font-bold shadow-2xs scale-105"
          : "bg-surface-container-lowest text-outline hover:text-primary hover:border-primary/40 border-outline-variant/30"
      } ${className}`}
    >
      <span className="material-symbols-outlined text-xs">
        {isStocked ? "check" : "add_shopping_cart"}
      </span>
      <span>{isStocked ? "Stocked to Palette" : "Add to Cart"}</span>
    </button>
  );
};
