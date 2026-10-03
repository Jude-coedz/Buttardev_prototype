"use client";

import { useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  CircleDot,
  FileCheck2,
  FileText,
  Gauge,
  Home,
  Play,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  contractChecks,
  degradedSteps,
  healthySteps,
  recentRuns,
  type JourneyStep,
} from "@/lib/demo-data";
import { IncidentDrawer } from "@/components/incident-drawer";
import { UnderTheHood } from "@/components/under-the-hood";
import { TrustControls } from "@/components/trust-controls";

type View = "overview" | "live" | "underhood" | "trust" | "report";

const navItems: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "live", label: "Run Watchdog", icon: Activity },
  { id: "underhood", label: "Under the hood", icon: Braces },
  { id: "trust", label: "Trust & controls", icon: ShieldCheck },
  { id: "report", label: "Client proof", icon: FileText },
];

const spring = { type: "spring" as const, stiffness: 320, damping: 30 };

function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-950 text-white shadow-[0_8px_22px_rgba(15,23,42,0.18)]">
        <Route size={19} strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
      </div>
      <div>
        <p className="text-[17px] font-semibold tracking-[-0.035em] text-slate-950">Journey Watchdog</p>
        <p className="text-[12px] font-medium text-slate-500">ButtarDev prototype</p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <motion.div
      layout
      className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_9px_30px_rgba(15,23,42,0.035)]"
      whileHover={{ y: -2 }}
      transition={spring}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={17} />
        </span>
      </div>
      <p className="mb-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{detail}</p>
    </motion.div>
  );
}

function StatusDot({ state }: { state: JourneyStep["state"] }) {
  const style =
    state === "healthy"
      ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.10)]"
      : state === "failed"
        ? "bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,.10)]"
        : state === "checking"
          ? "bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,.12)]"
          : "bg-slate-300";
  return <span className={`h-2.5 w-2.5 rounded-full ${style}`} />;
}

function JourneyNode({
  step,
  index,
  running,
  progress,
  hasRun,
  onIncident,
}: {
  step: JourneyStep;
  index: number;
  running: boolean;
  progress: number;
  hasRun: boolean;
  onIncident: () => void;
}) {
  const isChecking = running && progress === index;
  const isDone = running && progress > index;

  const state: JourneyStep["state"] = !running && !hasRun
    ? "blocked"
    : isChecking
      ? "checking"
      : running && !isDone
        ? "blocked"
        : step.state;

  const nodeClass =
    state === "failed"
      ? "journey-node relative min-w-0 rounded-[18px] border border-rose-200 bg-rose-50/70 p-4 text-left transition-colors"
      : state === "checking"
        ? "journey-node relative min-w-0 rounded-[18px] border border-blue-300 bg-blue-50/80 p-4 text-left shadow-[0_10px_28px_rgba(37,99,235,.08)]"
        : state === "blocked"
          ? "journey-node relative min-w-0 rounded-[18px] border border-slate-200 bg-slate-50/70 p-4 text-left transition-colors"
          : "journey-node relative min-w-0 rounded-[18px] border border-emerald-200 bg-white p-4 text-left transition-colors";

  return (
    <motion.button
      layout
      className={nodeClass}
      onClick={state === "failed" ? onIncident : undefined}
      whileHover={state === "failed" ? { y: -2 } : undefined}
      transition={spring}
    >
      <div className="mb-5 flex items-center justify-between gap-2">
        <StatusDot state={state} />
        <span className="truncate rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-500">
          {step.tool}
        </span>
      </div>
      <p className="mb-1.5 text-[15px] font-semibold tracking-[-0.02em] text-slate-950">{step.label}</p>
      <p className="min-h-10 text-[13px] leading-5 text-slate-500">
        {!running && !hasRun
          ? "Waiting for synthetic probe"
          : isChecking
            ? "Verifying business assertion…"
            : step.detail}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">Step {index + 1}</span>
        <span className="font-mono text-[11px] text-slate-500">{isChecking ? "live" : step.duration}</span>
      </div>
      {state === "failed" ? (
        <span className="absolute -right-2 -top-2 inline-flex h-7 items-center rounded-full bg-rose-600 px-2.5 text-[11px] font-semibold text-white shadow-lg shadow-rose-200">
          Inspect
        </span>
      ) : null}
    </motion.button>
  );
}

