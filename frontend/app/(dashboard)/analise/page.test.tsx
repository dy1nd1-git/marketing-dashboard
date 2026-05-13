import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnaliseContent from "./page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("?segment_id=test_segment&metric=roas"),
}));

// Mock MarketingContext
vi.mock("../../../src/context/MarketingContext", () => ({
  useMarketingContext: () => ({
    segment: "Overall",
    setSegment: vi.fn(),
    isPending: false,
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

  it("renders the exploration workspace header", () => {
    render(<AnaliseContent />);
    
    // Check header text
    expect(screen.getByText("Exploration")).toBeDefined();
    expect(screen.getByText(/Analyze and pivot your marketing data/i)).toBeDefined();
  });

  it("renders the empty state when no tabs exist", () => {
    render(<AnaliseContent />);
    
    // Check empty state message
    expect(screen.getByText("No active analysis")).toBeDefined();
    expect(screen.getByText(/Use the input bar above to query your marketing data/i)).toBeDefined();
  });

  it("input field accepts text", () => {
    render(<AnaliseContent />);
    
    const input = screen.getByPlaceholderText(/\/\/ \[INPUT\]: Try/i);
    fireEvent.change(input, { target: { value: "推移" } });
    
    expect((input as HTMLInputElement).value).toBe("推移");
  });
});
