import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresentationDeckEngine from "./page";

// Mock Recharts subcomponents robustly to support lightweight reliable jsdom assertions
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  Cell: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  CartesianGrid: () => <div />,
}));

// Mock localized Cart Context telemetry state maps
vi.mock("../../../src/context/InsightCartContext", () => ({
  useInsightCart: () => ({
    items: [
      {
        id: "mock_item_1",
        title: "Mock Conversion Pipeline",
        type: "funnel",
        metricsSummary: "High telemetry consistency",
        chartPayload: [{ name: "Imp", val: 100 }],
      },
      {
        id: "mock_item_2",
        title: "Mock ROI Trends",
        type: "chart",
        metricsSummary: "Stable scaling",
        chartPayload: [{ period: "D1", v: 12 }],
      },
    ],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

describe("Presentation Master Deck Engine Telemetry Integrations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear potentially lingering persistent metadata caches
    localStorage.clear();
  });

  it("renders presentation master initial frame without errors", () => {
    render(<PresentationDeckEngine />);
    expect(screen.getAllByText("Presentation Master")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Mellow Marketing ROI Review")[0]).toBeInTheDocument();
  });

  it("triggers new layout slide state mutations successfully", () => {
    render(<PresentationDeckEngine />);
    const addBtn = screen.getByText("Add");
    fireEvent.click(addBtn);
    expect(screen.getAllByText(/Strategic Focus Area 2/i)[0]).toBeInTheDocument();
  });

  it("populates export guidance orchestration options reliably", () => {
    render(<PresentationDeckEngine />);
    const exportTriggerBtn = screen.getByText("Export Deck");
    fireEvent.click(exportTriggerBtn);
    expect(screen.getAllByText("Export Deck Horizon")[0]).toBeInTheDocument();
    expect(screen.getAllByText("フルスクリーンPDFを出力")[0]).toBeInTheDocument();
  });
});
