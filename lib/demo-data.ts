export type StepState = "healthy" | "failed" | "blocked" | "checking";

export type JourneyStep = {
  id: string;
  label: string;
  detail: string;
  tool: string;
  duration: string;
  state: StepState;
};

export const healthySteps: JourneyStep[] = [
  {
    id: "website",
    label: "Website enquiry",
    detail: "Residential deep clean",
    tool: "Web form",
    duration: "312ms",
    state: "healthy",
  },
  {
    id: "qualify",
    label: "AI qualification",
    detail: "4 required details captured",
    tool: "AI assistant",
    duration: "1.4s",
    state: "healthy",
  },
  {
    id: "crm",
    label: "CRM lead",
    detail: "Record created once",
    tool: "HubSpot",
    duration: "540ms",
    state: "healthy",
  },
  {
    id: "owner",
    label: "Owner assigned",
    detail: "Birmingham team",
    tool: "Routing rule",
    duration: "88ms",
    state: "healthy",
  },
  {
    id: "alert",
    label: "Team notified",
    detail: "Structured summary delivered",
    tool: "Slack",
    duration: "231ms",
    state: "healthy",
  },
  {
    id: "followup",
    label: "Follow-up task",
    detail: "Due within 5 minutes",
    tool: "CRM task",
    duration: "190ms",
    state: "healthy",
  },
];

export const degradedSteps: JourneyStep[] = healthySteps.map((step) => {
  if (step.id === "owner") {
    return {
      ...step,
      detail: "No owner returned",
      duration: "91ms",
      state: "failed" as const,
    };
  }

  if (step.id === "alert" || step.id === "followup") {
    return {
      ...step,
      detail: "Protected from running",
      duration: "—",
      state: "blocked" as const,
    };
  }

  return step;
});

export const contractChecks = [
  {
    title: "Acknowledge every enquiry",
    description: "Customer receives confirmation in under 60 seconds.",
    target: "< 60 sec",
    status: "passing",
  },
  {
    title: "Never promise unconfirmed availability",
    description:
      "The acknowledgement can offer a preferred date, but booking stays a request until a person confirms it.",
    target: "0 false promises",
    status: "passing",
  },
  {
    title: "Capture the context the team needs",
    description: "Service, postcode, property size and preferred date must reach the CRM.",
    target: "4 / 4 fields",
    status: "passing",
  },
  {
    title: "Give every qualified lead an owner",
    description: "Exactly one person must own the next human response.",
    target: "< 60 sec",
    status: "attention",
  },
  {
    title: "Create a follow-up task",
    description: "No qualified enquiry can quietly end after CRM creation.",
    target: "< 5 min",
    status: "passing",
  },
  {
    title: "Escalate low-confidence conversations",
    description: "Complex or sensitive questions move to a human with context attached.",
    target: "100% escalated",
    status: "passing",
  },
];

export const recentRuns = [
  {
    id: "WD-1842",
    time: "14:32",
    journey: "Residential enquiry",
    result: "Failed",
    duration: "2.6s",
    note: "Owner assignment",
  },
  {
    id: "WD-1841",
    time: "14:17",
    journey: "Residential enquiry",
    result: "Passed",
    duration: "3.1s",
    note: "All 6 checks",
  },
  {
    id: "WD-1840",
    time: "14:02",
    journey: "Quote follow-up",
    result: "Passed",
    duration: "2.4s",
    note: "All 5 checks",
  },
  {
    id: "WD-1839",
    time: "13:47",
    journey: "Residential enquiry",
    result: "Passed",
    duration: "2.9s",
    note: "All 6 checks",
  },
  {
    id: "WD-1838",
    time: "13:32",
    journey: "After-hours enquiry",
    result: "Passed",
    duration: "3.4s",
    note: "Human handoff",
  },
];

export const clients = [
  { name: "BrightHome Cleaning", status: "1 at risk", tone: "attention" },
  { name: "Hearthside Heating", status: "Healthy", tone: "healthy" },
  { name: "Oak & Key Property", status: "Healthy", tone: "healthy" },
];
