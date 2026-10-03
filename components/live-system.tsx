"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "animejs";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CircleDot,
  Database,
  Globe2,
  LockKeyhole,
  MessageSquare,
  Play,
  RefreshCw,
  Route,
  ShieldCheck,
  UserRound,
  Workflow,
  X,
} from "lucide-react";

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const phaseCopy: Record<Phase, { eyebrow: string; title: string; body: string }> = {
  0: {
    eyebrow: "Start here",
    title: "A normal customer journey, before Watchdog touches it.",
    body: "BrightHome receives cleaning enquiries through its website. The automation qualifies the lead, creates the CRM record, assigns an owner, alerts the team and schedules follow-up.",
  },
  1: {
    eyebrow: "1 · Customer app",
    title: "A synthetic customer submits a real-looking enquiry.",
    body: "Watchdog uses an isolated test identity, so it can exercise the production journey without borrowing a real customer's data.",
  },
  2: {
    eyebrow: "2 · AI handoff",
    title: "The AI qualifies the lead and keeps the acknowledgement truthful.",
    body: "The preferred date is captured as a request, not silently converted into a confirmed booking.",
  },
  3: {
    eyebrow: "3 · CRM handoff",
    title: "The CRM record is created successfully.",
    body: "Everything still looks healthy at the infrastructure level. The form worked, the model responded and the CRM accepted the record.",
  },
  4: {
    eyebrow: "4 · Hidden regression",
    title: "The routing rule returns no owner.",
    body: "A field was renamed upstream. The CRM still returns success, but the business outcome is now broken because nobody owns the next response.",
  },
  5: {
    eyebrow: "5 · Watchdog intervention",
    title: "Watchdog catches the broken business assertion.",
    body: "It compares the observed state with the journey contract, isolates the failure at routing, and blocks Slack + follow-up from receiving invalid state.",
  },
  6: {
    eyebrow: "6 · Safe recovery",
    title: "The mapping is fixed and replay resumes from the failure boundary.",
    body: "The same idempotency key reuses the synthetic CRM lead, assigns the Birmingham owner and safely completes the downstream actions.",
  },
};

