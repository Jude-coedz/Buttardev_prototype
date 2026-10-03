"use client";

import { useEffect, useRef, useState } from "react";
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
  Radar,
  Route,
  ShieldCheck,
  TriangleAlert,
  UserRoundCheck,
} from "lucide-react";
import type { JourneyRun } from "@/lib/watchdog-engine";

const trace = [
  { label: "Website", icon: Globe2, observed: "Enquiry accepted", assertion: "Required fields present" },
  { label: "AI", icon: Bot, observed: "Qualified lead", assertion: "Acknowledgement stays truthful" },
  { label: "CRM", icon: Database, observed: "crm_demo_1842", assertion: "Exactly one CRM record exists" },
  { label: "Routing", icon: Route, observed: "owner_id = null", assertion: "Exactly one owner must exist" },
  { label: "Team alert", icon: MessageSquare, observed: "Blocked", assertion: "Only run with a valid owner" },
  { label: "Follow-up", icon: UserRoundCheck, observed: "Blocked", assertion: "Only create an owned task" },
] as const;

const explanations = [
  {
    action: "Observe",
    title: "Watchdog reads the event leaving the website.",
    body: "The customer site keeps working normally. Watchdog receives a synthetic run ID and the event emitted at this boundary, then records the fields needed for the next assertion.",
    icon: Eye,
  },
  {
    action: "Assert",
    title: "The AI output is checked for business truth, not just uptime.",
    body: "An API key can work and the model can respond while the business outcome is still wrong. Here Watchdog verifies that a preferred date was not falsely turned into a confirmed booking.",
    icon: FileCheck2,
  },
  {
    action: "Observe",
    title: "The CRM record is valid and unique.",
    body: "Watchdog sees crm_demo_1842 and keeps that record ID as evidence. It does not edit the CRM record or replace the CRM.",
    icon: Database,
  },
  {
    action: "Detect",
    title: "The first broken state appears after routing.",
    body: "FlowCRM is healthy and the lead exists, but routing-v4 returns owner_id = null. This is the first handoff where the client-defined journey contract becomes false.",
    icon: TriangleAlert,
  },
  {
    action: "Guard",
    title: "The team notification is held before it becomes a bad side effect.",
    body: "This is the small inline part of Watchdog: the notification adapter checks whether the owner assertion passed before sending anything. It did not, so the action stays blocked.",
    icon: LockKeyhole,
  },
  {
    action: "Evidence",
    title: "Watchdog now has enough context to recover safely.",
    body: "The incident contains the failed boundary, expected and observed state, protected actions, CRM record ID, and replay key. A human or deployment pipeline applies the fix; Watchdog then verifies the replay.",
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
        scale: [0.98, 1.035, 1],
        duration: 500,
        ease: "out(4)",
      });
    }

    if (panel) {
      animate(panel, {
        opacity: [0.45, 1],
        translateY: [6, 0],
        duration: 340,
        ease: "out(4)",
      });
    }
  }, [active]);

  const copy = explanations[active];
  const CopyIcon = copy.icon;
  const complete = active === trace.length - 1;

  return (
    <div ref={shellRef} className="mx-auto max-w-[1420px] px-5 py-7 md:px-8 md:py-9">
      <section className="grid gap-7 lg:grid-cols-[.88fr_1.12fr] lg:items-end">
        <div>
          <p className="text-[16px] font-semibold text-[var(--blue)]">Step 4 · Watchdog</p>
          <h1 className="mt-3 max-w-[780px] text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[52px]">
            Watchdog sits beside the automation and watches the handoffs.
          </h1>
        </div>
        <p className="max-w-[650px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          Most of it is out-of-band: observe events, compare them with the business contract, and store evidence. Only a small guard needs to sit inline before sensitive side effects that must be stopped when a prerequisite fails.
        </p>
      </section>

      <section className="mt-7 rounded-[28px] border border-[var(--hairline)] bg-white p-5 shadow-[0_22px_70px_rgba(17,19,24,.055)] md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[18px] font-semibold text-[var(--ink)]">Where Watchdog actually runs</p>
            <p className="mt-1 text-[15px] text-[var(--copy)]">
              The client tools remain the system of record. Watchdog observes their boundaries and gates only selected side effects.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--blue-soft)] px-3 py-2 text-[14px] font-semibold text-[var(--blue-deep)]">
            <Radar size={15} />
            Sidecar control plane
          </span>
        </div>

        <div className="rounded-[22px] bg-[#f7f8fa] p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-6">
            {trace.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="relative">
                  <div className="rounded-[18px] border border-[#e1e4e8] bg-white p-4 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0f3] text-[#5d6672]">
                      <Icon size={18} />
                    </span>
                    <p className="mt-3 text-[15px] font-semibold text-[#242a31]">{item.label}</p>
                  </div>
                  {index < trace.length - 1 ? (
                    <ArrowRight size={16} className="absolute -right-[14px] top-1/2 z-10 hidden -translate-y-1/2 text-[#abb2bc] md:block" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="rounded-[18px] border border-[#dfe2e7] bg-white p-4">
              <p className="text-[13px] font-semibold text-[#8a929c]">Observe-only path</p>
              <p className="mt-1 text-[15px] leading-6 text-[#4e5762]">
                Webhooks · execution events · selected API responses · logs · CRM state · synthetic probes
              </p>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#5665ff] text-white">
                <ShieldCheck size={19} />
              </span>
            </div>

            <div className="rounded-[18px] border border-[#ead7ad] bg-[#fff9ec] p-4">
              <p className="text-[13px] font-semibold text-[#a2711c]">Inline only when guarding</p>
              <p className="mt-1 text-[15px] leading-6 text-[#695a40]">
                Before payment · email · team alert · task creation · fulfilment · another irreversible side effect
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[var(--hairline)] bg-white p-5">
          <p className="text-[14px] font-semibold text-[var(--blue)]">It can observe</p>
          <p className="mt-2 text-[16px] leading-7 text-[var(--copy)]">
            Event payloads, execution state, selected records, responses, and synthetic test runs needed to prove the customer journey still works.
          </p>
        </div>
        <div className="rounded-[22px] border border-[var(--hairline)] bg-white p-5">
          <p className="text-[14px] font-semibold text-[#a36c16]">It can guard</p>
          <p className="mt-2 text-[16px] leading-7 text-[var(--copy)]">
            A downstream action can be held until the required business assertion passes. This is optional and limited to actions worth protecting.
          </p>
        </div>
        <div className="rounded-[22px] border border-[var(--hairline)] bg-white p-5">
          <p className="text-[14px] font-semibold text-[#707986]">It does not fix code itself</p>
          <p className="mt-2 text-[16px] leading-7 text-[var(--copy)]">
            API credentials and uptime can be signals, but Watchdog is not just a key checker. Operators or CI/CD apply fixes; Watchdog identifies the boundary and verifies recovery.
          </p>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-[28px] bg-[#111318] text-white shadow-[0_30px_100px_rgba(17,19,24,.16)]">
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          <div className="border-b border-white/10 p-5 md:p-7 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[17px] font-semibold">Inspect this run</p>
                <p className="mt-1 text-[15px] text-white/48">Choose a boundary or move through them one at a time.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-[14px] font-medium text-white/65">
                <CircleDot size={14} className={complete ? "text-[#55d99b]" : "text-[#8f98ff]"} />
                {complete ? "Failure isolated" : `Boundary ${active + 1} of ${trace.length}`}
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {trace.map((item, index) => {
                const Icon = item.icon;
                const selected = index === active;
                const visited = index < active;
                const failure = index === 3 && active >= 3;
                const blocked = index > 3 && active >= index;

                return (
                  <button
                    key={item.label}
                    data-trace={index}
                    onClick={() => setActive(index)}
                    className={
                      selected
                        ? "min-h-[164px] rounded-[20px] border border-[#8d98ff]/65 bg-[#5865ff]/15 p-4 text-left shadow-[0_16px_38px_rgba(0,0,0,.18)]"
                        : failure
                          ? "min-h-[164px] rounded-[20px] border border-[#d94b63]/50 bg-[#d94b63]/10 p-4 text-left"
                          : blocked
                            ? "min-h-[164px] rounded-[20px] border border-[#d4a14c]/25 bg-[#d4a14c]/[.06] p-4 text-left"
                            : visited
                              ? "min-h-[164px] rounded-[20px] border border-[#39c885]/22 bg-[#39c885]/[.05] p-4 text-left"
                              : "min-h-[164px] rounded-[20px] border border-white/10 bg-white/[.025] p-4 text-left"
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
                      failure
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

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setActive((value) => Math.max(0, value - 1))}
                disabled={active === 0}
                className="h-11 rounded-xl border border-white/12 px-4 text-[14px] font-semibold text-white/65 transition hover:bg-white/[.06] disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => setActive((value) => Math.min(trace.length - 1, value + 1))}
                disabled={complete}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#f0f1f3] disabled:opacity-40"
              >
                Inspect next boundary
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <aside className="watchdog-explainer p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className={
                active >= 3
                  ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d94b63]/15 text-[#ff8da0]"
                  : "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#5865ff]/15 text-[#9aa4ff]"
              }>
                <CopyIcon size={20} />
              </span>
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[.08em] text-white/35">{copy.action}</p>
                <p className="mt-1 text-[17px] font-semibold">Boundary {active + 1}</p>
              </div>
            </div>

            <h2 className="mt-6 text-[27px] font-semibold leading-[1.12] tracking-[-0.04em]">{copy.title}</h2>
            <p className="mt-4 text-[17px] leading-8 text-white/60">{copy.body}</p>

            <div className="mt-6 rounded-[18px] border border-white/10 bg-black/18 p-4">
              <p className="text-[14px] font-medium text-white/36">Business assertion</p>
              <p className="mt-2 text-[16px] font-semibold leading-6 text-white/82">{trace[active].assertion}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="text-[14px] text-white/42">Observed</span>
                <span className={
                  active === 3
                    ? "font-mono text-[14px] font-semibold text-[#ff8da0]"
                    : active > 3
                      ? "font-mono text-[14px] font-semibold text-[#ecc57d]"
                      : "font-mono text-[14px] font-semibold text-[#6be1aa]"
                }>
                  {trace[active].observed}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {complete && run?.incident ? (
        <section className="mt-5 rounded-[24px] border border-[#efbac4] bg-[#fff7f8] p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--rose)] text-white">
              <TriangleAlert size={20} />
            </span>
            <div>
              <p className="text-[20px] font-semibold tracking-[-0.025em] text-[var(--ink)]">The failure is isolated to routing.</p>
              <p className="mt-2 text-[16px] leading-7 text-[var(--copy)]">
                Website, AI, and CRM all passed. The first invalid state is <span className="font-mono font-semibold text-[var(--rose)]">owner_id = null</span>, so recovery should start at the routing boundary.
              </p>
            </div>
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
