"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import {
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  Database,
  Eye,
  FileCheck2,
  Globe2,
  LockKeyhole,
  MessageSquare,
  Play,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRoundCheck,
} from "lucide-react";
import type { JourneyRun } from "@/lib/watchdog-engine";

const trace = [
  { id: "website", label: "Website", icon: Globe2, observed: "Enquiry accepted", assertion: "Required fields present" },
  { id: "qualify", label: "AI", icon: Bot, observed: "Qualified lead", assertion: "Acknowledgement stays truthful" },
  { id: "crm", label: "CRM", icon: Database, observed: "crm_demo_1842", assertion: "Exactly one CRM record exists" },
  { id: "owner", label: "Routing", icon: Route, observed: "owner_id = null", assertion: "Exactly one owner must exist" },
  { id: "alert", label: "Team alert", icon: MessageSquare, observed: "Blocked", assertion: "Only run with a valid owner" },
  { id: "followup", label: "Follow-up", icon: UserRoundCheck, observed: "Blocked", assertion: "Only create an owned task" },
] as const;

const inspectorCopy = [
  {
    action: "Observe",
    title: "Watchdog reads the handoff leaving the website.",
    body: "It sits beside the automation as a control plane. It does not replace the form, AI, CRM, or Slack. It observes the state crossing between them.",
    icon: Eye,
  },
  {
    action: "Assert",
    title: "The AI output is checked against a business promise.",
    body: "The rule here is not an API health check. Watchdog verifies that the acknowledgement does not turn a preferred date into a fake booking confirmation.",
    icon: FileCheck2,
  },
  {
    action: "Assert",
    title: "The CRM record exists exactly once.",
    body: "The handoff is healthy so far. Watchdog keeps the CRM record ID as evidence and as the anchor for a safe replay later.",
    icon: Database,
  },
  {
    action: "Detect",
    title: "The business contract breaks at routing.",
    body: "FlowCRM is still online and the record exists, but the state leaving routing is wrong. Expected one Birmingham owner. Observed owner_id = null.",
    icon: TriangleAlert,
  },
  {
    action: "Guard",
    title: "Watchdog stops the bad state from becoming a team action.",
    body: "The team notification is not allowed to run because its prerequisite is invalid. This prevents a misleading alert that looks actionable but has no owner.",
    icon: LockKeyhole,
  },
  {
    action: "Guard + evidence",
    title: "The follow-up task stays blocked and the incident is now replayable.",
    body: "Watchdog has enough evidence to show where the journey failed, what was protected, and the exact boundary recovery should resume from.",
    icon: ShieldCheck,
  },
] as const;

