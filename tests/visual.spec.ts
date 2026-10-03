import { expect, test } from "@playwright/test";

test("the full Watchdog story stays understandable when the user controls the pace", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Come home to done." })).toBeVisible();
  await expect(page.getByText("Start the demo here")).toBeVisible();
  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page).toHaveURL(/\/automation/);
  await page.getByRole("button", { name: "Run the automation" }).click();
  await expect(page.getByText("The workflow stopped at owner assignment.")).toBeVisible({
    timeout: 7_000,
  });

  await page.getByRole("button", { name: "Open the CRM record" }).click();
  await expect(page).toHaveURL(/\/crm/);

  const routeButton = page.getByRole("button", { name: "Run owner-routing rule" });
  await expect(routeButton).toBeVisible();
  const routeBox = await routeButton.boundingBox();
  expect(routeBox).not.toBeNull();
  expect((routeBox?.y ?? 9999) + (routeBox?.height ?? 0)).toBeLessThanOrEqual(768);

  await routeButton.click();
  await expect(page.getByText("Unassigned")).toBeVisible({ timeout: 4_000 });
  await expect(page.getByText("owner_id = null")).toBeVisible();
  await expect(page.getByRole("button", { name: "Let Watchdog inspect it" })).toBeVisible();

  await page.getByRole("button", { name: "Let Watchdog inspect it" }).click();
  await expect(page).toHaveURL(/\/watchdog/);
  await expect(page.getByText("Sidecar control plane")).toBeVisible();
  await expect(page.getByText("It does not fix code itself")).toBeVisible();

  for (let i = 0; i < 5; i += 1) {
    await page.getByRole("button", { name: "Inspect next boundary" }).click();
  }

  await expect(page.getByText("The failure is isolated to routing.")).toBeVisible();
  await page.getByRole("button", { name: "Fix the failed boundary" }).click();

  await expect(page).toHaveURL(/\/recovery/);
  await expect(page.getByText("Boundary: FlowCRM → routing-v4")).toBeVisible();

  await page.getByRole("button", { name: "Apply routing fix" }).click();
  await expect(page.getByText("Routing mapping corrected")).toBeVisible();

  await page.getByRole("button", { name: "Replay from routing boundary" }).click();
  await expect(page.getByText("Recovery verified")).toBeVisible({ timeout: 6_000 });
  await expect(page.getByText("Saim · Birmingham")).toBeVisible();
});

test("the architecture route is an Anime.js interactive cube with stable navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/architecture");

  await expect(
    page.getByRole("heading", { name: "Rotate the cube to understand the Watchdog system." }),
  ).toBeVisible();

  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "3D" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Use cases" })).toBeVisible();
  await expect(page.getByRole("button", { name: "WATCHDOG face" })).toBeVisible();

  await page.getByRole("button", { name: "Rotate to next face" }).click();
  await expect(page.getByText("Synthetic probe")).toBeVisible();

  await page.getByRole("button", { name: "Rotate to next face" }).click();
  await expect(page.getByText("Handoff observer")).toBeVisible();

  await page.getByRole("button", { name: "Rotate to next face" }).click();
  await expect(page.getByText("Contract engine")).toBeVisible();

  await page.getByRole("button", { name: "Rotate to next face" }).click();
  await expect(page.getByText("Guard layer")).toBeVisible();

  await page.getByRole("button", { name: "Rotate to next face" }).click();
  await expect(page.getByText("Evidence + replay")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Watchdog use cases" })).toBeVisible();

  await page.getByRole("link", { name: "Use cases" }).click();
  await expect(page).toHaveURL(/\/use-cases/);
  await expect(page.getByRole("link", { name: "Use cases" })).toHaveAttribute("aria-current", "page");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("use cases provide runnable mimicked automations", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/use-cases");

  await expect(page.getByText("Lead routing", { exact: true })).toBeVisible();
  await expect(page.getByText("Invoice approval", { exact: true })).toBeVisible();
  await expect(page.getByText("Customer onboarding", { exact: true })).toBeVisible();
  await expect(page.getByText("Order fulfilment", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Invoice approval", exact: false }).click();
  await page.getByRole("button", { name: "Run this automation" }).click();
  await expect(page.getByText("approval_count = 1")).toBeVisible({ timeout: 7_000 });
});

test("100 percent desktop zoom keeps the first interaction in view", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const send = page.getByRole("button", { name: "Send enquiry" });
  await expect(send).toBeVisible();
  const sendBox = await send.boundingBox();
  expect(sendBox).not.toBeNull();
  expect((sendBox?.y ?? 9999) + (sendBox?.height ?? 0)).toBeLessThanOrEqual(768);

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
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
