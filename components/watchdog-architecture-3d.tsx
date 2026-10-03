"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Check,
  DatabaseZap,
  Eye,
  LockKeyhole,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const layers = [
  {
    id: "assembled",
    index: "00",
    label: "Core",
    eyebrow: "Assembled Watchdog",
    title: "One control layer wrapped around the automation.",
    body: "This is a conceptual product teardown of Watchdog. The system stays beside the client's automation, observes handoffs, evaluates business assertions, gates selected side effects, and stores evidence for recovery.",
    sits: "Beside the client automation",
    receives: "Journey events + client-defined business contracts",
    produces: "A verified outcome or an isolated incident",
    accent: "#8d8cff",
    icon: ShieldCheck,
  },
  {
    id: "probe",
    index: "01",
    label: "Probe",
    eyebrow: "Synthetic probe",
    title: "Start with a safe event that behaves like a real customer.",
    body: "The probe begins outside the automation and enters through the same public form, webhook, API, or trigger. That makes the test representative without borrowing a real customer's identity.",
    sits: "Outside the automation",
    receives: "Schedule, deployment event, or operator-triggered check",
    produces: "Synthetic event + stable replay key",
    accent: "#ff7654",
    icon: Bot,
  },
  {
    id: "observer",
    index: "02",
    label: "Observe",
    eyebrow: "Handoff observer",
    title: "Read the state leaving each system.",
    body: "Watchdog consumes only the signals needed to prove the journey: webhook payloads, execution events, selected API responses, logs, or CRM state. It does not replace those systems.",
    sits: "Along integration boundaries",
    receives: "Website → AI → CRM → routing outputs",
    produces: "Normalized expected-vs-actual evidence",
    accent: "#5aa8ff",
    icon: Eye,
  },
  {
    id: "contract",
    index: "03",
    label: "Contract",
    eyebrow: "Contract engine",
    title: "Ask whether the business promise is still true.",
    body: "A 200 response is not the product outcome. The contract engine evaluates the client rules that matter: one owner exists, approvals are sufficient, stock is reserved, or customer messaging remains truthful.",
    sits: "Inside the Watchdog service",
    receives: "Observed state + client-defined assertion",
    produces: "Pass/fail decision + evidence",
    accent: "#d975ff",
    icon: Braces,
  },
  {
    id: "guard",
    index: "04",
    label: "Guard",
    eyebrow: "Guard layer",
    title: "Stop bad state before it becomes a real action.",
    body: "Only this small piece needs to sit inline. Before a sensitive side effect runs, its adapter can ask Watchdog whether the prerequisite contract passed.",
    sits: "Immediately before selected side effects",
    receives: "Assertion result + intended action",
    produces: "Allow or hold",
    accent: "#ffc650",
    icon: LockKeyhole,
  },
  {
    id: "replay",
    index: "05",
    label: "Replay",
    eyebrow: "Evidence + replay",
    title: "Remember where the journey failed and verify the recovery.",
    body: "Watchdog does not rewrite production code. A human or deployment pipeline applies the fix. Watchdog preserves the failed boundary, identifiers, and replay key so verification resumes from the correct point.",
    sits: "Watchdog operational store",
    receives: "Failure context + corrected configuration",
    produces: "Bounded replay + verified recovery",
    accent: "#56daa0",
    icon: DatabaseZap,
  },
] as const;

const layerIds = ["probe", "observer", "contract", "guard", "replay"] as const;

const layerMeta = {
  probe: { title: "SYNTHETIC PROBE", subtitle: "safe input", accent: "#ff7654" },
  observer: { title: "HANDOFF OBSERVER", subtitle: "boundary state", accent: "#5aa8ff" },
  contract: { title: "CONTRACT ENGINE", subtitle: "business truth", accent: "#d975ff" },
  guard: { title: "GUARD LAYER", subtitle: "side-effect gate", accent: "#ffc650" },
  replay: { title: "EVIDENCE + REPLAY", subtitle: "recovery memory", accent: "#56daa0" },
} as const;