export function WatchdogInspection() {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState<JourneyRun | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/watchdog/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "degraded" }),
      });
      setRun((await response.json()) as JourneyRun);
    };
    void load();
  }, []);

  useEffect(() => {
    const node = shellRef.current?.querySelector(`[data-trace="${active}"]`);
    const panel = shellRef.current?.querySelector(".watchdog-explainer");
    if (node) {
      animate(node, {
        scale: [0.97, 1.035, 1],
        duration: 520,
        ease: "out(4)",
      });
    }
    if (panel) {
      animate(panel, {
        opacity: [0.45, 1],
        translateY: [7, 0],
        duration: 360,
        ease: "out(4)",
      });
    }
  }, [active]);

  const copy = inspectorCopy[active];
  const CopyIcon = copy.icon;
  const failed = active >= 3;
  const complete = active === trace.length - 1;

  const progressWidth = useMemo(() => `${(active / (trace.length - 1)) * 100}%`, [active]);

  return (
    <div ref={shellRef} className="mx-auto max-w-[1420px] px-5 py-7 md:px-8 md:py-9">
      <section className="grid gap-7 lg:grid-cols-[.88fr_1.12fr] lg:items-end">
        <div>
          <p className="text-[16px] font-semibold text-[var(--blue)]">Step 4 · Watchdog</p>
          <h1 className="mt-3 max-w-[760px] text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[52px]">
            Watchdog sits across the handoffs, not inside one app.
          </h1>
        </div>
        <p className="max-w-[640px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          Think of it as a sidecar control layer around the automation. It observes the state leaving each system, compares it with the journey contract, and can stop unsafe downstream actions when a required business condition fails.
        </p>
      </section>

      <section className="mt-7 rounded-[28px] border border-[var(--hairline)] bg-white p-5 shadow-[0_22px_70px_rgba(17,19,24,.055)] md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[17px] font-semibold text-[var(--ink)]">Where Watchdog sits</p>
            <p className="mt-1 text-[15px] text-[var(--copy)]">The client tools keep doing their jobs. Watchdog watches the boundaries between them.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--blue-soft)] px-3 py-2 text-[14px] font-semibold text-[var(--blue-deep)]">
            <Radar size={15} />
            Sidecar control plane
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[22px] bg-[#f7f8fa] p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-6">
            {trace.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative">
                  <div className="rounded-[18px] border border-[#e1e4e8] bg-white p-4 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0f3] text-[#5d6672]">
                      <Icon size={18} />
                    </span>
                    <p className="mt-3 text-[15px] font-semibold text-[#242a31]">{item.label}</p>
                  </div>
                  {index < trace.length - 1 ? <ArrowRight size={16} className="absolute -right-[14px] top-1/2 z-10 hidden -translate-y-1/2 text-[#abb2bc] md:block" /> : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[18px] border border-[#cfd4ff] bg-[#eef0ff] p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5665ff] text-white">
                <ShieldCheck size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-[#27319d]">Journey Watchdog</p>
                <p className="mt-1 text-[15px] leading-6 text-[#525b91]">Observes every handoff above, evaluates the contract, gates unsafe side effects, and stores evidence for recovery.</p>
              </div>
              <span className="font-mono text-[13px] font-semibold text-[#626aa2]">out-of-band observer</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-[28px] bg-[#111318] text-white shadow-[0_30px_100px_rgba(17,19,24,.16)]">
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          <div className="border-b border-white/10 p-5 md:p-7 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[16px] font-semibold">Live handoff inspection</p>
                <p className="mt-1 text-[15px] text-white/48">You control the pace. Inspect the journey one boundary at a time.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-[14px] font-medium text-white/65">
                <CircleDot size={14} className={complete ? "text-[#55d99b]" : "text-[#8f98ff]"} />
                {complete ? "Failure isolated" : `Inspecting ${active + 1} of ${trace.length}`}
              </span>
            </div>

            <div className="relative mt-7">
              <div className="absolute left-[7%] right-[7%] top-[30px] hidden h-px bg-white/10 lg:block">
                <span className="watchdog-line block h-full origin-left transition-[width] duration-500" style={{ width: progressWidth }} />
              </div>

              <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {trace.map((item, index) => {
                  const Icon = item.icon;
                  const selected = index === active;
                  const visited = index < active;
                  const isFailure = index === 3 && active >= 3;
                  const blocked = index > 3 && active >= index;

                  return (
                    <button
                      key={item.id}
                      data-trace={index}
                      onClick={() => setActive(index)}
                      className={
                        selected
                          ? "relative z-10 min-h-[164px] rounded-[20px] border border-[#8d98ff]/65 bg-[#5865ff]/15 p-4 text-left shadow-[0_16px_38px_rgba(0,0,0,.18)]"
                          : isFailure
                            ? "relative z-10 min-h-[164px] rounded-[20px] border border-[#d94b63]/50 bg-[#d94b63]/10 p-4 text-left"
                            : blocked
                              ? "relative z-10 min-h-[164px] rounded-[20px] border border-[#d4a14c]/25 bg-[#d4a14c]/[.06] p-4 text-left"
                              : visited
                                ? "relative z-10 min-h-[164px] rounded-[20px] border border-[#39c885]/22 bg-[#39c885]/[.05] p-4 text-left"
                                : "relative z-10 min-h-[164px] rounded-[20px] border border-white/10 bg-white/[.025] p-4 text-left"
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07] text-white/75">
                          <Icon size={18} />
                        </span>
                        <span className="font-mono text-[12px] text-white/32">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-5 text-[16px] font-semibold">{item.label}</p>
                      <p className={
                        isFailure
                          ? "mt-2 text-[14px] font-medium leading-5 text-[#ff96a8]"
                          : blocked
                            ? "mt-2 text-[14px] font-medium leading-5 text-[#ecc57d]"
                            : "mt-2 text-[14px] leading-5 text-white/48"
                      }>
                        {active >= index ? item.observed : "Not inspected yet"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setActive((value) => Math.max(0, value - 1))}
                disabled={active === 0}
                className="h-11 rounded-xl border border-white/12 px-4 text-[14px] font-semibold text-white/65 transition hover:bg-white/[.06] disabled:opacity-30"
              >
                Previous handoff
              </button>
              <button
                onClick={() => setActive((value) => Math.min(trace.length - 1, value + 1))}
                disabled={complete}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#f0f1f3] disabled:opacity-40"
              >
                Inspect next handoff
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <aside className="watchdog-explainer p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className={
                failed
                  ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d94b63]/15 text-[#ff8da0]"
                  : "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#5865ff]/15 text-[#9aa4ff]"
              }>
                <CopyIcon size={20} />
              </span>
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[.08em] text-white/35">{copy.action}</p>
                <p className="mt-1 text-[17px] font-semibold">Boundary {active + 1} of {trace.length}</p>
              </div>
            </div>

            <h2 className="mt-6 text-[27px] font-semibold leading-[1.12] tracking-[-0.04em]">{copy.title}</h2>
            <p className="mt-4 text-[17px] leading-8 text-white/60">{copy.body}</p>

            <div className="mt-6 rounded-[18px] border border-white/10 bg-black/18 p-4">
              <p className="text-[14px] font-medium text-white/36">Assertion being evaluated</p>
              <p className="mt-2 text-[16px] font-semibold leading-6 text-white/82">{trace[active].assertion}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="text-[14px] text-white/42">Observed state</span>
                <span className={
                  active === 3
                    ? "font-mono text-[14px] font-semibold text-[#ff8da0]"
                    : active > 3
                      ? "font-mono text-[14px] font-semibold text-[#ecc57d]"
                      : "font-mono text-[14px] font-semibold text-[#6be1aa]"
                }>{trace[active].observed}</span>
              </div>
            </div>

            {complete ? (
              <div className="mt-5 rounded-[18px] border border-[#55d99b]/20 bg-[#55d99b]/[.06] p-4">
                <div className="flex items-center gap-2 text-[#70e5ae]">
                  <Sparkles size={16} />
                  <p className="text-[15px] font-semibold">Incident package ready</p>
                </div>
                <p className="mt-2 text-[15px] leading-6 text-white/55">Watchdog now knows the failed boundary, customer impact, protected actions, and safe replay point.</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {complete && run?.incident ? (
        <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[24px] border border-[#efbac4] bg-[#fff7f8] p-5 md:p-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--rose)] text-white">
                <TriangleAlert size={20} />
              </span>
              <div>
                <p className="text-[20px] font-semibold tracking-[-0.025em] text-[var(--ink)]">The failure is isolated to routing.</p>
                <p className="mt-2 text-[16px] leading-7 text-[var(--copy)]">
                  Website, AI and CRM all passed their contracts. The first invalid state is <span className="font-mono font-semibold text-[var(--rose)]">owner_id = null</span>, so recovery should start there.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-[24px] border border-[#dcdfff] bg-[#f3f4ff] p-5 md:p-6">
            <div>
              <p className="text-[18px] font-semibold text-[#252d8f]">This is only one Watchdog use case.</p>
              <p className="mt-2 text-[16px] leading-7 text-[#596196]">The same pattern can guard invoice approvals, onboarding, AI actions, data syncs, fulfilment and other multi-tool workflows.</p>
            </div>
            <button
              onClick={() => router.push("/use-cases")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5665ff] px-4 text-[14px] font-semibold text-white transition hover:bg-[#4352ec]"
            >
              Explore Watchdog use cases
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      ) : null}

      {complete ? (
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => router.push("/recovery?run=WD-1842")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35]"
          >
            Fix the failed boundary
            <ArrowRight size={17} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
