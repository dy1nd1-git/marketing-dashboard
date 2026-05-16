import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { DateRangePicker } from "./DateRangePicker";
import { useMarketingContext } from "../../context/MarketingContext";

// Mock the context hook
vi.mock("../../context/MarketingContext", () => ({
  useMarketingContext: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in JSDOM
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("DateRangePicker Premium UI Suite", () => {
  const mockSetDateRange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useMarketingContext as Mock).mockReturnValue({
      startDate: "2026-05-01",
      endDate: "2026-05-30",
      setDateRange: mockSetDateRange,
      isPending: false,
    });
  });

  it("renders current date range label in the trigger button", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("2026/05/01 - 2026/05/30")).toBeDefined();
  });

  it("opens the glassmorphic popover upon interaction", async () => {
    render(<DateRangePicker />);
    const trigger = screen.getByRole("button");
    
    fireEvent.click(trigger);
    
    // Portal content should be visible (waiting for mounted state)
    expect(await screen.findByText("Last 7 Days")).toBeDefined();
    expect(screen.getByText("Apply Range")).toBeDefined();
  });

  it("propagates preset selection to the global context engine", async () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByRole("button"));
    
    const presetBtn = await screen.findByText("Last 7 Days");
    fireEvent.click(presetBtn);
    
    // Should call setDateRange with calculated dates
    expect(mockSetDateRange).toHaveBeenCalled();
  });

  it("synchronizes custom date inputs with local temp state before application", async () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByRole("button"));
    
    // Debug: log the DOM to see if portal content is there
    // screen.debug();

    const startInput = await screen.findByLabelText(/Start Date/i) as HTMLInputElement;
    fireEvent.change(startInput, { target: { value: "2026-01-01" } });
    
    const applyBtn = screen.getByText("Apply Range");
    fireEvent.click(applyBtn);
    
    expect(mockSetDateRange).toHaveBeenCalledWith("2026-01-01", "2026-05-30");
  });

  it("gracefully disables interactions during pending state transitions", () => {
    (useMarketingContext as Mock).mockReturnValue({
      startDate: "2026-05-01",
      endDate: "2026-05-30",
      setDateRange: mockSetDateRange,
      isPending: true,
    });

    render(<DateRangePicker />);
    const trigger = screen.getByRole("button");
    expect(trigger.hasAttribute("disabled")).toBe(true);
  });
});