export function WatchdogArchitecture3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const traceTimeline = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);
  const [tracing, setTracing] = useState(false);

  const current = layers[active];
  const CurrentIcon = current.icon;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.to(".ambient-pip", {
        y: -7,
        opacity: 0.34,
        duration: 2.8,
        stagger: {
          each: 0.03,
          grid: [9, 6],
          from: "center",
          yoyo: true,
          repeat: -1,
        },
        ease: "sine.inOut",
      });
    }, root);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const plates = Array.from(root.querySelectorAll<HTMLElement>(".teardown-plate"));

    if (active === 0) {
      plates.forEach((plate, index) => {
        gsap.to(plate, {
          x: index * 3,
          y: index * 5,
          rotateX: 57,
          rotateZ: -8,
          scale: 1 - index * 0.012,
          opacity: 1,
          duration: 0.78,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
      return;
    }

    plates.forEach((plate, index) => {
      const selectedIndex = active - 1;
      const distance = index - selectedIndex;
      const y = distance * 82;
      const x = distance * 14;
      const selected = index === selectedIndex;

      gsap.to(plate, {
        x,
        y,
        rotateX: 57,
        rotateZ: -8,
        scale: selected ? 1.035 : 0.985,
        opacity: selected ? 1 : 0.34,
        duration: 0.82,
        ease: "power3.inOut",
        overwrite: true,
      });
    });
  }, [active]);

  const traceJourney = () => {
    const root = rootRef.current;
    const signal = signalRef.current;
    if (!root || !signal || tracing) return;

    traceTimeline.current?.kill();
    setTracing(true);
    setActive(0);

    const positions = [
      { x: -235, y: -110, stage: 1 },
      { x: -115, y: -54, stage: 2 },
      { x: 0, y: 0, stage: 3 },
      { x: 115, y: 58, stage: 4 },
      { x: 232, y: 112, stage: 5 },
    ];

    gsap.set(signal, { x: -330, y: -155, opacity: 1, scale: 0.7 });

    const tl = gsap.timeline({
      defaults: { duration: 0.72, ease: "power2.inOut" },
      onComplete: () => {
        setTracing(false);
        gsap.to(signal, { opacity: 0, scale: 0.4, duration: 0.35 });
      },
    });

    positions.forEach((point, index) => {
      tl.call(() => setActive(point.stage))
        .to(signal, {
          x: point.x,
          y: point.y,
          scale: 1,
        })
        .to(
          root.querySelectorAll(".trace-line")[index],
          {
            opacity: 0.95,
            scaleX: 1,
            duration: 0.38,
            transformOrigin: "left center",
          },
          "<",
        );

      if (point.stage === 4) {
        tl.to({}, { duration: 0.55 });
      }
    });

    traceTimeline.current = tl;
  };

  const reset = () => {
    traceTimeline.current?.kill();
    setTracing(false);
    setActive(0);
    if (signalRef.current) gsap.set(signalRef.current, { opacity: 0 });
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
              <p className="text-[14px] font-semibold text-[#aaa9ff]">Inside Watchdog · GSAP teardown</p>
              <h1 className="mt-0.5 text-[30px] font-semibold tracking-[-0.05em] md:text-[39px]">
                Peel the system apart and follow one failed journey through it.
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/12 bg-white/[.04] px-3.5 text-[14px] font-semibold text-white/65 transition hover:bg-white/[.08] hover:text-white"
            >
              <RefreshCw size={15} />
              Reset core
            </button>
            <button
              onClick={traceJourney}
              disabled={tracing}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
            >
              {tracing ? <RefreshCw size={15} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              {tracing ? "Tracing failure" : "Trace failed journey"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
          <section className="relative min-h-[600px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101116] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="pointer-events-none absolute inset-0 grid grid-cols-9 grid-rows-6 gap-8 p-8">
              {Array.from({ length: 54 }).map((_, index) => (
                <span key={index} className="ambient-pip m-auto h-1.5 w-1.5 rounded-full bg-white/12" />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(141,140,255,.18),transparent_31%)]" />

            <div className="absolute left-5 top-5 z-30 max-w-[320px] rounded-[16px] border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
              <p className="text-[13px] font-semibold text-white/72">WATCHDOG CORE</p>
              <p className="mt-1 text-[13px] leading-5 text-white/35">
                Click a layer to isolate it. The object stays still enough to read.
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pt-6">
              <div className="relative h-[390px] w-[650px] max-w-[88%]" style={{ perspective: "1200px" }}>
                <div className="absolute left-1/2 top-1/2 h-[250px] w-[470px] -translate-x-1/2 -translate-y-1/2">
                  {layerIds.map((id, index) => {
                    const meta = layerMeta[id];
                    return (
                      <button
                        key={id}
                        onClick={() => setActive(index + 1)}
                        aria-label={meta.title}
                        className="teardown-plate absolute inset-0 overflow-hidden rounded-[30px] border border-white/15 bg-[#171922]/95 text-left shadow-[0_30px_60px_rgba(0,0,0,.34)]"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: `translate3d(${index * 3}px, ${index * 5}px, 0) rotateX(57deg) rotateZ(-8deg) scale(${1 - index * 0.012})`,
                          zIndex: 20 - index,
                        }}
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-1"
                          style={{ backgroundColor: meta.accent }}
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.05),transparent_42%)]" />

                        <div className="absolute left-6 top-6">
                          <span
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${meta.accent}18`, color: meta.accent }}
                          >
                            {id === "probe" ? <Bot size={18} /> : null}
                            {id === "observer" ? <Eye size={18} /> : null}
                            {id === "contract" ? <Braces size={18} /> : null}
                            {id === "guard" ? <LockKeyhole size={18} /> : null}
                            {id === "replay" ? <DatabaseZap size={18} /> : null}
                          </span>
                        </div>

                        <div className="absolute bottom-6 left-6">
                          <p className="text-[17px] font-semibold tracking-[.035em] text-white">{meta.title}</p>
                          <p className="mt-1 text-[12px] font-medium uppercase tracking-[.12em] text-white/32">{meta.subtitle}</p>
                        </div>

                        <div className="absolute right-7 top-7 grid grid-cols-4 gap-2 opacity-45">
                          {Array.from({ length: 12 }).map((_, dot) => (
                            <span
                              key={dot}
                              className="h-2 w-2 rounded-[3px]"
                              style={{ backgroundColor: dot % 3 === 0 ? meta.accent : "rgba(255,255,255,.12)" }}
                            />
                          ))}
                        </div>

                        <svg className="absolute bottom-7 right-7 h-[92px] w-[190px] opacity-45" viewBox="0 0 190 92" fill="none">
                          <path d="M4 74 H54 V44 H98 V20 H184" stroke={meta.accent} strokeWidth="2" />
                          <path d="M28 88 V58 H76 V68 H132 V42 H176" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
                          <circle cx="54" cy="44" r="4" fill={meta.accent} />
                          <circle cx="132" cy="42" r="4" fill={meta.accent} />
                        </svg>
                      </button>
                    );
                  })}

                  <div
                    ref={signalRef}
                    className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-4 w-4 rounded-full bg-white opacity-0 shadow-[0_0_0_7px_rgba(141,140,255,.12),0_0_30px_rgba(141,140,255,.8)]"
                  />

                  <div className="pointer-events-none absolute left-[-120px] top-[52px] z-10 h-px w-[710px]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className="trace-line absolute left-0 top-0 h-px w-[142px] origin-left scale-x-0 bg-white/30 opacity-0"
                        style={{ transform: `translateX(${index * 142}px)` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-30">
              <div className="flex gap-2 overflow-x-auto rounded-[18px] border border-white/10 bg-black/28 p-2.5 backdrop-blur [scrollbar-width:none]">
                {layers.map((item, index) => (
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

          <aside className="flex min-h-[600px] flex-col rounded-[30px] border border-white/10 bg-[#14151a] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[.09em] text-white/28">{current.index} / 05</p>
                <p className="mt-3 text-[14px] font-semibold" style={{ color: current.accent }}>{current.eyebrow}</p>
              </div>
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${current.accent}18`, color: current.accent }}
              >
                <CurrentIcon size={20} />
              </span>
            </div>

            <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.045em]">{current.title}</h2>
            <p className="mt-4 text-[16px] leading-7 text-white/55">{current.body}</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">Where it sits</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{current.sits}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">Receives</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{current.receives}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/28">Produces</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/78">{current.produces}</p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              {active < layers.length - 1 ? (
                <button
                  onClick={() => setActive((value) => Math.min(layers.length - 1, value + 1))}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3]"
                >
                  Peel next layer
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="rounded-[18px] border border-[#8d8cff]/22 bg-[#8d8cff]/[.07] p-4">
                  <div className="flex items-center gap-2 text-[#b4b3ff]">
                    <Sparkles size={15} />
                    <p className="text-[14px] font-semibold">Now run it across other workflows</p>
                  </div>
                  <p className="mt-2 text-[14px] leading-6 text-white/42">
                    Use cases applies the same Watchdog pattern to finance, onboarding, fulfilment, and routing automations.
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