function BrowserChrome({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,.08)]">
      <div className="flex h-11 items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-400">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function CustomerApp({ phase }: { phase: Phase }) {
  const submitted = phase >= 1;

  return (
    <div data-stage="website" className={`watch-stage ${phase === 0 || phase === 1 ? "watch-stage-active" : ""}`}>
      <BrowserChrome title="brighthome.co.uk/book">
        <div className="grid min-h-[375px] md:grid-cols-[.86fr_1.14fr]">
          <div className="hidden bg-slate-950 p-7 text-white md:block">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10"><Globe2 size={15} /></span>
              BrightHome
            </div>
            <p className="mt-12 text-[28px] font-semibold leading-[1.08] tracking-[-0.05em]">A cleaner home, without the back-and-forth.</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">Tell us what you need. A team member will confirm availability with you.</p>
            <div className="mt-10 flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck size={14} className="text-emerald-400" />
              Preferred dates are requests until confirmed
            </div>
          </div>

          <div className="relative p-6 md:p-7">
            {!submitted ? (
              <>
                <p className="text-[18px] font-semibold tracking-[-0.03em] text-slate-950">Request a deep clean</p>
                <p className="mt-1 text-sm text-slate-500">Demo form prefilled with Watchdog's synthetic customer.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Name", "Amina Test"],
                    ["Email", "watchdog+1842@demo.local"],
                    ["Postcode", "B15 2TT"],
                    ["Property", "3 bedroom"],
                    ["Service", "Residential deep clean"],
                    ["Preferred date", "6 October 2026"],
                  ].map(([label, value]) => (
                    <label key={label} className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.08em] text-slate-400">{label}</span>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-medium text-slate-700">{value}</div>
                    </label>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">Submit enquiry</div>
              </>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Check size={22} />
                  </span>
                  <p className="mt-5 text-[22px] font-semibold tracking-[-0.04em] text-slate-950">Enquiry received</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">We have your preferred date. A team member will confirm availability with you.</p>
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    Truthful acknowledgement · no booking promise made
                  </div>
                </div>
              </div>
            )}

            {submitted ? <span className="probe-ring pointer-events-none absolute inset-4 rounded-[20px] border border-blue-400/45" /> : null}
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
}

function AiAndCrm({ phase }: { phase: Phase }) {
  const aiReady = phase >= 2;
  const crmReady = phase >= 3;
  const routingFailed = phase >= 4 && phase < 6;
  const recovered = phase >= 6;

  return (
    <div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]">
      <div data-stage="ai" className={`watch-stage ${phase === 2 ? "watch-stage-active" : ""}`}>
        <div className="h-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.055)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Bot size={17} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Qualifier AI</p>
                <p className="text-[11px] text-slate-400">BrightHome enquiry agent</p>
              </div>
            </div>
            <span className={aiReady ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500"}>
              {aiReady ? "Complete" : "Waiting"}
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            <div className="rounded-2xl rounded-bl-md bg-slate-100 p-3 text-[13px] leading-5 text-slate-600">I need a deep clean for a 3-bedroom home in B15. Tuesday would be ideal.</div>
            {aiReady ? (
              <div className="ai-response rounded-2xl rounded-br-md bg-violet-600 p-3 text-[13px] leading-5 text-white">
                Thanks Amina — I have recorded Tuesday as your preferred date. A BrightHome team member will confirm availability.
              </div>
            ) : (
              <div className="h-[72px] rounded-2xl rounded-br-md border border-dashed border-slate-200 bg-slate-50" />
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              ["Service", aiReady ? "Deep clean" : "—"],
              ["Postcode", aiReady ? "B15 2TT" : "—"],
              ["Property", aiReady ? "3 bedroom" : "—"],
              ["Confidence", aiReady ? "96%" : "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-slate-400">{label}</p>
                <p className="mt-1 text-xs font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-stage="crm" className={`watch-stage ${phase === 3 || phase === 4 ? "watch-stage-active" : ""}`}>
        <BrowserChrome title="crm.brighthome.internal/leads/crm_demo_1842">
          <div className="min-h-[365px] bg-[#f8fafc]">
            <div className="flex border-b border-slate-200 bg-white">
              <div className="hidden w-36 border-r border-slate-200 p-3 md:block">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">FlowCRM</p>
                {["Leads", "Tasks", "Automations", "Reports"].map((item, i) => (
                  <div key={item} className={i === 0 ? "mb-1 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700" : "mb-1 px-2.5 py-2 text-xs font-medium text-slate-400"}>{item}</div>
                ))}
              </div>
              <div className="min-w-0 flex-1 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-slate-400">Lead record</p>
                    <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.035em] text-slate-950">{crmReady ? "Amina Test" : "Waiting for lead…"}</h3>
                    <p className="mt-1 font-mono text-[11px] text-slate-400">{crmReady ? "crm_demo_1842" : "—"}</p>
                  </div>
                  <span className={crmReady ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500"}>
                    {crmReady ? "Created" : "No record"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Service", crmReady ? "Residential deep clean" : "—"],
                    ["Postcode", crmReady ? "B15 2TT" : "—"],
                    ["Preferred date", crmReady ? "06 Oct · request" : "—"],
                    ["Owner", recovered ? "Saim · Birmingham" : routingFailed ? "No owner" : crmReady ? "Resolving…" : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className={`rounded-xl border p-3 ${label === "Owner" && routingFailed ? "routing-failure border-rose-300 bg-rose-50" : label === "Owner" && recovered ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-slate-400">{label}</p>
                      <p className={`mt-1 text-sm font-semibold ${label === "Owner" && routingFailed ? "text-rose-700" : "text-slate-800"}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Automation event</span>
                    <span className="font-mono text-[10px] text-slate-400">routing-v4</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px] leading-5 text-slate-500">
                    postcode = "B15 2TT"<br />
                    expected_owner = "saim.birmingham"<br />
                    owner_id = <span className={routingFailed ? "font-semibold text-rose-600" : recovered ? "font-semibold text-emerald-600" : ""}>{routingFailed ? "null" : recovered ? '"saim.birmingham"' : "pending"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BrowserChrome>
      </div>
    </div>
  );
}

function DownstreamApps({ phase }: { phase: Phase }) {
  const blocked = phase >= 5 && phase < 6;
  const recovered = phase >= 6;

  return (
    <div data-stage="downstream" className={`watch-stage ${phase === 5 || phase === 6 ? "watch-stage-active" : ""}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-[22px] border p-5 ${blocked ? "border-slate-300 bg-slate-100" : recovered ? "border-emerald-200 bg-white" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><MessageSquare size={17} /></span>
              <div><p className="text-sm font-semibold text-slate-950">Team chat</p><p className="text-[11px] text-slate-400">#birmingham-leads</p></div>
            </div>
            {blocked ? <LockKeyhole size={16} className="text-slate-400" /> : recovered ? <CheckCircle2 size={16} className="text-emerald-600" /> : null}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            {recovered ? (
              <>
                <p className="text-xs font-semibold text-slate-800">New qualified lead · Amina Test</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Deep clean · B15 2TT · Owner: Saim · preferred 6 Oct</p>
              </>
            ) : blocked ? (
              <p className="text-xs font-semibold text-slate-400">Not sent — Watchdog blocked an unowned lead.</p>
            ) : (
              <p className="text-xs font-medium text-slate-400">Waiting for a valid owned lead…</p>
            )}
          </div>
        </div>

        <div className={`rounded-[22px] border p-5 ${blocked ? "border-slate-300 bg-slate-100" : recovered ? "border-emerald-200 bg-white" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><UserRound size={17} /></span>
              <div><p className="text-sm font-semibold text-slate-950">Follow-up queue</p><p className="text-[11px] text-slate-400">CRM tasks</p></div>
            </div>
            {blocked ? <LockKeyhole size={16} className="text-slate-400" /> : recovered ? <CheckCircle2 size={16} className="text-emerald-600" /> : null}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            {recovered ? (
              <>
                <p className="text-xs font-semibold text-slate-800">Confirm availability with Amina</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Assigned to Saim · due in 5 minutes</p>
              </>
            ) : blocked ? (
              <p className="text-xs font-semibold text-slate-400">Not created — invalid owner would create an orphan task.</p>
            ) : (
              <p className="text-xs font-medium text-slate-400">Waiting for a valid owner…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchdogConsole({ phase }: { phase: Phase }) {
  const failed = phase >= 5 && phase < 6;
  const recovered = phase >= 6;
  const observing = phase > 0;

  const checks = [
    { label: "Truthful acknowledgement", active: phase >= 2, status: "pass" },
    { label: "CRM record created once", active: phase >= 3, status: "pass" },
    { label: "Exactly one owner assigned", active: phase >= 4, status: failed ? "fail" : recovered ? "pass" : "wait" },
    { label: "Downstream work has valid owner", active: phase >= 5, status: failed ? "blocked" : recovered ? "pass" : "wait" },
  ];

  return (
    <div data-stage="watchdog" className={`watchdog-console relative overflow-hidden rounded-[26px] border p-5 text-white shadow-[0_20px_65px_rgba(15,23,42,.17)] md:p-6 ${failed ? "border-rose-500/40 bg-[#160f14]" : "border-slate-800 bg-slate-950"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,.16),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(16,185,129,.10),transparent_34%)]" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${failed ? "bg-rose-500 text-white" : recovered ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"}`}>
              <ShieldCheck size={19} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Journey Watchdog</p>
              <p className="mt-0.5 text-xs text-slate-500">{observing ? "Observing the live synthetic journey" : "Ready to observe"}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 font-mono text-[10px] text-slate-400">
            <CircleDot size={12} className={observing ? "text-emerald-400" : "text-slate-600"} />
            watchdog:brighthome:residential:1842
          </span>
        </div>

        <div className="mt-6 grid gap-2 md:grid-cols-4">
          {checks.map((check) => {
            const status = !check.active ? "wait" : check.status;
            return (
              <div key={check.label} className={`rounded-xl border p-3 ${status === "fail" ? "border-rose-500/40 bg-rose-500/10" : status === "blocked" ? "border-amber-400/25 bg-amber-400/[.07]" : status === "pass" ? "border-emerald-400/20 bg-emerald-400/[.06]" : "border-white/10 bg-white/[.025]"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold leading-4 text-slate-300">{check.label}</span>
                  {status === "pass" ? <Check size={13} className="shrink-0 text-emerald-400" /> : status === "fail" ? <X size={13} className="shrink-0 text-rose-400" /> : status === "blocked" ? <LockKeyhole size={12} className="shrink-0 text-amber-300" /> : <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />}
                </div>
                <p className={`mt-2 font-mono text-[9px] uppercase tracking-[.08em] ${status === "fail" ? "text-rose-400" : status === "blocked" ? "text-amber-300" : status === "pass" ? "text-emerald-400" : "text-slate-600"}`}>
                  {status === "fail" ? "FAILED" : status === "blocked" ? "PROTECTED" : status === "pass" ? "PASS" : "WAITING"}
                </p>
              </div>
            );
          })}
        </div>

        {failed ? (
          <div className="watchdog-finding mt-4 grid gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/[.08] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white"><AlertTriangle size={15} /></span>
              <div>
                <p className="text-sm font-semibold text-white">Business outcome failed at routing</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Expected <span className="font-mono text-slate-200">owner_id = saim.birmingham</span> · observed <span className="font-mono text-rose-300">owner_id = null</span>. Slack and follow-up have been stopped.</p>
              </div>
            </div>
            <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-[10px] text-slate-400">likely regression: assignee_id → owner_id</span>
          </div>
        ) : recovered ? (
          <div className="watchdog-finding mt-4 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[.07] p-4">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white"><Check size={15} /></span>
            <div>
              <p className="text-sm font-semibold text-white">Recovery verified without a duplicate lead</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">The same idempotency key reused <span className="font-mono text-slate-200">crm_demo_1842</span>, owner assignment now passes, and downstream work completed.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LiveSystem() {
  const [phase, setPhase] = useState<Phase>(0);
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const current = phaseCopy[phase];

  const focusStage = useMemo(() => {
    if (phase <= 1) return "website";
    if (phase === 2) return "ai";
    if (phase === 3 || phase === 4) return "crm";
    if (phase === 5) return "watchdog";
    return "downstream";
  }, [phase]);

  useEffect(() => {
    const active = viewportRef.current?.querySelector(`[data-stage="${focusStage}"]`);
    if (active) {
      animate(active, {
        scale: [0.992, 1.008, 1],
        opacity: [0.86, 1],
        duration: 620,
        ease: "out(4)",
      });
    }

    if (phase >= 1) {
      animate(".probe-ring", {
        opacity: [0, 0.85, 0.18],
        scale: [0.985, 1.01, 1],
        duration: 850,
        ease: "out(3)",
      });
    }

    if (phase === 4) {
      animate(".routing-failure", {
        scale: [1, 1.035, 1],
        duration: 680,
        loop: 2,
        ease: "inOut(3)",
      });
    }

    if (phase >= 5) {
      animate(".watchdog-finding", {
        opacity: [0, 1],
        y: [10, 0],
        duration: 520,
        ease: "out(4)",
      });
    }
  }, [phase, focusStage]);

  const next = async () => {
    if (phase === 0) {
      setLoading(true);
      try {
        await fetch("/api/watchdog/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: "degraded" }),
        });
      } finally {
        setLoading(false);
      }
      setPhase(1);
      return;
    }
    if (phase < 5) setPhase((phase + 1) as Phase);
  };

  const recover = async () => {
    setLoading(true);
    try {
      await fetch("/api/watchdog/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "healthy" }),
      });
    } finally {
      setLoading(false);
    }
    setPhase(6);
  };

  const reset = () => setPhase(0);

  return (
    <div ref={viewportRef} className="space-y-5">
      <section className="grid gap-5 rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.045)] md:p-8 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Workflow size={14} />
            Interactive system walkthrough
          </div>
          <h1 className="max-w-3xl text-[38px] font-semibold leading-[1.02] tracking-[-0.06em] text-slate-950 md:text-[56px]">
            See exactly what Watchdog is watching.
          </h1>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-xl text-[16px] leading-7 text-slate-500">
            Follow one synthetic BrightHome enquiry through the customer app, AI, CRM, routing and downstream team tools. You control the pace.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5">No real customer data</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5">No live client credentials</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5">Replay-safe</span>
          </div>
        </div>
      </section>

      <section className="sticky top-[80px] z-10 rounded-[24px] border border-slate-200/90 bg-[#f8f8f5]/95 p-3 shadow-[0_12px_40px_rgba(15,23,42,.06)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-blue-600">{current.eyebrow}</p>
            <p className="mt-1 text-[15px] font-semibold tracking-[-.02em] text-slate-950">{current.title}</p>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-slate-500">{current.body}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {phase > 0 && phase < 6 ? (
              <button onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300">
                <RefreshCw size={14} /> Reset
              </button>
            ) : null}
            {phase < 5 ? (
              <button onClick={next} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                {loading ? <RefreshCw size={14} className="animate-spin" /> : phase === 0 ? <Play size={14} fill="currentColor" /> : null}
                {phase === 0 ? "Start with the enquiry" : "Continue"}
                {!loading && phase > 0 ? <ArrowRight size={14} /> : null}
              </button>
            ) : phase === 5 ? (
              <button onClick={recover} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Route size={14} />}
                Fix mapping & replay
              </button>
            ) : (
              <button onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white">
                <RefreshCw size={14} /> Run from the start
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${step <= phase ? step === 4 || step === 5 ? "bg-rose-400" : step === 6 ? "bg-emerald-500" : "bg-blue-500" : "bg-slate-200"}`} />
          ))}
        </div>
      </section>

      <div className="grid gap-5">
        <CustomerApp phase={phase} />
        <div className="relative flex items-center justify-center py-1">
          <div className="h-8 w-px bg-slate-200" />
          <span className={`absolute inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white ${phase >= 2 ? "border-blue-300 text-blue-600" : "border-slate-200 text-slate-300"}`}><ArrowRight size={12} className="rotate-90" /></span>
        </div>
        <AiAndCrm phase={phase} />
        <div className="relative my-1">
          <WatchdogConsole phase={phase} />
          <div className="pointer-events-none absolute -top-5 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className={`h-5 w-px ${phase >= 4 ? "bg-blue-400" : "bg-slate-200"}`} />
            <span className={`h-2.5 w-2.5 rounded-full border-2 border-white ${phase >= 4 ? "signal-dot bg-blue-500 shadow-[0_0_0_5px_rgba(59,130,246,.12)]" : "bg-slate-300"}`} />
          </div>
        </div>
        <div className="relative flex items-center justify-center py-1">
          <div className="h-8 w-px bg-slate-200" />
          <span className={`absolute inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white ${phase >= 5 ? phase === 6 ? "border-emerald-300 text-emerald-600" : "border-amber-300 text-amber-600" : "border-slate-200 text-slate-300"}`}><ArrowRight size={12} className="rotate-90" /></span>
        </div>
        <DownstreamApps phase={phase} />
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Database size={16} /></span>
            <div><p className="text-sm font-semibold text-slate-900">Synthetic probe</p><p className="mt-1 text-xs leading-5 text-slate-500">Exercises the real journey shape using isolated demo data.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Workflow size={16} /></span>
            <div><p className="text-sm font-semibold text-slate-900">Business assertions</p><p className="mt-1 text-xs leading-5 text-slate-500">Checks outcomes between systems, not merely whether each tool responds.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={16} /></span>
            <div><p className="text-sm font-semibold text-slate-900">Guarded recovery</p><p className="mt-1 text-xs leading-5 text-slate-500">Stops unsafe downstream work and replays from the failure boundary.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
