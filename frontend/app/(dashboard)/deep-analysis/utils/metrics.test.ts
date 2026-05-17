import { describe, it, expect } from "vitest";
import { extractMetricValue, mapToChartData, RawMetricRow } from "./metrics";

describe("Metrics Utility - extractMetricValue", () => {
  it("should extract CVR when CVR/コンバージョン is in the prompt", () => {
    const row: RawMetricRow = { cvr: 0.12, roas: 3.5, revenue: 1000 };
    expect(extractMetricValue(row, "コンバージョン率を分析して")).toBe(0.12);
  });

  it("should extract ROAS when ROAS is in the prompt", () => {
    const row: RawMetricRow = { cvr: 0.12, roas: 3.5, revenue: 1000 };
    expect(extractMetricValue(row, "ROAS showing down")).toBe(3.5);
  });

  it("should fall back to standard chains if no prompt keyword matches", () => {
    const row: RawMetricRow = { cvr: 0.12, roas: 3.5, revenue: 1000 };
    // roas should be evaluated first in standard fallback chain
    expect(extractMetricValue(row, "何でもいい質問")).toBe(3.5);
  });

  it("should fall back to cvr if roas is missing", () => {
    const row: RawMetricRow = { cvr: 0.15, revenue: 2000 };
    expect(extractMetricValue(row, "何でもいい質問")).toBe(0.15);
  });

  it("should scan arbitrary properties as a last resort if numeric", () => {
    const row: RawMetricRow = { date: "2026-05-15", custom_magic_val: 99.9 };
    expect(extractMetricValue(row, "何でもいい質問")).toBe(99.9);
  });
});

describe("Metrics Utility - mapToChartData", () => {
  it("should correctly map a list of raw rows to formatted chart items", () => {
    const rawData: RawMetricRow[] = [
      { date: "2026-05-15T00:00:00Z", cvr: 0.05, roas: 2.0 },
      { date: "2026-05-16T00:00:00Z", cvr: 0.06, roas: 2.5 },
    ];
    const chart = mapToChartData(rawData, "ROAS の推移");
    expect(chart).toHaveLength(2);
    expect(chart[0].name).toBe("May 15");
    expect(chart[0].value).toBe(2.0);
    expect(chart[1].name).toBe("May 16");
    expect(chart[1].value).toBe(2.5);
  });
});
