export type WatchdogScenario = "degraded" | "healthy";

export type SyntheticEnquiry = {
  idempotencyKey: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  service: string;
  propertySize: string;
  preferredDate: string;
};

export type RuntimeStep = {
  id: "website" | "qualify" | "crm" | "owner" | "alert" | "followup";
  label: string;
  tool: string;
  ok: boolean;
  blocked?: boolean;
  durationMs: number | null;
  summary: string;
  evidence: Record<string, string | number | boolean | null>;
};

export type JourneyIncident = {
  code: "OWNER_ASSIGNMENT_MISSING";
  title: string;
  businessImpact: string;
  expected: string;
  received: string;
  lastChange: string;
  likelyCause: string;
  protectedActions: string[];
  recovery: string;
};

export type JourneyRun = {
  runId: string;
  status: "passed" | "failed";
  scenario: WatchdogScenario;
  idempotencyKey: string;
  startedAt: string;
  completedAt: string;
  syntheticEnquiry: SyntheticEnquiry;
  steps: RuntimeStep[];
  incident: JourneyIncident | null;
  assertions: {
    passed: number;
    total: number;
  };
};

const DEMO_ENQUIRY: SyntheticEnquiry = {
  idempotencyKey: "watchdog:brighthome:residential:1842",
  name: "Amina Test",
  email: "watchdog+1842@demo.local",
  phone: "+44 7700 900184",
  postcode: "B15 2TT",
  service: "Residential deep clean",
  propertySize: "3 bedroom",
  preferredDate: "2026-10-06",
};

function step(
  input: Omit<RuntimeStep, "durationMs"> & { durationMs?: number | null },
): RuntimeStep {
  return { durationMs: input.durationMs ?? null, ...input };
}

export async function runSyntheticJourney(
  scenario: WatchdogScenario,
): Promise<JourneyRun> {
  const startedAt = new Date().toISOString();
  const lead = DEMO_ENQUIRY;

  const steps: RuntimeStep[] = [
    step({
      id: "website",
      label: "Website enquiry",
      tool: "Webhook",
      ok: true,
      durationMs: 312,
      summary: "Synthetic enquiry accepted",
      evidence: {
        idempotencyKey: lead.idempotencyKey,
        email: lead.email,
        postcode: lead.postcode,
      },
    }),
  ];

  const requiredFields = [
    lead.service,
    lead.postcode,
    lead.propertySize,
    lead.preferredDate,
  ];
  const qualified = requiredFields.every(Boolean);

  steps.push(
    step({
      id: "qualify",
      label: "AI qualification",
      tool: "Qualification adapter",
      ok: qualified,
      durationMs: 1400,
      summary: qualified
        ? "4 required details captured"
        : "Required context missing",
      evidence: {
        service: lead.service,
        postcode: lead.postcode,
        propertySize: lead.propertySize,
        preferredDate: lead.preferredDate,
        confidence: 0.96,
      },
    }),
  );

  const crmRecordId = "crm_demo_1842";
  steps.push(
    step({
      id: "crm",
      label: "CRM lead",
      tool: "CRM adapter",
      ok: true,
      durationMs: 540,
      summary: "Record upserted once",
      evidence: {
        recordId: crmRecordId,
        operation: "upsert",
        idempotencyKey: lead.idempotencyKey,
        duplicateCreated: false,
      },
    }),
  );

  const ownerId = scenario === "healthy" ? "saim.birmingham" : null;
  const routingOk = Boolean(ownerId);

  steps.push(
    step({
      id: "owner",
      label: "Owner assigned",
      tool: "Routing rule",
      ok: routingOk,
      durationMs: 91,
      summary: routingOk ? "Birmingham team" : "No owner returned",
      evidence: {
        routingKey: lead.postcode,
        expectedOwner: "saim.birmingham",
        ownerId,
        ruleVersion: "routing-v4",
      },
    }),
  );

  if (!routingOk) {
    steps.push(
      step({
        id: "alert",
        label: "Team notified",
        tool: "Slack adapter",
        ok: false,
        blocked: true,
        summary: "Protected from running",
        evidence: {
          reason: "owner_required",
          sent: false,
        },
      }),
      step({
        id: "followup",
        label: "Follow-up task",
        tool: "CRM task adapter",
        ok: false,
        blocked: true,
        summary: "Protected from running",
        evidence: {
          reason: "owner_required",
          created: false,
        },
      }),
    );

    return {
      runId: "WD-1842",
      status: "failed",
      scenario,
      idempotencyKey: lead.idempotencyKey,
      startedAt,
      completedAt: new Date().toISOString(),
      syntheticEnquiry: lead,
      steps,
      assertions: { passed: 5, total: 6 },
      incident: {
        code: "OWNER_ASSIGNMENT_MISSING",
        title: "Owner assignment failed",
        businessImpact:
          "The customer receives a valid acknowledgement, but no person owns the next response.",
        expected: "owner_id = saim.birmingham",
        received: "owner_id = null",
        lastChange: "CRM mapping updated 47m ago",
        likelyCause: "assignee_id renamed upstream",
        protectedActions: [
          "Team alert was not sent with an unowned lead",
          "Follow-up task was not created against an invalid owner",
          "The same idempotency key can be reused for safe replay",
        ],
        recovery:
          "Fix the owner mapping and replay from routing. The CRM lead is upserted, not duplicated.",
      },
    };
  }

  steps.push(
    step({
      id: "alert",
      label: "Team notified",
      tool: "Slack adapter",
      ok: true,
      durationMs: 231,
      summary: "Structured summary delivered",
      evidence: {
        channel: "#birmingham-leads",
        ownerId,
        containsRequiredContext: true,
      },
    }),
    step({
      id: "followup",
      label: "Follow-up task",
      tool: "CRM task adapter",
      ok: true,
      durationMs: 190,
      summary: "Due within 5 minutes",
      evidence: {
        ownerId,
        dueInMinutes: 5,
        duplicateCreated: false,
      },
    }),
  );

  return {
    runId: "WD-1842-R1",
    status: "passed",
    scenario,
    idempotencyKey: lead.idempotencyKey,
    startedAt,
    completedAt: new Date().toISOString(),
    syntheticEnquiry: lead,
    steps,
    assertions: { passed: 6, total: 6 },
    incident: null,
  };
}
