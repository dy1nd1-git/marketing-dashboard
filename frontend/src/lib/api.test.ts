import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchMarketingData,
  fetchDashboardData,
  fetchPivotData,
  fetchDailyCVR,
  fetchMarketingDataMock,
  fetchDashboardDataMock,
  fetchPivotDataMock,
} from "./api";

describe("API Client Transformation & Formatting Engine (`src/lib/api.ts`)", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Keep test console clean during intentional fallback error testing
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("fetchMarketingData", () => {
    it("returns formatted real API response data upon success", async () => {
      const mockResponse = [
        { id: "101", date: "2026-05-01", spend: 500, revenue: 1500, roas: 3.0 },
      ];
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await fetchMarketingData();
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/marketing");
      expect(data).toEqual(mockResponse);
    });

    it("falls back gracefully to robust mock formatting when API throws", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network Error"));

      const data = await fetchMarketingData();
      const expectedMock = await fetchMarketingDataMock();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "API Error: falling back to mock data"
      );
      expect(data).toEqual(expectedMock);
    });
  });

  describe("fetchDashboardData", () => {
    it("returns dashboard JSON payloads unchanged when HTTP OK", async () => {
      const mockResponse = {
        stats: {
          revenue: 1000,
          revenue_diff: 10,
          spend: 500,
          spend_diff: 5,
          roas: 2.0,
          roas_diff: 0,
          conversions: 100,
          conv_diff: 0,
        },
        matrix: [],
        funnel: [],
        channels: [],
        insights: [],
      };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await fetchDashboardData();
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/v1/marketing/dashboard");
      expect(data.kpis[0].value).toBe("$1,000");
    });

    it("returns fallback Organic Precision specs gracefully upon API rejection", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Timeout"));

      const data = await fetchDashboardData();
      const expectedMock = await fetchDashboardDataMock();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "API Error: falling back to mock dashboard data",
        expect.anything()
      );
      expect(data.kpis.length).toBe(4);
      expect(data.kpis[0].title).toBe("Revenue");
      expect(data).toEqual(expectedMock);
    });
  });

  describe("fetchPivotData", () => {
    it("fetches target pivot logs by dynamic path binding", async () => {
      const mockPivot = { id: "pvt-99", pivotDate: "2026-05-10", timeline: [] };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockPivot,
      } as Response);

      const data = await fetchPivotData("pvt-99");
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/pivot/pvt-99");
      expect(data).toEqual(mockPivot);
    });

    it("falls back to parameter-bound dynamic mock timeline generation upon failure", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("500 Internal"));

      const data = await fetchPivotData("pvt-error");
      const expectedMock = await fetchPivotDataMock("pvt-error");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "API Error: falling back to mock pivot data"
      );
      expect(data.id).toBe("pvt-error");
      expect(data).toEqual(expectedMock);
    });
  });

  describe("fetchDailyCVR", () => {
    it("fetches daily CVR dynamic metric streams upon success", async () => {
      const mockTelemetry = {
        data: [{ date: "2026-05-15", revenue: 5000, spend: 1000, roas: 5.0, ctr: 0.05, cvr: 0.1 }],
        metadata: { engine: "Decision-Tracer-BQ-v1", confidence: "High" },
      };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockTelemetry,
      } as Response);

      const data = await fetchDailyCVR();
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/v1/marketing/daily-cvr");
      expect(data).toEqual(mockTelemetry);
    });

    it("falls back to empty array and default metadata upon failure", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Database offline"));

      const data = await fetchDailyCVR();
      expect(data.data).toEqual([]);
      expect(data.metadata.engine).toBe("Decision-Tracer-BQ-Fallback-v1");
    });
  });
});
