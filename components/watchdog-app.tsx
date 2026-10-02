"use client";

import { useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BellRing,
  Bot,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  History,
  Home,
  Layers3,
  MailCheck,
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

type View = "overview" | "journeys" | "runs" | "contract" | "report";

const navItems: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "journeys", label: "Journeys", icon: Route },
  { id: "runs", label: "Run history", icon: History },
  { id: "contract", label: "Journey contract", icon: FileCheck2 },
  { id: "report", label: "Client report", icon: FileText },
];

const spring = { type: "spring" as const, stiffness: 320, damping: 30 };

function StatusDot({ state }: { state: JourneyStep["state"] }) {
  const style =
    state === "healthy"
      ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.10)]"
      : state === "failed"
        ? "bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,.10)]"
        : state === "checking"
          ? "bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,.10)]"
          : "bg-slate-300";

  return <span className={`h-2.5 w-2.5 rounded-full ${style}`} />;
}

function ResultPill({ result }: { result: string }) {
  return (
    <span
      className={
        result === "Passed"
          ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
          : "inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"
      }
    >
      <span
        className={
          result === "Passed"
            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
            : "h-1.5 w-1.5 rounded-full bg-rose-500"
        }
      />
      {result}
    </span>
  );
}

function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-950 text-white shadow-[0_8px_22px_rgba(15,23,42,0.18)]">
        <Route size={19} strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
      </div>
      <div>
        <p className="text-[17px] font-semibold tracking-[-0.035em] text-slate-950">
          Journey Watchdog
        </p>
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

function JourneyNode({
  step,
  index,
  running,
  progress,
  onIncident,
}: {
  step: JourneyStep;
  index: number;
  running: boolean;
  progress: number;
  onIncident: () => void;
}) {
  const isChecking = running && progress === index;
  const isDone = running && progress > index;
  const state: JourneyStep["state"] = isChecking
    ? "checking"
    : running && !isDone
      ? "blocked"
      : step.state;

  const nodeClass =
    state === "failed"
      ? "journey-node relative min-w-0 rounded-[18px] border border-rose-200 bg-rose-50/70 p-4 text-left transition-colors"
      : state === "blocked"
        ? "journey-node relative min-w-0 rounded-[18px] border border-slate-200 bg-slate-50/80 p-4 text-left transition-colors"
        : state === "checking"
          ? "journey-node relative min-w-0 rounded-[18px] border border-blue-200 bg-blue-50/70 p-4 text-left transition-colors"
          : "journey-node relative min-w-0 rounded-[18px] border border-slate-200 bg-white p-4 text-left transition-colors";

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
        <span className="truncate rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
          {step.tool}
        </span>
      </div>
      <p className="mb-1.5 text-[15px] font-semibold tracking-[-0.02em] text-slate-950">
        {step.label}
      </p>
      <p className="min-h-10 text-[13px] leading-5 text-slate-500">
        {isChecking ? "Verifying business assertion…" : step.detail}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
          Step {index + 1}
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          {isChecking ? "live" : step.duration}
        </span>
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
  onIncident,
}: {
  steps: JourneyStep[];
  running: boolean;
  progress: number;
  onIncident: () => void;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[6%] right-[6%] top-[46px] hidden h-px bg-slate-200 xl:block">
        <span className="journey-connector absolute inset-0 origin-left bg-slate-900/25" />
      </div>
      <div className="relative grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {steps.map((step, index) => (
          <JourneyNode
            key={step.id}
            step={step}
            index={index}
            running={running}
            progress={progress}
            onIncident={onIncident}
          />
        ))}
      </div>
    </div>
  );
}

