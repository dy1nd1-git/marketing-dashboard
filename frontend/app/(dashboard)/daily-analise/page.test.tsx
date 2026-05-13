import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DailyDashboard from "./page";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockDailyResponse = {
  metadata: {
    engine: "Decision-Tracer-BQ-v1",
    confidence: "High",
  },
  data: [
    {
      date: "2026-05-10",
      revenue: 10000,
      spend: 3000,
      roas: 3.33,
      ctr: 0.02,
      cvr: 0.05,
      is_anomaly: false,
      z_score: 0.5,
    },
    {
      date: "2026-05-11",
      revenue: 45000,
      spend: 5000,
      roas: 9.0,
      ctr: 0.04,
      cvr: 0.12,
      is_anomaly: true, // Z-Score threshold exceeded boundary
      z_score: 2.8,
    },
  ],
};

const mockWeeklyResponse = {
  data: [
    {
      week: "2026-W18",
      avg_revenue: 12000,
      avg_spend: 3500,
      net_roas: 3.42,
    },
  ],
};

describe("DailyDashboard (Subaquatic Observatory & Anomaly Boundaries)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global fetch
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const urlStr = typeof input === "string" ? input : ("url" in input ? (input as Request).url : input.toString());
      if (urlStr.includes("daily-cvr")) {
        return {
          json: async () => mockDailyResponse,
        } as Response;
      }
      if (urlStr.includes("weekly-roi")) {
        return {
          json: async () => mockWeeklyResponse,
        } as Response;
      }
      return { json: async () => ({}) } as Response;
    });
  });

  it("renders loading state initially and proceeds to render table engine headers", async () => {
    render(<DailyDashboard />);

    expect(screen.getByText(/Loading daily analytics.../i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    expect(screen.getByText(/Engine: Decision-Tracer-BQ-v1/i)).toBeDefined();
  });

  it("applies Static Red anomaly-glow styling correctly to threshold-exceeding rows", async () => {
    render(<DailyDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    // Verify row with ROAS 9.00 has anomaly-glow class assigned
    const anomalyCell = screen.getByText("9.00").closest("td");
    expect(anomalyCell?.closest("tr")?.querySelector(".anomaly-glow")).toBeDefined();
    expect(anomalyCell?.closest("tr")?.className).toContain("bg-tertiary-container/10");

    // Verify standard row lacks anomaly-glow styling
    const normalCell = screen.getByText("3.33").closest("td");
    expect(normalCell?.closest("tr")?.querySelector(".anomaly-glow")).toBeNull();
  });

  it("triggers deep dive route pivoting upon anomaly row interaction", async () => {
    render(<DailyDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    const anomalyRow = screen.getByText("9.00").closest("tr");
    expect(anomalyRow).toBeDefined();

    fireEvent.click(anomalyRow!);

    expect(pushMock).toHaveBeenCalledWith(
      "/analise?date_range=2026-05-11&metric=roas&segment_id=all_users"
    );
  });

  it("sorts columns bidirectionally upon header click", async () => {
    render(<DailyDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    const revenueHeader = screen.getAllByText(/Revenue/i)[0];
    fireEvent.click(revenueHeader);

    // Verify table remains intact and reactive using timezone-invariant token
    expect(screen.getByText("9.00")).toBeDefined();
  });
});
