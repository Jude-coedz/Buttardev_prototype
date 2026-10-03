"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import {
  Activity,
  Bot,
  Braces,
  CheckCircle2,
  DatabaseZap,
  Fingerprint,
  GitBranch,
  Layers3,
  LockKeyhole,
  MousePointer2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const layers = [
  {
    id: "probe",
    index: "01",
    title: "Synthetic probe",
    subtitle: "Creates a safe test customer",
    icon: Bot,
    accent: "blue",
    detail: "A dedicated test identity enters the same customer-facing journey as a real lead. The stable idempotency key lets Watchdog trace the run and replay it safely.",
    input: "Synthetic form submission",
    output: "watchdog:brighthome:...:1842",
    boundary: "No real customer identity",
  },
  {
    id: "contract",
    index: "02",
    title: "Journey contract",
    subtitle: "Defines what must stay true",
    icon: Braces,
    accent: "violet",
    detail: "Business promises are expressed as testable assertions: truthful acknowledgement, one CRM record, exactly one owner, valid downstream work.",
    input: "Observed journey state",
    output: "Pass / fail assertions",
    boundary: "Cannot invent new business rules",
  },
  {
    id: "observer",
    index: "03",
    title: "Observer",
    subtitle: "Watches the handoffs",
    icon: Activity,
    accent: "cyan",
    detail: "Watchdog records the state produced at each integration boundary. It cares about the relationship between systems, not just whether each API is online.",
    input: "Form → AI → CRM → routing",
    output: "Expected vs actual evidence",
    boundary: "Reads only required journey fields",
  },
  {
    id: "guard",
    index: "04",
    title: "Guard layer",
    subtitle: "Stops bad state spreading",
    icon: LockKeyhole,
    accent: "amber",
    detail: "When a prerequisite fails, guarded downstream actions do not run. An unowned lead cannot create a misleading Slack alert or orphan follow-up task.",
    input: "Failed owner assertion",
    output: "Slack + task blocked",
    boundary: "No autonomous business decision",
  },
  {
    id: "recovery",
    index: "05",
    title: "Evidence + recovery",
    subtitle: "Explains and replays safely",
    icon: DatabaseZap,
    accent: "emerald",
    detail: "The incident packages the failure boundary, likely regression source and recovery path. Replay resumes from the failed boundary with the same idempotency key.",
    input: "Incident + mapping fix",
    output: "Verified recovery",
    boundary: "No duplicate CRM lead",
  },
] as const;

type LayerId = (typeof layers)[number]["id"];

const accents: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-400/35", text: "text-blue-300", glow: "shadow-[0_0_55px_rgba(59,130,246,.18)]" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-400/35", text: "text-violet-300", glow: "shadow-[0_0_55px_rgba(139,92,246,.17)]" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-400/35", text: "text-cyan-300", glow: "shadow-[0_0_55px_rgba(6,182,212,.16)]" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-400/35", text: "text-amber-300", glow: "shadow-[0_0_55px_rgba(245,158,11,.16)]" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-400/35", text: "text-emerald-300", glow: "shadow-[0_0_55px_rgba(16,185,129,.16)]" },
};

