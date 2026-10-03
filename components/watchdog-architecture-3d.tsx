"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Database,
  Eye,
  LockKeyhole,
  MailCheck,
  Play,
  Radar,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const stages = [
  {
    id: "probe",
    index: "01",
    label: "Synthetic probe",
    title: "Enter through the real customer path.",
    body: "Watchdog starts outside the automation. It sends a synthetic enquiry through the same public form, webhook, or trigger a real customer would use.",
    location: "Outside the automation",
    sees: "The customer-facing entry point",
    does: "Creates a safe synthetic event with a stable replay key",
    signal: { left: "9%", top: "20%" },
    accent: "#ff6a3d",
  },
  {
    id: "observe",
    index: "02",
    label: "Observe handoffs",
    title: "Watch the state leaving each tool.",
    body: "Watchdog listens beside the workflow. It can consume webhook payloads, execution events, selected API responses, logs, or CRM state without replacing those tools.",
    location: "Beside the integrations",
    sees: "Website → AI → CRM → routing outputs",
    does: "Normalizes expected-vs-actual evidence at each boundary",
    signal: { left: "49%", top: "20%" },
    accent: "#7d7cff",
  },
  {
    id: "assert",
    index: "03",
    label: "Assert the contract",
    title: "Check the business outcome, not just the API.",
    body: "A green API response is not enough. The contract engine asks whether the business condition is true: one owner exists, approval count is sufficient, stock is reserved, or a customer message is truthful.",
    location: "Inside the Watchdog service",
    sees: "Observed state + client-defined rule",
    does: "Returns a pass/fail assertion with evidence",
    signal: { left: "50%", top: "61%" },
    accent: "#d66cff",
  },
  {
    id: "guard",
    index: "04",
    label: "Guard a side effect",
    title: "Stop bad state before it becomes an action.",
    body: "Only this small piece needs to sit inline. Before a sensitive action runs, its adapter can ask Watchdog whether the prerequisite contract passed.",
    location: "Immediately before selected side effects",
    sees: "Assertion result + intended action",
    does: "Allows or holds payment, email, Slack, task, fulfilment, etc.",
    signal: { left: "79%", top: "20%" },
    accent: "#ffc14d",
  },
  {
    id: "evidence",
    index: "05",
    label: "Evidence + replay",
    title: "Remember the failure and verify the recovery.",
    body: "Watchdog does not rewrite production code. A human or deployment pipeline fixes the configuration. Watchdog keeps the failed boundary, IDs, and replay key so it can verify a bounded replay afterward.",
    location: "Watchdog operational store",
    sees: "Failure context + corrected configuration",
    does: "Produces a replay point and verified recovery",
    signal: { left: "84%", top: "76%" },
    accent: "#55d99b",
  },
] as const;

const automationNodes = [
  { label: "Website", icon: Workflow },
  { label: "AI", icon: Bot },
  { label: "CRM", icon: Database },
  { label: "Routing", icon: Route },
  { label: "Team action", icon: MailCheck },
] as const;

