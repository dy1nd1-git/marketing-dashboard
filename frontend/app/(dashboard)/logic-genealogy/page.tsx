"use client";

import dynamic from "next/dynamic";
import { DashboardPageLoading } from "../../../src/components/dashboard/DashboardPageLoading";

const LogicCanvasPage = dynamic(() => import("./LogicCanvasPage"), {
  ssr: false,
  loading: () => <DashboardPageLoading />,
});

export default function Page() {
  return <LogicCanvasPage />;
}
