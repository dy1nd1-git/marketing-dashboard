import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DailyAnalysisClient } from "./components/DailyAnalysisClient";

// Mock MarketingContext
vi.mock("../../../src/context/MarketingContext", () => ({
  useMarketingContext: () => ({
    segment: "Paid Social",
    setSegment: vi.fn(),
    isPending: false,
  }),
}));

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock InsightCart Context
vi.mock("../../../src/context/InsightCartContext", () => ({
  useInsightCart: () => ({
    items: [],
    addInsight: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
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

describe("DailyAnalysisClient (Subaquatic Observatory & Tactical Grids)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard grid layout initially", async () => {
    render(
      <DailyAnalysisClient
        initialData={mockDailyResponse.data}
        initialMetadata={mockDailyResponse.metadata}
      />
    );

    expect(screen.getByText("Daily Analysis")).toBeDefined();

    // 確認: 3列のタイトルが表示されていること
    expect(screen.getByText("Daily Tactical")).toBeDefined();
    expect(screen.getByText("Weekly Stratum")).toBeDefined();
    expect(screen.getByText("Monthly Horizon")).toBeDefined();
  });

  it("applies Static Red anomaly styling correctly to threshold-exceeding rows", async () => {
    render(
      <DailyAnalysisClient
        initialData={mockDailyResponse.data}
        initialMetadata={mockDailyResponse.metadata}
      />
    );

    // Verify row with ROAS 9.00 has custom styling assigned
    const anomalyCell = screen.getByText("9.00").closest("td");
    expect(anomalyCell).toBeDefined();
    expect(anomalyCell?.closest("tr")?.className).toContain("bg-tertiary-container/10");
  });

  it("triggers deep dive route pivoting upon anomaly row interaction", async () => {
    render(
      <DailyAnalysisClient
        initialData={mockDailyResponse.data}
        initialMetadata={mockDailyResponse.metadata}
      />
    );

    const anomalyRow = screen.getByText("9.00").closest("tr");
    expect(anomalyRow).toBeDefined();

    fireEvent.click(anomalyRow!);

    expect(pushMock).toHaveBeenCalledWith(
      "/analise?date_range=2026-05-11&metric=roas&segment_id=all_users"
    );
  });
});
