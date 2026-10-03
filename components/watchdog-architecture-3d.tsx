"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Eye,
  LockKeyhole,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const faces = [
  {
    id: "overview",
    index: "00",
    label: "Watchdog",
    eyebrow: "Overview",
    title: "One control plane around the workflow.",
    body: "The cube is a visual model, not a literal server. Each face represents one responsibility in the Watchdog system. Rotate it to understand how the pieces work together.",
    sits: "Around the automation",
    sees: "Journey events and business contracts",
    does: "Coordinates observation, assertions, guards, and recovery evidence",
    rotation: { x: -14, y: 24 },
    accent: "#7d7cff",
    icon: ShieldCheck,
  },
  {
    id: "probe",
    index: "01",
    label: "Probe",
    eyebrow: "Synthetic probe",
    title: "Enter through the same path as a customer.",
    body: "A safe synthetic event starts outside the client's workflow and enters through the real form, webhook, API, or trigger.",
    sits: "Outside the automation",
    sees: "The public customer-facing entry point",
    does: "Creates a test event with a stable replay key",
    rotation: { x: -92, y: 0 },
    accent: "#ff704d",
    icon: Bot,
  },
  {
    id: "observe",
    index: "02",
    label: "Observe",
    eyebrow: "Handoff observer",
    title: "Read the state crossing between tools.",
    body: "Watchdog can consume selected webhook payloads, workflow events, API responses, logs, and CRM state without becoming the system of record.",
    sits: "Beside the integrations",
    sees: "Website → AI → CRM → routing outputs",
    does: "Captures expected-vs-actual evidence at each boundary",
    rotation: { x: 0, y: -90 },
    accent: "#5ea7ff",
    icon: Eye,
  },
  {
    id: "contract",
    index: "03",
    label: "Contract",
    eyebrow: "Contract engine",
    title: "Ask whether the business promise is still true.",
    body: "A successful API call is not enough. This face represents the assertions that matter to the client: one owner, enough approvals, stock reserved, truthful customer messaging, and more.",
    sits: "Inside the Watchdog service",
    sees: "Observed state + client-defined business rule",
    does: "Returns a pass/fail assertion with evidence",
    rotation: { x: 0, y: 180 },
    accent: "#d875ff",
    icon: Braces,
  },
  {
    id: "guard",
    index: "04",
    label: "Guard",
    eyebrow: "Guard layer",
    title: "Hold risky actions when a prerequisite fails.",
    body: "Only a small gate needs to sit inline. Before a payment, task, message, fulfilment action, or other side effect runs, its adapter can ask whether the required contract passed.",
    sits: "Immediately before selected side effects",
    sees: "Assertion result + intended action",
    does: "Allows or holds the side effect",
    rotation: { x: 0, y: 90 },
    accent: "#ffc44d",
    icon: LockKeyhole,
  },
  {
    id: "replay",
    index: "05",
    label: "Replay",
    eyebrow: "Evidence + replay",
    title: "Remember the failure and verify the fix.",
    body: "Watchdog does not rewrite production code. A human or deployment pipeline applies the fix. Watchdog keeps the failed boundary and identifiers so it can verify recovery from the right point.",
    sits: "Watchdog operational store",
    sees: "Failure context + corrected configuration",
    does: "Produces a bounded replay point and verified recovery",
    rotation: { x: 90, y: 0 },
    accent: "#54d99b",
    icon: RefreshCw,
  },
] as const;

const faceTransforms = {
  front: "translateZ(108px)",
  back: "rotateY(180deg) translateZ(108px)",
  right: "rotateY(90deg) translateZ(108px)",
  left: "rotateY(-90deg) translateZ(108px)",
  top: "rotateX(90deg) translateZ(108px)",
  bottom: "rotateX(-90deg) translateZ(108px)",
} as const;

const faceMap = [
  { key: "front", label: "WATCHDOG", sub: "overview", accent: "#7d7cff", target: 0 },
  { key: "top", label: "PROBE", sub: "synthetic input", accent: "#ff704d", target: 1 },
  { key: "right", label: "OBSERVE", sub: "handoffs", accent: "#5ea7ff", target: 2 },
  { key: "back", label: "CONTRACT", sub: "business truth", accent: "#d875ff", target: 3 },
  { key: "left", label: "GUARD", sub: "side effects", accent: "#ffc44d", target: 4 },
  { key: "bottom", label: "REPLAY", sub: "recovery", accent: "#54d99b", target: 5 },
] as const;

