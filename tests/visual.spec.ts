import { expect, test } from "@playwright/test";

test("desktop journey, incident and recovery are coherent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/");

  await expect(page.getByText("Journey Watchdog", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A customer can enquire successfully, but nobody owns the reply.",
    }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.screenshot({
    path: "test-results/desktop-overview.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Run verification" }).click();
  await expect(page.getByRole("heading", { name: "Owner assignment failed" })).toBeVisible({
    timeout: 7_000,
  });
  await expect(page.getByText("owner_id = null")).toBeVisible();

  await page.screenshot({
    path: "test-results/desktop-incident.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Apply fix & replay" }).click();
  await expect(
    page.getByRole("heading", {
      name: "The full customer journey is behaving as promised.",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Journey contract" }).click();
  await expect(page.getByRole("heading", { name: "Journey contract" })).toBeVisible();
  await expect(page.getByText("Never promise unconfirmed availability")).toBeVisible();
});

test("mobile navigation exposes the full product", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await expect(page.getByRole("navigation")).toBeVisible();
  await page.getByRole("button", { name: "Client report" }).click();
  await expect(page.getByRole("heading", { name: "Weekly assurance report" })).toBeVisible();

  await page.screenshot({
    path: "test-results/mobile-report.png",
    fullPage: true,
  });
});
