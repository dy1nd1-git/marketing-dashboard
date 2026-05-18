import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";

// Intercept routing hooks enforcing active baseline assertions
vi.mock("next/navigation", () => ({
  usePathname: () => "/presentation",
}));

describe("Sidebar Layout Navigation Suite", () => {
  it("renders all primary operational routes including Presentation Master natively", () => {
    render(<Sidebar isCollapsed={false} />);

    // Brand label verification
    expect(screen.getByText("Decision Tracer")).toBeDefined();

    // Route entry presence evaluations
    expect(screen.getByText("Top")).toBeDefined();
    expect(screen.getByText("Daily Analysis")).toBeDefined();
    expect(screen.getByText("Deep Analysis")).toBeDefined();
    expect(screen.getByText("Logic Genealogy")).toBeDefined();
    expect(screen.getByText("Presentation Master")).toBeDefined();
  });

  it("applies active path highlights matching targeted application views", () => {
    render(<Sidebar isCollapsed={false} />);

    // usePathname mock targets '/presentation', injecting strict layout indicator variables
    const presentationLink = screen.getByText("Presentation Master").closest("a");
    expect(presentationLink?.className).toContain("bg-primary-container/30");
    expect(presentationLink?.className).toContain("border-primary");
  });

  it("propagates collapse toggling states predictably upward", () => {
    const toggleSpy = vi.fn();
    render(<Sidebar isCollapsed={false} onToggle={toggleSpy} />);

    // Trigger state proxy mutations using available UI triggers
    const btns = screen.getAllByRole("button"); // Primary logo strip toggle mapping
    fireEvent.click(btns[0]);
    expect(toggleSpy).toHaveBeenCalledOnce();
  });

  it("truncates contextual textual indicators when condensed horizontally", () => {
    render(<Sidebar isCollapsed={true} />);

    // Icon bounds persist gracefully allowing layout responsiveness without text clipping
    expect(screen.queryByText("Decision Tracer")).toBeNull();
    expect(screen.queryByText("Presentation Master")).toBeNull();
  });
});