export function WatchdogArchitecture3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const stage = stages[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dots = root.querySelectorAll(".anime-dot");
    const orbit = root.querySelectorAll(".anime-orbit");

    const dotAnimation = animate(dots, {
      scale: [0.55, 1, 0.55],
      opacity: [0.13, 0.38, 0.13],
      delay: stagger(22, { grid: [9, 9], from: "center" }),
      duration: 3400,
      loop: true,
      ease: "inOut(2)",
    });

    const orbitAnimation = animate(orbit, {
      rotate: [0, 360],
      duration: 18000,
      loop: true,
      ease: "linear",
    });

    return () => {
      dotAnimation.cancel();
      orbitAnimation.cancel();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const signal = signalRef.current;
    if (!root || !signal) return;

    const modules = root.querySelectorAll(".watchdog-module");
    const paths = root.querySelectorAll(".system-path");
    const activeModule = root.querySelector(`[data-module="${stage.id}"]`);
    const clientNodes = root.querySelectorAll(".client-node");

    animate(modules, {
      opacity: [0.5, 0.78],
      scale: 0.96,
      duration: 260,
      ease: "out(3)",
    });

    if (activeModule) {
      animate(activeModule, {
        opacity: 1,
        scale: [0.98, 1.08, 1],
        translateY: [4, -5, 0],
        duration: 620,
        ease: "out(4)",
      });
    }

    animate(paths, {
      strokeDashoffset: [36, 0],
      duration: 700,
      ease: "out(3)",
    });

    animate(clientNodes, {
      translateY: [0, -3, 0],
      delay: stagger(55, { from: active < 2 ? "first" : "last" }),
      duration: 520,
      ease: "out(3)",
    });

    animate(signal, {
      left: stage.signal.left,
      top: stage.signal.top,
      scale: [0.65, 1.4, 1],
      duration: 720,
      ease: "inOut(3)",
    });
  }, [active, stage.id, stage.signal.left, stage.signal.top]);

  const playSystem = async () => {
    if (playing) return;
    setPlaying(true);

    for (let index = 0; index < stages.length; index += 1) {
      setActive(index);
      await new Promise((resolve) => window.setTimeout(resolve, index === 3 ? 1150 : 900));
    }

    setPlaying(false);
  };

  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[#0b0c0f] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-4 md:px-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/recovery"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.05] text-white/65 transition hover:bg-white/[.09] hover:text-white"
              aria-label="Back to recovery"
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <p className="text-[14px] font-semibold text-[#ff835f]">System anatomy · powered by Anime.js</p>
              <h1 className="mt-0.5 text-[30px] font-semibold tracking-[-0.05em] md:text-[39px]">
                Watchdog is a layer around the workflow, not another tool inside it.
              </h1>
            </div>
          </div>

          <button
            onClick={playSystem}
            disabled={playing}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
          >
            {playing ? <RefreshCw size={15} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            {playing ? "Tracing the system" : "Play the whole system"}
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
          <section className="relative min-h-[600px] overflow-hidden rounded-[30px] border border-white/10 bg-[#111216] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 grid grid-cols-9 grid-rows-9 gap-7 p-8 opacity-60">
                {Array.from({ length: 81 }).map((_, index) => (
                  <span key={index} className="anime-dot m-auto h-1.5 w-1.5 rounded-full bg-white/20" />
                ))}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_57%,rgba(125,124,255,.14),transparent_28%)]" />
            </div>

            <div className="absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[13px] font-semibold text-white/50 backdrop-blur">
              CLIENT AUTOMATION · unchanged
            </div>

            <div className="absolute left-[5%] right-[5%] top-[17%] z-20 grid grid-cols-5 items-center gap-3">
              {automationNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className="relative">
                    <div className="client-node rounded-[18px] border border-white/10 bg-white/[.055] px-3 py-4 text-center backdrop-blur">
                      <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[.07] text-white/72">
                        <Icon size={17} />
                      </span>
                      <p className="mt-2 text-[14px] font-semibold text-white/82">{node.label}</p>
                    </div>
                    {index < automationNodes.length - 1 ? (
                      <ArrowRight size={16} className="absolute -right-[14px] top-1/2 -translate-y-1/2 text-white/18" />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
              <path className="system-path" d="M90 150 C150 270 245 310 340 345" fill="none" stroke="#ff6a3d" strokeWidth="2.2" strokeDasharray="7 9" opacity=".65" />
              <path className="system-path" d="M460 150 C470 245 475 285 500 345" fill="none" stroke="#7d7cff" strokeWidth="2.2" strokeDasharray="7 9" opacity=".65" />
              <path className="system-path" d="M500 345 C610 315 710 270 795 155" fill="none" stroke="#ffc14d" strokeWidth="2.2" strokeDasharray="7 9" opacity=".65" />
              <path className="system-path" d="M500 355 C620 420 735 470 840 505" fill="none" stroke="#55d99b" strokeWidth="2.2" strokeDasharray="7 9" opacity=".55" />
            </svg>

            <div
              ref={signalRef}
              className="pointer-events-none absolute z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#ff6a3d] shadow-[0_0_0_8px_rgba(255,106,61,.12),0_0_32px_rgba(255,106,61,.75)]"
              style={{ left: stages[0].signal.left, top: stages[0].signal.top }}
            />

            <div className="absolute left-1/2 top-[58%] z-20 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2">
              <div className="anime-orbit absolute inset-0 rounded-full border border-dashed border-[#7d7cff]/40">
                <span className="absolute left-1/2 top-[-7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#d66cff] shadow-[0_0_22px_rgba(214,108,255,.8)]" />
                <span className="absolute bottom-[9px] right-[17px] h-2.5 w-2.5 rounded-sm bg-[#55d99b]" />
              </div>
              <div className="anime-orbit absolute inset-[20px] rounded-full border border-dashed border-white/14 [animation-direction:reverse]">
                <span className="absolute right-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#ff6a3d]" />
              </div>

              <button
                onClick={() => setActive(2)}
                data-module="assert"
                className="watchdog-module absolute inset-[43px] flex flex-col items-center justify-center rounded-[42px] border border-[#9f87ff]/35 bg-[linear-gradient(145deg,#222239,#161722)] text-center shadow-[0_24px_65px_rgba(0,0,0,.35)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d66cff]/12 text-[#e49cff]">
                  <Braces size={19} />
                </span>
                <p className="mt-3 text-[15px] font-semibold">WATCHDOG</p>
                <p className="mt-1 text-[12px] font-medium text-white/38">control plane</p>
              </button>
            </div>

            <button
              onClick={() => setActive(0)}
              data-module="probe"
              className="watchdog-module absolute bottom-[17%] left-[7%] z-20 w-[170px] rounded-[20px] border border-[#ff6a3d]/25 bg-[#ff6a3d]/[.07] p-4 text-left backdrop-blur"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6a3d]/12 text-[#ff835f]">
                <Radar size={17} />
              </span>
              <p className="mt-3 text-[14px] font-semibold">Synthetic probe</p>
              <p className="mt-1 text-[12px] leading-5 text-white/38">starts outside</p>
            </button>

            <button
              onClick={() => setActive(1)}
              data-module="observe"
              className="watchdog-module absolute bottom-[17%] left-[29%] z-20 w-[170px] rounded-[20px] border border-[#7d7cff]/25 bg-[#7d7cff]/[.07] p-4 text-left backdrop-blur"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#7d7cff]/12 text-[#a19fff]">
                <Eye size={17} />
              </span>
              <p className="mt-3 text-[14px] font-semibold">Handoff observer</p>
              <p className="mt-1 text-[12px] leading-5 text-white/38">reads boundaries</p>
            </button>

            <button
              onClick={() => setActive(3)}
              data-module="guard"
              className="watchdog-module absolute bottom-[17%] right-[29%] z-20 w-[170px] rounded-[20px] border border-[#ffc14d]/25 bg-[#ffc14d]/[.07] p-4 text-left backdrop-blur"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffc14d]/12 text-[#ffd275]">
                <LockKeyhole size={17} />
              </span>
              <p className="mt-3 text-[14px] font-semibold">Guard</p>
              <p className="mt-1 text-[12px] leading-5 text-white/38">inline only here</p>
            </button>

            <button
              onClick={() => setActive(4)}
              data-module="evidence"
              className="watchdog-module absolute bottom-[17%] right-[7%] z-20 w-[170px] rounded-[20px] border border-[#55d99b]/25 bg-[#55d99b]/[.07] p-4 text-left backdrop-blur"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#55d99b]/12 text-[#75e3b2]">
                <ShieldCheck size={17} />
              </span>
              <p className="mt-3 text-[14px] font-semibold">Evidence + replay</p>
              <p className="mt-1 text-[12px] leading-5 text-white/38">verifies recovery</p>
            </button>

            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-[13px] text-white/42">
                <Sparkles size={14} className="text-[#ff835f]" />
                Click any module or use the walkthrough
              </div>
              <div className="hidden items-center gap-1.5 md:flex">
                {stages.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(index)}
                    aria-label={item.label}
                    className={
                      index === active
                        ? "h-2.5 w-8 rounded-full bg-white"
                        : "h-2.5 w-2.5 rounded-full bg-white/18 transition hover:bg-white/38"
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="flex min-h-[600px] flex-col rounded-[30px] border border-white/10 bg-[#14151a] p-5 md:p-6">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[.09em] text-white/30">
                {stage.index} / 05
              </p>
              <p className="mt-3 text-[14px] font-semibold" style={{ color: stage.accent }}>{stage.label}</p>
              <h2 className="mt-2 text-[29px] font-semibold leading-[1.08] tracking-[-0.045em]">{stage.title}</h2>
              <p className="mt-4 text-[16px] leading-7 text-white/55">{stage.body}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">Where it sits</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{stage.location}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">What it sees</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{stage.sees}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">What it does</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{stage.does}</p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              {active < stages.length - 1 ? (
                <button
                  onClick={() => setActive((value) => Math.min(stages.length - 1, value + 1))}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3]"
                >
                  Next layer
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="rounded-[18px] border border-[#7d7cff]/22 bg-[#7d7cff]/[.07] p-4">
                  <p className="text-[14px] font-semibold text-[#aaa8ff]">Now see it in other workflows</p>
                  <p className="mt-2 text-[14px] leading-6 text-white/42">
                    Run mimicked finance, onboarding, fulfilment, and routing automations using the same Watchdog pattern.
                  </p>
                  <Link href="/use-cases" className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-white">
                    Open Watchdog use cases
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
