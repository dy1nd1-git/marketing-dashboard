import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  apiClient,
  fetchMarketingData,
  fetchDashboardData,
  fetchPivotData,
  fetchMarketingDataMock,
  fetchDashboardDataMock,
  fetchPivotDataMock,
} from "./api";

describe("API Client Transformation & Formatting Engine (`src/lib/api.ts`)", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Keep test console clean during intentional fallback error testing
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchMarketingData", () => {
    it("returns formatted real API response data upon success", async () => {
      const mockResponse = [
        { id: "101", date: "2026-05-01", spend: 500, revenue: 1500, roas: 3.0 },
      ];
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockResponse });

      const data = await fetchMarketingData();
      expect(apiClient.get).toHaveBeenCalledWith("/api/marketing");
      expect(data).toEqual(mockResponse);
    });

    it("falls back gracefully to robust mock formatting when API throws", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValueOnce(new Error("Network Error"));

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
      const mockPayload = { 
        stats: { 
          revenue: 100, revenue_diff: 0, spend: 50, spend_diff: 0, 
          roas: 2, roas_diff: 0, conversions: 10, conv_diff: 0 
        }, 
        matrix: [] 
      };
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockPayload });

      const data = await fetchDashboardData();
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/marketing/dashboard");
      expect(data.kpis[0].value).toBe("$100");
    });

    it("returns fallback Organic Precision specs gracefully upon API rejection", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValueOnce(new Error("Timeout"));

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
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockPivot });

      const data = await fetchPivotData("pvt-99");
      expect(apiClient.get).toHaveBeenCalledWith("/api/pivot/pvt-99");
      expect(data).toEqual(mockPivot);
    });

    it("falls back to parameter-bound dynamic mock timeline generation upon failure", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValueOnce(new Error("500 Internal"));

      const data = await fetchPivotData("pvt-error");
      const expectedMock = await fetchPivotDataMock("pvt-error");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "API Error: falling back to mock pivot data"
      );
      expect(data.id).toBe("pvt-error");
      expect(data).toEqual(expectedMock);
    });
  });
});
