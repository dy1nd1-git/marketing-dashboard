import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LineageHUD } from "./LineageHUD";
import { LineageTelemetry } from "../../../../src/types/marketing";

describe("LineageHUD Component (Query Origin Info Auditing)", () => {
  const sampleTelemetry: LineageTelemetry = {
    source: "bq://marketing-dw.analytics.daily_cvr_view",
    confidence: "High",
    engine: "Decision-Tracer-BQ-v1",
    timestamp: "2026-05-13T12:00:00Z",
  };

  it("renders collapsed interactive badge trigger initially", () => {
    render(<LineageHUD telemetry={sampleTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Query Origin Info/i });
    expect(badgeTrigger).toBeDefined();
    expect(badgeTrigger.getAttribute("aria-expanded")).toBe("false");

    // Verify HUD dialog overlay remains safely unmounted
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("toggles popover query origin detail overlay upon user interaction", () => {
    render(<LineageHUD telemetry={sampleTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Query Origin Info/i });

    // Click to expand dialog overlay
    fireEvent.click(badgeTrigger);
    expect(badgeTrigger.getAttribute("aria-expanded")).toBe("true");

    const dialog = screen.getByRole("dialog", { name: "Query Origin Detail" });
    expect(dialog).toBeDefined();

    // Confirm metadata exposure layers mount canonical paths perfectly
    expect(screen.getByText("bq://marketing-dw.analytics.daily_cvr_view")).toBeDefined();
    expect(screen.getByText("2026-05-13T12:00:00Z")).toBeDefined();

    // Click again to fold overlay dialog safely
    fireEvent.click(badgeTrigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("responds seamlessly to accessible keyboard Escape instructions folding viewports", () => {
    render(<LineageHUD telemetry={sampleTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Query Origin Info/i });
    fireEvent.click(badgeTrigger);
    expect(screen.getByRole("dialog")).toBeDefined();

    // Press Escape to dismiss overlay
    fireEvent.keyDown(badgeTrigger, { key: "Escape", code: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
