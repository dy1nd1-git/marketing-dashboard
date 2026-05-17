import { test, expect } from "@playwright/test";

test.describe("Hydration Mismatch Sentinel (Approach A)", () => {
  test("deep-analysis page should load without any hydration errors in browser console", async ({ page }) => {
    const hydrationErrors: string[] = [];

    // Capture console errors during execution
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (
          text.includes("Hydration") ||
          text.includes("did not match") ||
          text.includes("Warning: Text content did not match")
        ) {
          hydrationErrors.push(`[Console Error]: ${text}`);
        }
      }
    });

    // Navigate to the deep-analysis dashboard
    await page.goto("/deep-analysis");

    // Wait for client-side mounting and Framer Motion / Recharts animations to stabilize
    await page.waitForTimeout(1500);

    // Assert that absolutely 0 hydration mismatch errors were captured in console
    expect(hydrationErrors).toEqual([]);
  });
});
export {};