function Overview({
  scenario,
  setScenario,
  running,
  progress,
  runVerification,
  openIncident,
}: {
  scenario: "degraded" | "healthy";
  setScenario: (scenario: "degraded" | "healthy") => void;
  running: boolean;
  progress: number;
  runVerification: () => void;
  openIncident: () => void;
}) {
  const steps = scenario === "degraded" ? degradedSteps : healthySteps;
  const degraded = scenario === "degraded";

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-6"
    >
      <section className="grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
        <div
          className={
            degraded
              ? "relative overflow-hidden rounded-[24px] border border-amber-200/70 bg-[#fffdf5] p-6 shadow-[0_14px_45px_rgba(15,23,42,0.045)] md:p-7"
              : "relative overflow-hidden rounded-[24px] border border-emerald-200/70 bg-[#f8fffb] p-6 shadow-[0_14px_45px_rgba(15,23,42,0.045)] md:p-7"
          }
        >
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span
                    className={
                      degraded
                        ? "inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
                        : "inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                    }
                  >
                    {degraded ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">Residential enquiry</span>
                </div>
                <h1 className="max-w-2xl text-[32px] font-semibold leading-[1.05] tracking-[-0.055em] text-slate-950 md:text-[40px]">
                  {degraded
                    ? "A customer can enquire successfully, but nobody owns the reply."
                    : "The full customer journey is behaving as promised."}
                </h1>
              </div>
              <span
                className={
                  degraded
                    ? "rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800"
                    : "rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800"
                }
              >
                {degraded ? "Action needed" : "Verified"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={runVerification}
                disabled={running}
                className="group inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(15,23,42,0.17)] transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
              >
                {running ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                {running ? "Running synthetic enquiry…" : "Run verification"}
              </button>
              <button
                onClick={() => setScenario(degraded ? "healthy" : "degraded")}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                <WandSparkles size={16} />
                {degraded ? "Preview after fix" : "Restore failure demo"}
              </button>
              <span className="text-sm text-slate-500">Last scheduled check 8 minutes ago</span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_14px_45px_rgba(15,23,42,0.10)]">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Customer promise</span>
            <ShieldCheck size={19} className="text-emerald-400" />
          </div>
          <p className="mb-4 text-[21px] font-semibold leading-7 tracking-[-0.035em]">
            “We received your cleaning enquiry and will confirm availability with you.”
          </p>
          <p className="text-sm leading-6 text-slate-400">
            Watchdog checks the workflow keeps this promise without accidentally confirming an appointment before the team has reviewed it.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Journey health" value={degraded ? "83%" : "100%"} detail={degraded ? "5 of 6 assertions passing" : "6 of 6 assertions passing"} icon={Gauge} />
        <Metric label="Checks this week" value="42" detail="Synthetic, zero client data" icon={Activity} />
        <Metric label="Incidents caught" value="3" detail="Before a client reported them" icon={ShieldCheck} />
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] md:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-950">End-to-end journey</p>
            <p className="text-sm text-slate-500">
              One synthetic customer follows the same path a real enquiry should.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <CircleDot size={13} className="text-emerald-600" />
            Runs every 15 minutes
          </div>
        </div>

        <JourneyFlow
          steps={steps}
          running={running}
          progress={progress}
          onIncident={openIncident}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Bot size={16} />
            Test lead: <span className="font-mono text-[12px] text-slate-700">watchdog+1842@demo.local</span>
          </div>
          {degraded ? (
            <button
              onClick={openIncident}
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 transition hover:text-rose-800"
            >
              Why did this fail?
              <ArrowRight size={15} />
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Check size={15} />
              Journey contract satisfied
            </span>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-950">Why this is not uptime monitoring</p>
              <p className="text-sm text-slate-500">Every tool can be online while the customer journey is still broken.</p>
            </div>
            <Layers3 className="text-slate-400" size={19} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Tool health", "HubSpot responds 200", "Not enough"],
              ["Data health", "Lead record exists", "Useful"],
              ["Business outcome", "Right person owns the follow-up", "Watchdog"],
            ].map(([label, example, tag]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.09em] text-slate-400">{label}</p>
                <p className="mb-4 text-[14px] font-semibold leading-5 text-slate-800">{example}</p>
                <span
                  className={
                    tag === "Watchdog"
                      ? "text-xs font-semibold text-emerald-700"
                      : tag === "Not enough"
                        ? "text-xs font-semibold text-slate-400"
                        : "text-xs font-semibold text-blue-700"
                  }
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-950">Support becomes proactive</p>
              <p className="text-sm text-slate-500">A client-ready view of what ButtarDev caught this week.</p>
            </div>
            <MailCheck className="text-slate-400" size={19} />
          </div>
          <div className="rounded-2xl bg-[#f5f5f1] p-4">
            <p className="mb-5 text-[15px] font-semibold text-slate-900">BrightHome · Weekly journey summary</p>
            <div className="space-y-3">
              {[
                ["42", "journey checks completed"],
                ["3", "issues caught before client impact"],
                ["99.2%", "customer-journey availability"],
              ].map(([value, label]) => (
                <div key={label} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-semibold text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function Journeys({ onOpen }: { onOpen: () => void }) {
  const journeys = [
    {
      name: "Residential enquiry",
      path: "Website → AI → CRM → Owner → Alert → Follow-up",
      state: "At risk",
      checks: "6 assertions",
      icon: Home,
    },
    {
      name: "After-hours enquiry",
      path: "Chatbot → Qualification → Booking request → Handoff",
      state: "Healthy",
      checks: "5 assertions",
      icon: Clock3,
    },
    {
      name: "Quote follow-up",
      path: "CRM → Reminder → Email → Reply capture",
      state: "Healthy",
      checks: "5 assertions",
      icon: BellRing,
    },
  ];

  return (
    <motion.div key="journeys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-slate-500">BrightHome Cleaning</p>
        <h1 className="text-[34px] font-semibold tracking-[-0.055em] text-slate-950">Customer journeys</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
          Each journey is a business promise expressed as testable assertions, not a collection of tool-status checks.
        </p>
      </div>
      <div className="grid gap-4">
        {journeys.map((journey, index) => {
          const Icon = journey.icon;
          return (
            <motion.button
              key={journey.name}
              onClick={index === 0 ? onOpen : undefined}
              className="group flex w-full items-center gap-4 rounded-[22px] border border-slate-200/80 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.03)] transition hover:border-slate-300"
              whileHover={{ y: -2 }}
              transition={spring}
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="text-[16px] font-semibold tracking-[-0.025em] text-slate-950">{journey.name}</p>
                  <span
                    className={
                      journey.state === "At risk"
                        ? "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                        : "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                    }
                  >
                    {journey.state}
                  </span>
                </div>
                <p className="truncate text-sm text-slate-500">{journey.path}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">{journey.checks}</p>
                <p className="mt-1 text-xs text-slate-400">{index === 0 ? "8m ago" : "13m ago"}</p>
              </div>
              <ArrowRight className="ml-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" size={18} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function Runs() {
  return (
    <motion.div key="runs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-slate-500">Audit trail</p>
        <h1 className="text-[34px] font-semibold tracking-[-0.055em] text-slate-950">Run history</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
          Synthetic checks use isolated test identities and stable idempotency keys so a failed run can be safely replayed.
        </p>
      </div>
      <div className="overflow-x-auto rounded-[22px] border border-slate-200/80 bg-white">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[.8fr_1.6fr_.8fr_.8fr_1.1fr] border-b border-slate-200 bg-slate-50/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            <span>Run</span>
            <span>Journey</span>
            <span>Result</span>
            <span>Duration</span>
            <span>Evidence</span>
          </div>
          {recentRuns.map((run) => (
            <div
              key={run.id}
              className="grid grid-cols-[.8fr_1.6fr_.8fr_.8fr_1.1fr] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-0"
            >
              <div>
                <p className="font-mono text-[12px] font-semibold text-slate-700">{run.id}</p>
                <p className="mt-1 text-xs text-slate-400">{run.time}</p>
              </div>
              <span className="font-medium text-slate-800">{run.journey}</span>
              <span><ResultPill result={run.result} /></span>
              <span className="font-mono text-[12px] text-slate-500">{run.duration}</span>
              <span className="text-slate-500">{run.note}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Contract() {
  return (
    <motion.div key="contract" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-500">Residential enquiry</p>
          <h1 className="text-[34px] font-semibold tracking-[-0.055em] text-slate-950">Journey contract</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
            The rules below describe what the business promises a customer. They stay readable to the client and testable by the automation.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
          v4 · updated 47m ago
        </span>
      </div>
      <div className="space-y-3">
        {contractChecks.map((check, index) => (
          <motion.div
            key={check.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: index * 0.035 }}
            className="grid gap-4 rounded-[20px] border border-slate-200/80 bg-white p-5 md:grid-cols-[42px_1fr_auto] md:items-center"
          >
            <span
              className={
                check.status === "passing"
                  ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                  : "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"
              }
            >
              {check.status === "passing" ? <Check size={18} /> : <AlertCircle size={18} />}
            </span>
            <div>
              <p className="mb-1 text-[15px] font-semibold text-slate-950">{check.title}</p>
              <p className="text-sm leading-5 text-slate-500">{check.description}</p>
            </div>
            <span className="justify-self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 md:justify-self-end">
              {check.target}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Report() {
  return (
    <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-slate-500">Client-facing summary</p>
        <h1 className="text-[34px] font-semibold tracking-[-0.055em] text-slate-950">Weekly assurance report</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
          A support artefact that explains outcomes in business language instead of sending clients raw automation logs.
        </p>
      </div>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-7">
          <div>
            <p className="text-sm font-semibold text-slate-500">BrightHome Cleaning</p>
            <h2 className="mt-1 text-[27px] font-semibold tracking-[-0.045em] text-slate-950">Customer journey health</h2>
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
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-950 p-5 text-white">
            <ShieldCheck className="shrink-0 text-emerald-400" size={21} />
            <p className="text-sm leading-6 text-slate-300">
              All customer-facing confirmations remained truthful while the incident was open. No booking was promised before human review.
            </p>
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

  const runJourneyCheck = async (mode: "degraded" | "healthy") => {
    if (running) return;
    setRunning(true);
    setProgress(0);

    try {
      const response = await fetch("/api/watchdog/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: mode }),
      });

      if (!response.ok) {
        throw new Error(`Watchdog run failed with status ${response.status}`);
      }

      const result = (await response.json()) as {
        status: "passed" | "failed";
        incident: unknown | null;
      };

      setScenario(result.status === "passed" ? "healthy" : "degraded");

      animate(".journey-node", {
        scale: [1, 1.018, 1],
        delay: stagger(120),
        duration: 560,
        ease: "out(3)",
      });

      animate(".journey-connector", {
        scaleX: [0.05, 1],
        opacity: [0.15, 0.55, 0.25],
        duration: 2400,
        ease: "inOutQuad",
      });

      for (let index = 0; index < 6; index += 1) {
        setProgress(index);
        await new Promise((resolve) => window.setTimeout(resolve, 430));
      }

      setProgress(7);
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      setRunning(false);

      if (result.incident) {
        window.setTimeout(() => setIncidentOpen(true), 260);
      }
    } catch (error) {
      console.error(error);
      setProgress(8);
      setRunning(false);
    }
  };

  const runVerification = () => {
    void runJourneyCheck(scenario);
  };

  const replayRecoveredJourney = () => {
    setIncidentOpen(false);
    setScenario("healthy");
    window.setTimeout(() => void runJourneyCheck("healthy"), 240);
  };

  const content = useMemo(() => {
    if (view === "journeys") {
      return <Journeys onOpen={() => setView("overview")} />;
    }
    if (view === "runs") return <Runs />;
    if (view === "contract") return <Contract />;
    if (view === "report") return <Report />;
    return (
      <Overview
        scenario={scenario}
        setScenario={setScenario}
        running={running}
        progress={progress}
        runVerification={runVerification}
        openIncident={() => setIncidentOpen(true)}
      />
    );
  }, [view, scenario, running, progress]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f5f5f1] text-slate-950">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-[#fbfbf8] px-4 py-5 lg:flex lg:flex-col">
          <div className="px-2">
            <AppLogo />
          </div>

          <nav className="mt-9 space-y-1">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-400">Demo mode</span>
                <Sparkles size={14} className="text-blue-500" />
              </div>
              <p className="text-sm font-semibold leading-5 text-slate-800">No client data is used.</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Synthetic identities only.</p>
            </div>
            <div className="flex items-center gap-3 px-2 py-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-xs font-bold text-slate-700">JA</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Jude Akede</p>
                <p className="text-xs text-slate-500">Prototype workspace</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[252px]">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f5f5f1]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-4 md:px-7">
              <div className="lg:hidden">
                <AppLogo />
              </div>
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm lg:flex">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[12px] font-bold text-blue-700">
                  BH
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Demo client</p>
                  <p className="text-sm font-semibold text-slate-800">BrightHome Cleaning</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 sm:inline-flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Watchdog active
                </span>
                <button
                  onClick={runVerification}
                  disabled={running}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <Play size={14} fill="currentColor" />
                  <span className="hidden sm:inline">Run check</span>
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
                <span className="text-[10px] font-semibold leading-none">
                  {item.id === "overview"
                    ? "Home"
                    : item.id === "journeys"
                      ? "Journeys"
                      : item.id === "runs"
                        ? "Runs"
                        : item.id === "contract"
                          ? "Contract"
                          : "Report"}
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
