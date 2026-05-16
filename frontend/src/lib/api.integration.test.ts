import { describe, it, expect, vi } from "vitest";
import { fetchDashboardData, apiClient } from "./api";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return {
    ...actual,
    // We want to keep most of it, but maybe mock the apiClient specifically
  };
});

describe("fetchDashboardData Error Handling & Validation", () => {
  it("should fall back to mock data when API returns malformed JSON (missing funnel)", async () => {
    // Force apiClient.get to return malformed data
    const spy = vi.spyOn(apiClient, "get").mockResolvedValue({
      data: {
        stats: {
          revenue: 100,
          revenue_diff: 0,
          spend: 50,
          spend_diff: 0,
          roas: 2,
          roas_diff: 0,
          conversions: 10,
          conv_diff: 0,
        },
        matrix: [],
        // funnel is missing!
        channels: [],
        insights: [],
      },
    });

    const data = await fetchDashboardData();
    
    // Should have funnel from mock data even though API was malformed
    expect(data.funnel).toBeDefined();
    expect(data.funnel.length).toBeGreaterThan(0);
    expect(data.funnel[0].label).toBe("Awareness"); // check it's the mock data
    
    spy.mockRestore();
  });

  it("should fall back to mock data when API fails (network error)", async () => {
    const spy = vi.spyOn(apiClient, "get").mockRejectedValue(new Error("Network Error"));
    
    const data = await fetchDashboardData();
    
    expect(data.funnel).toBeDefined();
    expect(data.funnel.length).toBeGreaterThan(0);
    
    spy.mockRestore();
  });
});
