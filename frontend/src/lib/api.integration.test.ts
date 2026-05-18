import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchDashboardData } from "./api";

describe("fetchDashboardData Error Handling & Validation", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should fall back to mock data when API returns malformed JSON (missing funnel)", async () => {
    // Force global.fetch to return malformed data (funnel is missing)
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
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
      }),
    } as Response);

    const data = await fetchDashboardData();
    
    // Should have funnel from mock data even though API was malformed
    expect(data.funnel).toBeDefined();
    expect(data.funnel.length).toBeGreaterThan(0);
    expect(data.funnel[0].label).toBe("Awareness"); // check it's the mock data
  });

  it("should fall back to mock data when API fails (network error)", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network Error"));
    
    const data = await fetchDashboardData();
    
    expect(data.funnel).toBeDefined();
    expect(data.funnel.length).toBeGreaterThan(0);
  });
});
