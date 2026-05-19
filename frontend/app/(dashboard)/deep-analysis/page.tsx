"use client";

import dynamic from "next/dynamic";
import { DashboardPageLoading } from "../../../src/components/dashboard/DashboardPageLoading";

const DeepAnalysisPage = dynamic(() => import("./DeepAnalysisPageClient"), {
  ssr: false,
  loading: () => <DashboardPageLoading />,
});

export default function Page() {
  return <DeepAnalysisPage />;
}
