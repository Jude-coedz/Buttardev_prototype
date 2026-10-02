import { NextResponse } from "next/server";
import {
  runSyntheticJourney,
  type WatchdogScenario,
} from "@/lib/watchdog-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { scenario?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const scenario: WatchdogScenario =
    body.scenario === "healthy" ? "healthy" : "degraded";

  const run = await runSyntheticJourney(scenario);

  return NextResponse.json(run, {
    headers: {
      "Cache-Control": "no-store",
      "X-Watchdog-Demo": "synthetic-only",
    },
  });
}
