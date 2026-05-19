import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnaliseContent from "./DeepAnalysisPageClient";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("?segment_id=test_segment&metric=roas"),
}));

// Mock MarketingContext
vi.mock("../../../src/context/MarketingContext", () => ({
  useMarketingContext: () => ({
    segment: "Overall",
    setSegment: vi.fn(),
    startDate: "2026-05-01",
    endDate: "2026-05-30",
    setDateRange: vi.fn(),
    isPending: false,
  }),
}));

// Mock InsightCart Context
vi.mock("../../../src/context/InsightCartContext", () => ({
  useInsightCart: () => ({
    items: [],
    addItem: vi.fn(),
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

describe("AnaliseContent (Exploration Workspace)", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders the exploration workspace header", async () => {
    render(<AnaliseContent />);
    
    // Check header text
    expect(await screen.findByText("Deep Analysis")).toBeDefined();
    expect(await screen.findByText(/Analyze and pivot your marketing data/i)).toBeDefined();
  });

  it("renders the empty state when no tabs exist", async () => {
    render(<AnaliseContent />);
    
    // Check empty state message
    expect(await screen.findByText("No active analysis")).toBeDefined();
    expect(await screen.findByText(/Use the input bar above to query your marketing data/i)).toBeDefined();
  });

  it("input field accepts text", async () => {
    render(<AnaliseContent />);
    
    const input = await screen.findByPlaceholderText(/\/\/ \[INPUT\]: Try/i);
    fireEvent.change(input, { target: { value: "推移" } });
    
    expect((input as HTMLInputElement).value).toBe("推移");
  });
});
