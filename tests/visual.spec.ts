import { expect, test } from "@playwright/test";

test("the full Watchdog story is clear across separate pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Come home to done." })).toBeVisible();
  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page).toHaveURL(/\/automation/);
  await expect(
    page.getByRole("heading", { name: "The enquiry is now inside the workflow." }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Run the automation" }).click();
  await expect(page.getByText("The workflow stopped at owner assignment.")).toBeVisible({
    timeout: 7_000,
  });

  await page.getByRole("button", { name: "Open the CRM record" }).click();
  await expect(page).toHaveURL(/\/crm/);
  await expect(page.getByText("Unassigned")).toBeVisible({ timeout: 4_000 });
  await expect(page.getByText("owner_id = null")).toBeVisible();

  await page.getByRole("button", { name: "Let Watchdog inspect it" }).click();
  await expect(page).toHaveURL(/\/watchdog/);
  await expect(page.getByText("Owner assignment broke the contract.")).toBeVisible({
    timeout: 7_000,
  });
  await expect(page.getByText("Protected from running").first()).toBeVisible();

  await page.getByRole("button", { name: "Fix and replay" }).click();
  await expect(page).toHaveURL(/\/recovery/);
  await page.getByRole("button", { name: "Apply fix and replay" }).click();

  await expect(page.getByText("Recovery verified")).toBeVisible({ timeout: 6_000 });
  await expect(page.getByText("Saim · Birmingham")).toBeVisible();
  await expect(page.getByText("No duplicate lead was created.")).toBeVisible();
});

test("the architecture page exposes a real interactive 3D deep dive", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/architecture");

  await expect(page.getByRole("heading", { name: "Pull Watchdog apart." })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();

  await page.getByRole("button", { name: "Guard layer" }).click();
  await expect(page.getByText("Fail closed")).toBeVisible();
  await expect(page.getByText("Slack alerts and follow-up tasks", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Trace one event" }).click();
  await expect(page.getByRole("button", { name: "Compress layers" })).toBeVisible();
});

test("mobile entry page remains readable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("heading", { name: "Come home to done." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
});