export function WatchdogArchitecture3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const face = faces[active];
  const FaceIcon = face.icon;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tiles = root.querySelectorAll(".cube-field-tile");
    const animation = animate(tiles, {
      translateY: [0, -7, 0],
      rotate: [0, 45, 0],
      opacity: [0.12, 0.42, 0.12],
      delay: stagger(38, { grid: [8, 8], from: "center" }),
      duration: 3400,
      loop: true,
      ease: "inOut(2)",
    });

    return () => {
      animation.cancel();
    };
  }, []);

  useEffect(() => {
    const cube = cubeRef.current;
    const root = rootRef.current;
    if (!cube || !root) return;

    const activeFace = root.querySelector(`[data-cube-face="${active}"]`);

    animate(cube, {
      rotateX: face.rotation.x,
      rotateY: face.rotation.y,
      scale: [0.96, 1.04, 1],
      duration: 920,
      ease: "inOut(4)",
    });

    if (activeFace) {
      animate(activeFace, {
        scale: [0.94, 1.04, 1],
        duration: 620,
        ease: "out(4)",
      });
    }
  }, [active, face.rotation.x, face.rotation.y]);

  const playCube = async () => {
    if (playing) return;
    setPlaying(true);

    for (let index = 0; index < faces.length; index += 1) {
      setActive(index);
      await new Promise((resolve) => window.setTimeout(resolve, 1050));
    }

    setPlaying(false);
  };

  const reset = () => {
    setActive(0);
  };

  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[#0b0c0f] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-4 md:px-7">
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
              <p className="text-[14px] font-semibold text-[#a5a7ff]">Interactive Watchdog cube · Anime.js</p>
              <h1 className="mt-0.5 text-[30px] font-semibold tracking-[-0.05em] md:text-[39px]">
                Rotate the cube to understand the Watchdog system.
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/12 bg-white/[.04] px-3.5 text-[14px] font-semibold text-white/65 transition hover:bg-white/[.08] hover:text-white"
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <button
              onClick={playCube}
              disabled={playing}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
            >
              {playing ? <RefreshCw size={15} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              {playing ? "Touring cube" : "Play cube tour"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
          <section className="relative min-h-[590px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101116] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-8 gap-7 p-8">
              {Array.from({ length: 64 }).map((_, index) => (
                <span
                  key={index}
                  className="cube-field-tile m-auto h-2 w-2 rounded-[3px] border border-white/12 bg-white/5"
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(125,124,255,.19),transparent_27%)]" />

            <div className="absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[13px] font-semibold text-white/45 backdrop-blur">
              CLICK A FACE · OR USE THE TOUR
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative h-[216px] w-[216px]"
                style={{ perspective: "950px" }}
              >
                <div
                  ref={cubeRef}
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(-14deg) rotateY(24deg)",
                  }}
                >
                  {faceMap.map((item) => (
                    <button
                      key={item.key}
                      data-cube-face={item.target}
                      onClick={() => setActive(item.target)}
                      aria-label={`${item.label} face`}
                      className="absolute inset-0 flex flex-col items-center justify-center border border-white/15 bg-[#171922]/95 text-center shadow-[inset_0_0_50px_rgba(255,255,255,.02)] backdrop-blur-sm"
                      style={{
                        transform: faceTransforms[item.key],
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-[0_0_20px_currentColor]"
                        style={{ backgroundColor: item.accent, color: item.accent }}
                      />
                      <p className="mt-4 text-[20px] font-semibold tracking-[.06em]">{item.label}</p>
                      <p className="mt-2 text-[12px] font-medium uppercase tracking-[.12em] text-white/30">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#7d7cff]/18" />
            <div className="absolute left-1/2 top-1/2 h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.05]" />

            <div className="absolute bottom-5 left-5 right-5 z-20">
              <div className="flex gap-2 overflow-x-auto rounded-[18px] border border-white/10 bg-black/25 p-2.5 backdrop-blur [scrollbar-width:none]">
                {faces.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(index)}
                    className={
                      index === active
                        ? "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 text-[13px] font-semibold text-[#111318]"
                        : "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-[13px] font-semibold text-white/42 transition hover:bg-white/[.06] hover:text-white/72"
                    }
                  >
                    <span className="font-mono text-[11px] opacity-55">{item.index}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex min-h-[590px] flex-col rounded-[30px] border border-white/10 bg-[#14151a] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[.09em] text-white/28">{face.index} / 05</p>
                <p className="mt-3 text-[14px] font-semibold" style={{ color: face.accent }}>{face.eyebrow}</p>
              </div>
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${face.accent}18`, color: face.accent }}
              >
                <FaceIcon size={20} />
              </span>
            </div>

            <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.045em]">{face.title}</h2>
            <p className="mt-4 text-[16px] leading-7 text-white/55">{face.body}</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">Where it sits</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{face.sits}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">What it sees</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{face.sees}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">What it does</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{face.does}</p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              {active < faces.length - 1 ? (
                <button
                  onClick={() => setActive((value) => Math.min(faces.length - 1, value + 1))}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3]"
                >
                  Rotate to next face
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="rounded-[18px] border border-[#7d7cff]/22 bg-[#7d7cff]/[.07] p-4">
                  <div className="flex items-center gap-2 text-[#a9a7ff]">
                    <Sparkles size={15} />
                    <p className="text-[14px] font-semibold">Try the same pattern on other workflows</p>
                  </div>
                  <p className="mt-2 text-[14px] leading-6 text-white/42">
                    The use-case page runs mimicked finance, onboarding, fulfilment, and routing automations.
                  </p>
                  <Link
                    href="/use-cases"
                    className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-white"
                  >
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
