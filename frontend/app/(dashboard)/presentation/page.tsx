"use client";

import dynamic from "next/dynamic";
import { DashboardPageLoading } from "../../../src/components/dashboard/DashboardPageLoading";

const PresentationDeckPage = dynamic(() => import("./PresentationDeckPageClient"), {
  ssr: false,
  loading: () => <DashboardPageLoading />,
});

export default function Page() {
  return <PresentationDeckPage />;
}