function JourneyFlow({
  steps,
  running,
  progress,
  hasRun,
  onIncident,
}: {
  steps: JourneyStep[];
  running: boolean;
  progress: number;
  hasRun: boolean;
  onIncident: () => void;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[6%] right-[6%] top-[46px] hidden h-px bg-slate-200 xl:block">
        <span className="journey-connector absolute inset-0 origin-left bg-blue-500/60" />
      </div>
      <div className="relative grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {steps.map((step, index) => (
          <JourneyNode
            key={step.id}
            step={step}
            index={index}
            running={running}
            progress={progress}
            hasRun={hasRun}
            onIncident={onIncident}
          />
        ))}
      </div>
    </div>
  );
}

function Overview({
  onBegin,
  onUnderHood,
  onTrust,
}: {
  onBegin: () => void;
  onUnderHood: () => void;
  onTrust: () => void;
}) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-6"
    >
      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.05)] md:p-9">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <CircleDot size={13} />
              Client-delivery QA, not uptime monitoring
            </div>
            <h1 className="text-[39px] font-semibold leading-[1.02] tracking-[-0.062em] text-slate-950 md:text-[58px]">
              Prove the customer journey still works after the automation ships.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-slate-500">
              Journey Watchdog sends a safe synthetic enquiry through the same handoffs as a real customer, verifies the business promises at each step, and stops broken state from spreading downstream.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onBegin}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(15,23,42,.18)] transition hover:bg-slate-800"
              >
                <Play size={15} fill="currentColor" />
                Watch a live check
              </button>
              <button
                onClick={onUnderHood}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                <Braces size={16} />
                See how it works
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,.12)] md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-300">What Watchdog protects</p>
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <p className="mt-6 text-[22px] font-semibold leading-8 tracking-[-0.04em]">
            “We received your enquiry and will confirm availability with you.”
          </p>
          <div className="mt-7 space-y-3">
            {[
              ["1", "Send a synthetic enquiry", "No real customer identity"],
              ["2", "Verify every business promise", "Not just API status"],
              ["3", "Stop unsafe downstream actions", "Then explain the failure"],
            ].map(([n, title, detail]) => (
              <div key={n} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 font-mono text-[11px] text-slate-300">{n}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Journey health" value="83%" detail="5 of 6 promises currently pass" icon={Gauge} />
        <Metric label="Synthetic checks" value="42" detail="This week, with no client PII" icon={Bot} />
        <Metric label="Incidents caught" value="3" detail="Before the client reported them" icon={ShieldCheck} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[26px] border border-slate-200/80 bg-white p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">The important distinction</p>
              <p className="mt-1 text-sm text-slate-500">Every tool can be green while the actual customer outcome is broken.</p>
            </div>
            <FileCheck2 size={19} className="text-slate-400" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Tool health", "HubSpot returns 200", "Necessary, not enough"],
              ["Data health", "Lead record exists", "Still not the outcome"],
              ["Business outcome", "Exactly one owner will reply", "What Watchdog proves"],
            ].map(([label, example, conclusion]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-400">{label}</p>
                <p className="mt-3 text-[14px] font-semibold leading-5 text-slate-800">{example}</p>
                <p className={label === "Business outcome" ? "mt-4 text-xs font-semibold text-emerald-700" : "mt-4 text-xs font-semibold text-slate-400"}>{conclusion}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onTrust}
          className="group rounded-[26px] border border-emerald-200/80 bg-emerald-50/60 p-6 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <ShieldCheck size={18} />
            </span>
            <ArrowRight size={18} className="text-emerald-700 transition group-hover:translate-x-1" />
          </div>
          <p className="mt-6 text-[19px] font-semibold tracking-[-0.03em] text-slate-950">Safe enough to inspect.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            See exactly what data the prototype uses, how replay avoids duplicates, and which production controls are still required.
          </p>
        </button>
      </section>
    </motion.div>
  );
}

function LiveCheck({
  scenario,
  setScenario,
  running,
  progress,
  hasRun,
  runVerification,
  openIncident,
}: {
  scenario: "degraded" | "healthy";
  setScenario: (scenario: "degraded" | "healthy") => void;
  running: boolean;
  progress: number;
  hasRun: boolean;
  runVerification: () => void;
  openIncident: () => void;
}) {
  const steps = scenario === "degraded" ? degradedSteps : healthySteps;
  const degraded = scenario === "degraded";
  const activeStep = running && progress < steps.length ? steps[progress] : null;

  return (
    <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="space-y-6">
      <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_55px_rgba(15,23,42,.045)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">Guided check</span>
              <span className="text-xs font-semibold text-slate-400">Synthetic enquiry → assertions → failure boundary → safe recovery</span>
            </div>
            <h1 className="text-[35px] font-semibold leading-[1.05] tracking-[-0.055em] text-slate-950 md:text-[48px]">
              Watch the journey fail in a way uptime monitoring would miss.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
              The website, AI assistant and CRM all work. The failure is subtler: the routing rule returns no owner, so Watchdog blocks the next actions before bad state spreads.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runVerification}
              disabled={running}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-65"
            >
              {running ? <RefreshCw size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
              {running ? "Checking journey…" : hasRun ? "Run again" : "Run synthetic check"}
            </button>
            <button
              onClick={() => setScenario(degraded ? "healthy" : "degraded")}
              disabled={running}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
            >
              <WandSparkles size={16} />
              {degraded ? "Preview fixed state" : "Restore failure"}
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-2 sm:grid-cols-4">
          {[
            ["01", "Probe", "Synthetic only"],
            ["02", "Verify", "Business assertions"],
            ["03", "Protect", "Block bad state"],
            ["04", "Recover", "Replay safely"],
          ].map(([n, title, detail]) => (
            <div key={n} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="font-mono text-[10px] font-semibold text-slate-400">{n}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_48px_rgba(15,23,42,.04)] md:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">Residential enquiry · BrightHome Cleaning</p>
            <p className="mt-1 text-sm text-slate-500">A single synthetic lead follows the real journey contract from enquiry to follow-up.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <Bot size={13} />
            watchdog+1842@demo.local
          </span>
        </div>

        <JourneyFlow
          steps={steps}
          running={running}
          progress={progress}
          hasRun={hasRun}
          onIncident={openIncident}
        />

        <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
          {running && activeStep ? (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Activity size={15} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Now checking: {activeStep.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Watchdog is not asking whether <strong>{activeStep.tool}</strong> is online. It is checking whether this handoff produced the business state the next step depends on.
                </p>
              </div>
            </div>
          ) : hasRun && degraded ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <AlertCircle size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Failure isolated at owner assignment.</p>
                  <p className="mt-1 text-sm text-slate-500">The alert and follow-up task were deliberately protected from running.</p>
                </div>
              </div>
              <button onClick={openIncident} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
                Inspect evidence <ArrowRight size={15} />
              </button>
            </div>
          ) : hasRun ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Check size={16} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-950">All six business assertions passed.</p>
                <p className="mt-1 text-sm text-slate-500">The customer promise is intact end to end.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-slate-600"><Play size={14} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Ready to verify.</p>
                <p className="mt-1 text-sm text-slate-500">Run the synthetic check above. Each node will explain itself as the signal passes through.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 md:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold text-slate-950">Journey contract</p>
            <p className="mt-1 text-sm text-slate-500">The human-readable promises Watchdog turns into executable assertions.</p>
          </div>
          <div className="space-y-2">
            {contractChecks.slice(0, 4).map((check) => (
              <div key={check.title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/65 p-3">
                <span className={check.status === "passing" ? "mt-0.5 text-emerald-600" : "mt-0.5 text-amber-700"}>
                  {check.status === "passing" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{check.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{check.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">{check.target}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 md:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold text-slate-950">Recent evidence</p>
            <p className="mt-1 text-sm text-slate-500">A lightweight audit trail of what Watchdog actually observed.</p>
          </div>
          <div className="space-y-2">
            {recentRuns.slice(0, 4).map((run) => (
              <div key={run.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 rounded-xl border border-slate-100 px-3 py-3">
                <span className="font-mono text-[11px] font-semibold text-slate-500">{run.id}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{run.note}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{run.time} · {run.duration}</p>
                </div>
                <span className={run.result === "Passed" ? "rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700" : "rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700"}>
                  {run.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function Report() {
  return (
    <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="space-y-6">
      <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold text-slate-500">Client-facing proof</p>
        <h1 className="text-[35px] font-semibold tracking-[-0.055em] text-slate-950 md:text-[48px]">Turn support into evidence, not reassurance.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
          The weekly report tells a client what was verified, what was caught proactively, and whether any customer promise was compromised.
        </p>
      </section>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-7">
          <div>
            <p className="text-sm font-semibold text-slate-500">BrightHome Cleaning</p>
            <h2 className="mt-1 text-[27px] font-semibold tracking-[-0.045em] text-slate-950">Customer journey assurance</h2>
            <p className="mt-2 text-sm text-slate-500">24 Sep – 1 Oct 2026</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
            <p className="text-[26px] font-semibold tracking-[-0.04em] text-emerald-800">99.2%</p>
            <p className="text-xs font-semibold text-emerald-700">verified availability</p>
          </div>
        </div>

        <div className="grid gap-px bg-slate-200 md:grid-cols-3">
          {[
            ["42", "synthetic checks"],
            ["3", "issues caught proactively"],
            ["0", "customer-facing false promises"],
          ].map(([value, label]) => (
            <div key={label} className="bg-white p-6">
              <p className="text-[30px] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="p-7">
          <p className="mb-4 text-sm font-semibold text-slate-950">What ButtarDev caught before it became a client complaint</p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/65 p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle size={17} className="text-amber-700" />
              <span className="text-sm font-semibold text-amber-900">Owner routing regression · 1 Oct</span>
            </div>
            <p className="text-sm leading-6 text-amber-900/75">
              A CRM mapping change stopped Birmingham enquiries receiving an owner. The synthetic journey caught it while the website, CRM and notification services were all technically online.
            </p>
          </div>
          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-400" size={20} />
              <div>
                <p className="text-sm font-semibold text-white">Customer promise remained protected</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No invalid team alert or follow-up task was created while the routing assertion was failing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WatchdogApp() {
  const [view, setView] = useState<View>("overview");
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [scenario, setScenario] = useState<"degraded" | "healthy">("degraded");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(8);
  const [hasRun, setHasRun] = useState(false);

  const runJourneyCheck = async (mode: "degraded" | "healthy") => {
    if (running) return;
    setView("live");
    setRunning(true);
    setHasRun(false);
    setProgress(0);

    try {
      const response = await fetch("/api/watchdog/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: mode }),
      });

      if (!response.ok) throw new Error(`Watchdog run failed with status ${response.status}`);

      const result = (await response.json()) as {
        status: "passed" | "failed";
        incident: unknown | null;
      };

      setScenario(result.status === "passed" ? "healthy" : "degraded");

      animate(".journey-node", {
        scale: [1, 1.02, 1],
        delay: stagger(125),
        duration: 590,
        ease: "out(3)",
      });

      animate(".journey-connector", {
        scaleX: [0.02, 1],
        opacity: [0.15, 0.9, 0.35],
        duration: 2600,
        ease: "inOutQuad",
      });

      for (let index = 0; index < 6; index += 1) {
        setProgress(index);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
      }

      setProgress(7);
      setHasRun(true);
      setRunning(false);

      if (result.incident) {
        window.setTimeout(() => setIncidentOpen(true), 380);
      }
    } catch (error) {
      console.error(error);
      setProgress(8);
      setHasRun(true);
      setRunning(false);
    }
  };

  const beginGuidedCheck = () => {
    setView("live");
    window.setTimeout(() => void runJourneyCheck("degraded"), 180);
  };

  const replayRecoveredJourney = () => {
    setIncidentOpen(false);
    setScenario("healthy");
    window.setTimeout(() => void runJourneyCheck("healthy"), 220);
  };

  const content = useMemo(() => {
    if (view === "underhood") return <UnderTheHood />;
    if (view === "trust") return <TrustControls />;
    if (view === "report") return <Report />;
    if (view === "live") {
      return (
        <LiveCheck
          scenario={scenario}
          setScenario={(next) => {
            setScenario(next);
            setHasRun(false);
            setProgress(8);
          }}
          running={running}
          progress={progress}
          hasRun={hasRun}
          runVerification={() => void runJourneyCheck(scenario)}
          openIncident={() => setIncidentOpen(true)}
        />
      );
    }
    return (
      <Overview
        onBegin={beginGuidedCheck}
        onUnderHood={() => setView("underhood")}
        onTrust={() => setView("trust")}
      />
    );
  }, [view, scenario, running, progress, hasRun]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f5f5f1] text-slate-950">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] border-r border-slate-200/80 bg-[#fbfbf8] px-4 py-5 lg:flex lg:flex-col">
          <div className="px-2"><AppLogo /></div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-blue-600">What this is</p>
            <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">A watchdog for business outcomes after client automations go live.</p>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={
                    active
                      ? "flex h-11 w-full items-center gap-3 rounded-xl bg-slate-950 px-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                      : "flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  }
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/65 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.09em] text-emerald-700">Data boundary</span>
                <Sparkles size={14} className="text-emerald-600" />
              </div>
              <p className="text-sm font-semibold leading-5 text-slate-800">Synthetic identities only.</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">No external client system is connected in this prototype.</p>
            </div>
            <div className="flex items-center gap-3 px-2 py-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-xs font-bold text-slate-700">JA</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Jude Akede</p>
                <p className="text-xs text-slate-500">Representative client build</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[258px]">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f5f5f1]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-4 md:px-7">
              <div className="lg:hidden"><AppLogo /></div>
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm lg:flex">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[12px] font-bold text-blue-700">BH</span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Demo client</p>
                  <p className="text-sm font-semibold text-slate-800">BrightHome Cleaning</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Synthetic-only demo
                </span>
                <button
                  onClick={beginGuidedCheck}
                  disabled={running}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <Play size={14} fill="currentColor" />
                  <span className="hidden sm:inline">Run Watchdog</span>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 md:px-7 md:pb-28 md:pt-8 lg:pb-8">
            <AnimatePresence mode="wait">{content}</AnimatePresence>
          </main>
        </div>

        <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-5 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-[0_18px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                aria-label={item.label}
                className={
                  active
                    ? "flex h-12 flex-col items-center justify-center gap-1 rounded-xl bg-slate-950 text-white"
                    : "flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-800"
                }
              >
                <Icon size={16} />
                <span className="text-[9px] font-semibold leading-none">
                  {item.id === "overview" ? "Home" : item.id === "live" ? "Run" : item.id === "underhood" ? "How" : item.id === "trust" ? "Trust" : "Proof"}
                </span>
              </button>
            );
          })}
        </nav>

        <IncidentDrawer
          open={incidentOpen}
          onClose={() => setIncidentOpen(false)}
          onReplay={replayRecoveredJourney}
        />
      </div>
    </MotionConfig>
  );
}
