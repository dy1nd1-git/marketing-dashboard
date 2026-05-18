import React from "react";
import { fetchDailyCVR } from "../../../src/lib/api";
import { DailyAnalysisClient } from "./components/DailyAnalysisClient";

export default async function DailyDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const startDate = params.start_date as string | undefined;
  const endDate = params.end_date as string | undefined;

  console.log(`[Daily Analysis BFF] Fetching telemetry data for: ${startDate} to ${endDate}`);
  const { data, metadata } = await fetchDailyCVR(startDate, endDate);

  return (
    <DailyAnalysisClient
      key={`${startDate || ""}_${endDate || ""}`}
      initialData={data}
      initialMetadata={metadata}
    />
  );
}
