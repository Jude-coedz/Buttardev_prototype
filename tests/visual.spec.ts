import { expect, test } from "@playwright/test";

test("the watched journey is understandable end to end", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "See exactly what Watchdog is watching." })).toBeVisible();
  await expect(page.getByText("BrightHome").first()).toBeVisible();
  await expect(page.getByText("Journey Watchdog").first()).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Start with the enquiry" }).click();
  await expect(page.getByText("Enquiry received")).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("96%")).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("crm_demo_1842")).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("No owner")).toBeVisible();
  await expect(page.getByText("owner_id = null")).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Business outcome failed at routing")).toBeVisible();
  await expect(page.getByText(/Watchdog blocked an unowned lead/)).toBeVisible();

  await page.getByRole("button", { name: "Fix mapping & replay" }).click();
  await expect(page.getByText("Saim · Birmingham")).toBeVisible();
  await expect(page.getByText("Recovery verified without a duplicate lead")).toBeVisible();
});

test("the spatial model can be inspected layer by layer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await page.getByRole("button", { name: "System model" }).click();
  await expect(page.getByRole("heading", { name: "Pull Watchdog apart." })).toBeVisible();

  await page.getByRole("button", { name: /Guard layer/ }).click();
  await expect(page.getByText("Stops bad state spreading")).toBeVisible();
  await expect(page.getByText("Slack + task blocked")).toBeVisible();

  await page.getByRole("button", { name: "Trace a check" }).click();
  await expect(page.getByText("Evidence + recovery")).toBeVisible();
});

test("mobile keeps the walkthrough readable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await expect(page.getByRole("button", { name: "Live system" })).toBeVisible();
  await page.getByRole("button", { name: "Start with the enquiry" }).click();
  await expect(page.getByText("Enquiry received")).toBeVisible();
});
