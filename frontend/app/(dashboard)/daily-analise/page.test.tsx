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

describe("DailyDashboard (Subaquatic Observatory & Tactical Grids)", () => {
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
      return { json: async () => ({}) } as Response;
    });
  });

  it("renders dashboard grid layout initially", async () => {
    render(<DailyDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    // 確認: 3列のタイトルが表示されていること
    expect(screen.getByText("Daily Tactical")).toBeDefined();
    expect(screen.getByText("Weekly Stratum")).toBeDefined();
    expect(screen.getByText("Monthly Horizon")).toBeDefined();
  });

  it("applies Static Red anomaly styling correctly to threshold-exceeding rows", async () => {
    render(<DailyDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Subaquatic Observatory")).toBeDefined();
    });

    // Verify row with ROAS 9.00 has custom styling assigned
    const anomalyCell = screen.getByText("9.00").closest("td");
    expect(anomalyCell).toBeDefined();
    expect(anomalyCell?.closest("tr")?.className).toContain("bg-tertiary-container/10");
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
});
