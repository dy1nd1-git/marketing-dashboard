import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogicGenealogyPage from "./LogicCanvasPage";

// Mock MarketingContext
vi.mock("../../../src/context/MarketingContext", () => ({
  useMarketingContext: () => ({
    segment: "Paid Social",
    setSegment: vi.fn(),
    isPending: false,
  }),
}));

// Provide basic ResizeObserver stub if animations or internal modules inspect bounds
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("LogicGenealogyPage (Dynamic HUD Lineage)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the main feature header and dynamic segment chip", async () => {
    render(<LogicGenealogyPage />);

    expect(await screen.findByText("Logic Genealogy")).toBeDefined();
    expect(await screen.findByText("Paid Social")).toBeDefined();
    expect(
      await screen.findByText(/Trace statistical evidence and approve predictive strategy workflows/i)
    ).toBeDefined();
  });

  it("renders the default active Genealogy HUD view with core nodes", async () => {
    render(<LogicGenealogyPage />);

    expect(await screen.findByText("Genealogy HUD")).toBeDefined();
    expect((await screen.findAllByText("Organic Social Pivot")).length).toBeGreaterThan(0);
    expect(await screen.findByText("Logic Evidence SQL")).toBeDefined();
  });

  it("switches tabs dynamically to display persistent Selection History", async () => {
    render(<LogicGenealogyPage />);

    const historyTabBtn = await screen.findByRole("button", { name: /History/i });
    fireEvent.click(historyTabBtn);

    await waitFor(() => {
      expect(screen.getByText("Selection & Action History")).toBeDefined();
    });
  });

  it("switches tabs dynamically to display Strategic Documentation", async () => {
    render(<LogicGenealogyPage />);

    const docTabBtn = await screen.findByRole("button", { name: /Document/i });
    fireEvent.click(docTabBtn);

    await waitFor(() => {
      expect(screen.getByText("Strategic Documentation")).toBeDefined();
      expect(screen.getByText(/Organic Precision Lineage Specification/i)).toBeDefined();
    });
  });
});
