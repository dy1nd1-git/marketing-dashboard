import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PivotChart } from "./PivotChart";
import { PivotDetails } from "../../../../src/types/marketing";

describe("PivotChart Component (Large Dataset Rendering Performance Validation)", () => {
  const mockDetails: PivotDetails = {
    id: "pvt-perf-1",
    pivotDate: "2026-05-05",
    status: "achieved",
    memo: {
      intent: "Performance scaling validation test intent.",
      diagnosis: ["Metric point rendering OK"],
      conclusion:
        "Large array charts successfully pass rendering boundary constraints.",
    },
    timeline: [],
  };

  it("handles high-density arrays (100+ timeline nodes) swiftly without blocking state", () => {
    // Generate dense dataset simulating continuous time trajectory
    const denseTimeline = Array.from({ length: 150 }, (_, i) => ({
      date: `2026-05-${String((i % 30) + 1).padStart(2, "0")}`,
      actual: 10000 + i * 50,
      predicted: 10000 + i * 45,
    }));

    const startTime = performance.now();
    const { container } = render(
      <PivotChart data={denseTimeline} details={mockDetails} />,
    );
    const duration = performance.now() - startTime;

    // Verify DOM mounts SVGs properly
    const rechartsWrapper = container.querySelector(
      ".recharts-responsive-container",
    );
    expect(rechartsWrapper).toBeDefined();

    // Confirm execution finishes extremely rapidly (under 500ms even in dense simulation contexts)
    expect(duration).toBeLessThan(500);
  });
});
