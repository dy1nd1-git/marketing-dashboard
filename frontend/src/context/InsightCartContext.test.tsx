import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { InsightCartProvider, useInsightCart } from "./InsightCartContext";

// Consumer integration helper validating state hook boundaries
const TestConsumer: React.FC = () => {
  const { items, addInsight, removeInsight, clearCart } = useInsightCart();

  return (
    <div>
      <span data-testid="cart-count">{items.length}</span>
      <button
        onClick={() =>
          addInsight({
            title: "Test Tactical Metric",
            type: "kpi",
            metricsSummary: "ROAS 4.2x",
            sourceRef: "bq://test_view",
          })
        }
        data-testid="add-btn"
      >
        Add
      </button>
      {items.length > 0 && (
        <button
          onClick={() => removeInsight(items[0].id)}
          data-testid="remove-btn"
        >
          Remove First
        </button>
      )}
      <button onClick={clearCart} data-testid="clear-btn">
        Clear
      </button>
    </div>
  );
};

describe("InsightCartContext Engine Validation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with an empty cart state safely", () => {
    render(
      <InsightCartProvider>
        <TestConsumer />
      </InsightCartProvider>
    );

    expect(screen.getByTestId("cart-count").textContent).toBe("0");
  });

  it("appends new analytical items with auto-generated distinct IDs and timestamps", () => {
    render(
      <InsightCartProvider>
        <TestConsumer />
      </InsightCartProvider>
    );

    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("cart-count").textContent).toBe("1");

    // Local storage persistence evaluation
    const stored = localStorage.getItem("mellow_insight_cart");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe("Test Tactical Metric");
    expect(parsed[0].id).toMatch(/^insight_/);
  });

  it("removes specified insight items predictably", () => {
    render(
      <InsightCartProvider>
        <TestConsumer />
      </InsightCartProvider>
    );

    // Add item
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("cart-count").textContent).toBe("1");

    // Remove item
    fireEvent.click(screen.getByTestId("remove-btn"));
    expect(screen.getByTestId("cart-count").textContent).toBe("0");
  });

  it("clears the entire active state collection when triggered", () => {
    render(
      <InsightCartProvider>
        <TestConsumer />
      </InsightCartProvider>
    );

    // Add multiple
    fireEvent.click(screen.getByTestId("add-btn"));
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("cart-count").textContent).toBe("2");

    // Clear
    fireEvent.click(screen.getByTestId("clear-btn"));
    expect(screen.getByTestId("cart-count").textContent).toBe("0");
  });
});
