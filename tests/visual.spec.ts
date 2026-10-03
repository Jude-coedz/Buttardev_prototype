import { expect, test } from "@playwright/test";

test("guided watchdog journey, incident and recovery are coherent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/");

  await expect(page.getByText("Journey Watchdog", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Prove the customer journey still works after the automation ships.",
    }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Watch a live check" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Watch the journey fail in a way uptime monitoring would miss.",
    }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Owner assignment failed" })).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.getByText("Synthetic only")).toBeVisible();
  await expect(page.getByText("owner_id = null")).toBeVisible();

  await page.getByRole("button", { name: "Apply fix & replay" }).click();
  await expect(page.getByText("All six business assertions passed.")).toBeVisible({
    timeout: 8_000,
  });
});

test("under-the-hood view explains architecture and data boundaries", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/");

  await page.getByRole("button", { name: "Under the hood" }).click();
  await expect(page.getByRole("heading", { name: "One watchdog run, picked apart." })).toBeVisible();

  await page.getByRole("button", { name: /Guard rails/ }).click();
  await expect(page.getByText("Stop unsafe actions")).toBeVisible();
  await expect(page.getByText(/Prevents downstream actions/)).toBeVisible();

  await page.getByRole("button", { name: "Trace one check" }).click();
  await expect(page.getByText("Evidence + replay")).toBeVisible();
});

test("mobile navigation exposes trust controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await expect(page.getByRole("navigation")).toBeVisible();
  await page.getByRole("button", { name: "Trust & controls" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Prove the journey without borrowing the customer's identity.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Implemented in this prototype")).toBeVisible();
  await expect(page.getByText("Production guardrails still required")).toBeVisible();
});
