import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Global Mock for MarketingContext to support all dashboard tests
vi.mock("@/context/MarketingContext", () => ({
  useMarketingContext: () => ({
    segment: "Overall",
    setSegment: vi.fn(),
    startDate: "2026-05-01",
    endDate: "2026-05-30",
    setDateRange: vi.fn(),
    isPending: false,
  }),
}));
