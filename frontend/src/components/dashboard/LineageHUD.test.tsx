import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LineageHUD } from "./LineageHUD";
import { LineageTelemetry } from "../../types/marketing";

describe("LineageHUD Component (Provenance & Probabilistic Confidence Auditing)", () => {
  const highConfidenceTelemetry: LineageTelemetry = {
    source: "bq://marketing-dw.analytics.daily_cvr_view",
    confidence: "High",
    engine: "Decision-Tracer-BQ-v1",
    timestamp: "2026-05-13T12:00:00Z",
    zScore: 0.25,
  };

  const lowConfidenceTelemetry: LineageTelemetry = {
    source: "bq://marketing-dw.staging.raw_clicks_offline",
    confidence: "Low",
    engine: "Fallback-Static-Engine",
    timestamp: "2026-05-13T10:00:00Z",
  };

  it("renders collapsed interactive badge trigger reflecting active confidence status initially", () => {
    render(<LineageHUD telemetry={highConfidenceTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Data Provenance Telemetry/i });
    expect(badgeTrigger).toBeDefined();
    expect(badgeTrigger.getAttribute("aria-expanded")).toBe("false");

    // Verify correct styling applied inline
    expect(badgeTrigger.className).toContain("text-emerald-400");
    expect(screen.getByText("High")).toBeDefined();

    // Verify HUD dialog overlay remains safely unmounted
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("toggles popover diagnostic trace HUD overlay upon user interaction", () => {
    render(<LineageHUD telemetry={highConfidenceTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Data Provenance Telemetry/i });

    // Click to expand dialog overlay
    fireEvent.click(badgeTrigger);
    expect(badgeTrigger.getAttribute("aria-expanded")).toBe("true");

    const dialog = screen.getByRole("dialog", { name: "Lineage Provenance Detail" });
    expect(dialog).toBeDefined();

    // Confirm metadata exposure layers mount canonical paths perfectly
    expect(screen.getByText("bq://marketing-dw.analytics.daily_cvr_view")).toBeDefined();
    expect(screen.getByText("Decision-Tracer-BQ-v1")).toBeDefined();
    expect(screen.getByText("Z-Score: 0.25")).toBeDefined();
    expect(screen.getByText(/Generated: 2026-05-13T12:00:00Z/i)).toBeDefined();

    // Click again to fold overlay dialog safely
    fireEvent.click(badgeTrigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("applies Attentive Soft Rose/Red styles and customized subtext warnings when variance tier drops to Low", () => {
    render(<LineageHUD telemetry={lowConfidenceTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Data Provenance Telemetry/i });
    expect(badgeTrigger.className).toContain("text-rose-400");

    // Expand HUD dialog layer
    fireEvent.click(badgeTrigger);
    expect(screen.getByText("bq://marketing-dw.staging.raw_clicks_offline")).toBeDefined();
    expect(screen.getByText("Fallback-Static-Engine")).toBeDefined();
    expect(screen.getByText("Calibrated")).toBeDefined();
  });

  it("responds seamlessly to accessible keyboard Escape instructions folding viewports", () => {
    render(<LineageHUD telemetry={highConfidenceTelemetry} />);

    const badgeTrigger = screen.getByRole("button", { name: /Data Provenance Telemetry/i });
    fireEvent.click(badgeTrigger);
    expect(screen.getByRole("dialog")).toBeDefined();

    // Press Escape to dismiss overlay
    fireEvent.keyDown(badgeTrigger, { key: "Escape", code: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
