import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KPICard } from "./KPICard";

describe("KPICard Component (Statistical Aggregation & Extreme Boundaries)", () => {
  const defaultProps = {
    icon: "payments",
    iconColorClass: "text-primary-container",
    iconBgColorClass: "bg-primary-container/10",
    label: "Total Revenue Aggregation",
    value: "$1,284,930",
    trend: {
      label: "+12.5%",
      icon: "trending_up",
      colorClass: "text-primary-container",
      bgColorClass: "bg-primary-container/10",
    },
    chartBarClass: "bg-primary-container",
    chartGradientClass: "from-primary-container/5",
    chartData: [10, 0, 100, 50, 25], // Includes extreme bounds (0 and 100)
  };

  it("renders metric label, robust pre-calculated value, and embedded design tokens correctly", () => {
    const { container } = render(<KPICard {...defaultProps} />);

    expect(screen.getByText("Total Revenue Aggregation")).toBeDefined();
    expect(screen.getByText("$1,284,930")).toBeDefined();
    expect(screen.getByText("+12.5%")).toBeDefined();

    // Verify correct icon binding
    expect(screen.getByText("payments")).toBeDefined();

    // Verify statistical data bars map inline heights cleanly including boundaries
    const bars = container.querySelectorAll(".bg-primary-container");
    expect(bars.length).toBe(5);
    expect((bars[0] as HTMLElement).style.height).toBe("10%");
    expect((bars[1] as HTMLElement).style.height).toBe("0%");
    expect((bars[2] as HTMLElement).style.height).toBe("100%");
  });

  it("renders gracefully even with empty/flatlining performance trends", () => {
    const flatlineProps = {
      ...defaultProps,
      trend: {
        label: "0.0%",
        colorClass: "text-slate-400",
        bgColorClass: "bg-slate-100",
      },
      chartData: [0, 0, 0, 0],
    };

    render(<KPICard {...flatlineProps} />);
    expect(screen.getByText("0.0%")).toBeDefined();
  });
});
