"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import {
  Bot,
  Braces,
  DatabaseZap,
  FileCheck2,
  GitBranch,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const modules = [
  {
    id: "probe",
    label: "Synthetic probe",
    eyebrow: "Safe input",
    icon: Bot,
    summary: "Creates a test enquiry that looks like a real journey event without using a real customer's identity.",
    sees: "A synthetic name, test email, postcode and service request.",
    never: "Real customer records or production PII in this prototype.",
    output: "A stable idempotency key that follows the run end to end.",
  },
  {
    id: "contract",
    label: "Journey contract",
    eyebrow: "Business truth",
    icon: FileCheck2,
    summary: "Turns the client's promise into assertions the system can verify at each handoff.",
    sees: "Expected outcomes such as one owner, truthful acknowledgement and a follow-up task.",
    never: "A vague green/red uptime signal with no business context.",
    output: "Readable pass/fail assertions tied to the customer outcome.",
  },
  {
    id: "adapters",
    label: "System adapters",
    eyebrow: "Controlled access",
    icon: Braces,
    summary: "Checks the same boundaries used by the real automation: form, AI, CRM, routing and notifications.",
    sees: "Only the fields required to verify a handoff.",
    never: "A blanket copy of every connected account or workspace.",
    output: "Step-level evidence with expected and actual values.",
  },
  {
    id: "evaluator",
    label: "Watchdog evaluator",
    eyebrow: "Decision layer",
    icon: GitBranch,
    summary: "Compares what happened with what the journey contract says must happen.",
    sees: "Assertion results, timings and guarded dependencies.",
    never: "Permission to invent a new business rule on its own.",
    output: "The exact failure boundary and customer impact.",
  },
  {
    id: "guards",
    label: "Guard rails",
    eyebrow: "Stop unsafe actions",
    icon: LockKeyhole,
    summary: "Prevents downstream actions from running when a required business condition has failed.",
    sees: "Whether prerequisites such as owner assignment are valid.",
    never: "A reason to push a broken lead further through the workflow.",
    output: "Blocked alerts/tasks instead of bad state spreading downstream.",
  },
  {
    id: "evidence",
    label: "Evidence + replay",
    eyebrow: "Safe recovery",
    icon: DatabaseZap,
    summary: "Packages the incident into human-readable evidence and allows a targeted replay after the fix.",
    sees: "Run ID, evidence, likely regression source and the existing idempotency key.",
    never: "A blind full-journey rerun that can duplicate a lead.",
    output: "An auditable incident and a bounded recovery path.",
  },
] as const;

export function UnderTheHood() {
  const [activeId, setActiveId] = useState<(typeof modules)[number]["id"]>("probe");
  const [tracing, setTracing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = modules.find((module) => module.id === activeId) ?? modules[0];

  useEffect(() => {
    const tooltip = containerRef.current?.querySelector(".hood-tooltip");
    if (!tooltip) return;
    animate(tooltip, {
      opacity: [0, 1],
      y: [8, 0],
      duration: 280,
      ease: "out(3)",
    });
  }, [activeId]);

  const trace = () => {
    if (tracing || !containerRef.current) return;
    setTracing(true);

    const nodes = containerRef.current.querySelectorAll(".hood-module");
    const rails = containerRef.current.querySelectorAll(".hood-rail");

    animate(nodes, {
      scale: [1, 1.035, 1],
      borderColor: ["#e2e8f0", "#60a5fa", "#e2e8f0"],
      delay: stagger(220),
      duration: 620,
      ease: "inOut(3)",
    });

    animate(rails, {
      scaleX: [0, 1],
      opacity: [0.18, 0.9, 0.3],
      delay: stagger(220, { start: 120 }),
      duration: 520,
      ease: "inOutQuad",
    });

    modules.forEach((module, index) => {
      window.setTimeout(() => setActiveId(module.id), 180 + index * 220);
    });

    window.setTimeout(() => setTracing(false), 1750);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <section className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_65px_rgba(15,23,42,.12)] md:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            Under the hood
          </div>
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.055em] md:text-[46px]">
            One watchdog run, picked apart.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-400">
            Click any layer to see exactly what it is responsible for, what data it touches, and where the safety boundary sits.
          </p>
        </div>
        <button
          onClick={trace}
          disabled={tracing}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {tracing ? <RotateCcw size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
          {tracing ? "Tracing check…" : "Trace one check"}
        </button>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_55px_rgba(15,23,42,.045)] md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">Watchdog execution path</p>
            <p className="mt-1 text-sm text-slate-500">The signal moves left to right. A failed assertion stops unsafe downstream work.</p>
          </div>
          <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 md:inline-flex">
            Interactive architecture
          </span>
        </div>

        <div className="grid gap-3 xl:grid-cols-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const selected = module.id === activeId;
            return (
              <div key={module.id} className="relative">
                <button
                  onClick={() => setActiveId(module.id)}
                  className={
                    selected
                      ? "hood-module relative z-10 flex h-full min-h-[150px] w-full flex-col rounded-[20px] border border-blue-300 bg-blue-50/70 p-4 text-left shadow-[0_10px_28px_rgba(37,99,235,.08)]"
                      : "hood-module relative z-10 flex h-full min-h-[150px] w-full flex-col rounded-[20px] border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50/70"
                  }
                >
                  <div className="mb-7 flex items-start justify-between gap-2">
                    <span className={selected ? "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white" : "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"}>
                      <Icon size={17} />
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-400">0{index + 1}</span>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{module.eyebrow}</p>
                  <p className="mt-1 text-[14px] font-semibold tracking-[-0.02em] text-slate-950">{module.label}</p>
                </button>
                {index < modules.length - 1 ? (
                  <span className="pointer-events-none absolute -right-3 top-1/2 z-20 hidden h-px w-3 -translate-y-1/2 overflow-hidden bg-slate-200 xl:block">
                    <span className="hood-rail block h-full origin-left bg-blue-500" />
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="hood-tooltip mt-5 grid gap-4 rounded-[22px] border border-slate-200 bg-[#f8fafc] p-5 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white">{active.eyebrow}</span>
              <span className="text-sm font-semibold text-slate-950">{active.label}</span>
            </div>
            <p className="max-w-2xl text-[15px] leading-7 text-slate-600">{active.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-emerald-700">What it sees</p>
                <p className="mt-2 text-sm leading-6 text-emerald-950/75">{active.sees}</p>
              </div>
              <div className="rounded-2xl border border-rose-200/70 bg-rose-50/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-rose-700">What it does not get</p>
                <p className="mt-2 text-sm leading-6 text-rose-950/75">{active.never}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Output of this layer</p>
            <p className="mt-3 text-[15px] font-semibold leading-6 text-slate-100">{active.output}</p>
            <div className="mt-5 border-t border-white/10 pt-4 font-mono text-[11px] leading-5 text-slate-500">
              scope: journey.residential_enquiry<br />
              mode: synthetic_only<br />
              replay: idempotent
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
