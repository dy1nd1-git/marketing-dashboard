"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useMarketingContext } from "@/src/context/MarketingContext";
import { useIsClient } from "@/src/hooks/useIsClient";
import { LoadingSpinner } from "@/src/components/dashboard/LoadingSpinner";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending } = useMarketingContext();
  const isClient = useIsClient();

  return (
    <div className="relative min-h-[calc(100vh-3rem)] w-full">
      <motion.div
        key={isClient ? "content" : "loading"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        {!isClient ? (
          <div className="h-[80vh] w-full flex flex-col items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          children
        )}
      </motion.div>

      {/* Overlay spinner when transitioning filters / segment updates */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#faf9f6]/40 backdrop-blur-[2px]"
          >
            <div className="flex flex-col items-center gap-3 bg-white border border-[#c1c8c2]/30 rounded-2xl p-6 shadow-md">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-[#87a996]/20 border-t-[#456555] animate-spin" />
                <div className="absolute inset-1.5 rounded-full border-4 border-[#ffca98]/20 border-t-[#d4a373] animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
              </div>
              <p className="text-[10px] font-bold tracking-widest text-[#727973] uppercase animate-pulse">
                Filtering Context...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
