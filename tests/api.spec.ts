import { expect, test } from "@playwright/test";

test("journey API protects downstream actions when routing fails", async ({ request }) => {
  const degraded = await request.post("/api/watchdog/run", {
    data: { scenario: "degraded" },
  });
  expect(degraded.ok()).toBeTruthy();

  const failedRun = await degraded.json();
  expect(failedRun.status).toBe("failed");
  expect(failedRun.incident.code).toBe("OWNER_ASSIGNMENT_MISSING");
  expect(failedRun.steps.find((step: { id: string }) => step.id === "alert").blocked).toBe(true);
  expect(failedRun.steps.find((step: { id: string }) => step.id === "followup").blocked).toBe(true);

  const healthy = await request.post("/api/watchdog/run", {
    data: { scenario: "healthy" },
  });
  expect(healthy.ok()).toBeTruthy();

  const recoveredRun = await healthy.json();
  expect(recoveredRun.status).toBe("passed");
  expect(recoveredRun.incident).toBeNull();
  expect(recoveredRun.idempotencyKey).toBe(failedRun.idempotencyKey);
  expect(recoveredRun.steps.every((step: { ok: boolean }) => step.ok)).toBe(true);
});