export function SystemModel() {
  const [activeId, setActiveId] = useState<LayerId>("observer");
  const [exploded, setExploded] = useState(true);
  const [tracing, setTracing] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);
  const active = layers.find((layer) => layer.id === activeId) ?? layers[2];

  useEffect(() => {
    const card = modelRef.current?.querySelector(`[data-layer="${activeId}"]`);
    const detail = document.querySelector(".layer-detail-panel");
    if (card) {
      animate(card, {
        scale: [1, 1.045, 1.02],
        duration: 540,
        ease: "out(4)",
      });
    }
    if (detail) {
      animate(detail, {
        opacity: [0.25, 1],
        y: [8, 0],
        duration: 360,
        ease: "out(4)",
      });
    }
  }, [activeId]);

  const rotateModel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!modelRef.current || tracing) return;
    const rect = modelRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    animate(modelRef.current, {
      rotateY: px * 12,
      rotateX: -8 - py * 8,
      duration: 500,
      ease: "out(4)",
    });
  };

  const resetRotation = () => {
    if (!modelRef.current || tracing) return;
    animate(modelRef.current, {
      rotateY: 0,
      rotateX: -10,
      duration: 650,
      ease: "out(4)",
    });
  };

  const trace = () => {
    if (tracing) return;
    setTracing(true);
    const cards = modelRef.current?.querySelectorAll(".spatial-layer");
    const pulses = modelRef.current?.querySelectorAll(".model-pulse");

    if (cards) {
      animate(cards, {
        opacity: [0.55, 1],
        scale: [0.985, 1.025, 1],
        delay: stagger(520),
        duration: 620,
        ease: "inOut(3)",
      });
    }

    if (pulses) {
      animate(pulses, {
        opacity: [0, 1, 0],
        scale: [0.4, 1.7, 0.7],
        delay: stagger(520, { start: 180 }),
        duration: 850,
        ease: "out(4)",
      });
    }

    layers.forEach((layer, index) => {
      window.setTimeout(() => setActiveId(layer.id), index * 520 + 120);
    });

    window.setTimeout(() => setTracing(false), layers.length * 520 + 850);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-6 rounded-[30px] border border-slate-800 bg-[#090d16] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,.22)] md:p-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-semibold text-slate-300">
            <Layers3 size={14} className="text-blue-400" />
            Spatial system model
          </div>
          <h1 className="text-[38px] font-semibold leading-[1.02] tracking-[-0.06em] md:text-[54px]">
            Pull Watchdog apart.
          </h1>
        </div>
        <div>
          <p className="max-w-xl text-[15px] leading-7 text-slate-400">
            Move your pointer across the model, click a layer to lift it forward, or trace one check through the full stack. Every plane represents a real responsibility in the system.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={trace}
              disabled={tracing}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60"
            >
              {tracing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {tracing ? "Tracing signal…" : "Trace a check"}
            </button>
            <button
              onClick={() => setExploded((value) => !value)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[.08]"
            >
              <Layers3 size={14} />
              {exploded ? "Compress stack" : "Explode stack"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[680px] overflow-hidden rounded-[30px] border border-slate-800 bg-[#070b12]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(37,99,235,.16),transparent_25%),radial-gradient(circle_at_15%_10%,rgba(139,92,246,.12),transparent_28%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,auto,32px_32px,32px_32px]" />
          <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-slate-400 backdrop-blur">
            <MousePointer2 size={13} />
            Drag your gaze across the stack
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center"
            onPointerMove={rotateModel}
            onPointerLeave={resetRotation}
          >
            <div
              ref={modelRef}
              className="relative h-[410px] w-[78%] max-w-[610px] [transform-style:preserve-3d]"
              style={{ transform: "rotateX(-10deg)", perspective: "1400px" }}
            >
              {layers.map((layer, index) => {
                const Icon = layer.icon;
                const accent = accents[layer.accent];
                const selected = layer.id === activeId;
                const baseZ = exploded ? index * 56 : index * 24;
                const baseY = exploded ? -index * 40 : -index * 16;

                return (
                  <button
                    key={layer.id}
                    data-layer={layer.id}
                    onClick={() => setActiveId(layer.id)}
                    className={`spatial-layer absolute left-0 right-0 top-[150px] mx-auto h-[150px] w-full rounded-[26px] border text-left backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 ${accent.border} ${selected ? `${accent.bg} ${accent.glow}` : "border-white/10 bg-white/[.035]"}`}
                    style={{
                      transform: `translate3d(0, ${baseY + (selected ? -18 : 0)}px, ${baseZ + (selected ? 55 : 0)}px) scale(${selected ? 1.02 : 1})`,
                      transformStyle: "preserve-3d",
                      zIndex: selected ? 30 : 10 + index,
                    }}
                  >
                    <div className="flex h-full items-center gap-4 p-5 md:p-6">
                      <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${accent.bg} ${accent.text}`}>
                        <Icon size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold text-slate-600">{layer.index}</span>
                          <span className="text-[11px] font-semibold uppercase tracking-[.1em] text-slate-500">{layer.subtitle}</span>
                        </div>
                        <p className="mt-2 text-[18px] font-semibold tracking-[-.03em] text-white">{layer.title}</p>
                      </div>
                      {selected ? <span className={`hidden rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold md:inline-flex ${accent.text}`}>selected</span> : null}
                    </div>
                    <span className={`model-pulse pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 ${layer.accent === "emerald" ? "bg-emerald-400" : layer.accent === "amber" ? "bg-amber-400" : layer.accent === "violet" ? "bg-violet-400" : layer.accent === "cyan" ? "bg-cyan-400" : "bg-blue-400"}`} />
                  </button>
                );
              })}

              <div className="pointer-events-none absolute left-1/2 top-[76px] h-[330px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent" />
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <Fingerprint size={13} className="text-emerald-400" />
              synthetic-only identity
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <ShieldCheck size={13} className="text-blue-400" />
              business outcome observer
            </div>
          </div>
        </div>

        <div className="layer-detail-panel rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.055)] md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-semibold text-slate-400">{active.index} / 05</p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-[-.05em] text-slate-950">{active.title}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{active.subtitle}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              {(() => {
                const Icon = active.icon;
                return <Icon size={19} />;
              })()}
            </span>
          </div>

          <p className="mt-6 text-[15px] leading-7 text-slate-600">{active.detail}</p>

          <div className="mt-6 space-y-2.5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-400">Receives</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{active.input}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-blue-500">Produces</p>
              <p className="mt-2 text-sm font-semibold text-blue-950">{active.output}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/65 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-emerald-600">Safety boundary</p>
              <p className="mt-2 text-sm font-semibold text-emerald-950">{active.boundary}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-4 font-mono text-[11px] leading-6 text-slate-500">
            <div className="flex items-center justify-between">
              <span>watchdog.layer</span>
              <span className="text-emerald-400">active</span>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2">
              journey = residential_enquiry<br />
              scope = bright_home_demo<br />
              mode = synthetic_only<br />
              replay = idempotent
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          [GitBranch, "Watch boundaries, not logos", "The model cares about the state passed between systems. A green API can still produce a broken business journey."],
          [LockKeyhole, "Fail closed", "A missing prerequisite stops downstream side effects rather than letting invalid state cascade through the workflow."],
          [CheckCircle2, "Recover from the boundary", "Replay starts where the journey failed and reuses the same synthetic lead instead of starting over blindly."],
        ].map(([Icon, title, body]) => {
          const LayerIcon = Icon as typeof ShieldCheck;
          return (
            <div key={String(title)} className="rounded-[22px] border border-slate-200 bg-white p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><LayerIcon size={16} /></span>
              <p className="mt-4 text-sm font-semibold text-slate-950">{String(title)}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{String(body)}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
