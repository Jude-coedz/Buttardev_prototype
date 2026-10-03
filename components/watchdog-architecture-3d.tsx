"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  Html,
  Line,
  PresentationControls,
  RoundedBox,
} from "@react-three/drei";
import { animate, createTimeline, utils } from "animejs";
import "animejs/adapters/three";
import type { Group, Mesh } from "three";
import {
  ArrowLeft,
  Bot,
  Braces,
  CircleDot,
  DatabaseZap,
  GitBranch,
  Layers3,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const layers = [
  {
    id: "probe",
    title: "Synthetic probe",
    short: "Safe test customer",
    color: "#5d74ff",
    receives: "A scheduled test trigger",
    produces: "A synthetic enquiry with a stable replay key",
    boundary: "No real customer identity",
    explanation:
      "The probe enters the same customer-facing path as a real lead, but it carries an isolated test identity and a stable idempotency key.",
    icon: Bot,
  },
  {
    id: "contract",
    title: "Journey contract",
    short: "Business truth",
    color: "#8c6cf2",
    receives: "The promises ButtarDev and the client agreed on",
    produces: "Executable assertions for every handoff",
    boundary: "Cannot invent a new business rule",
    explanation:
      "The contract translates business promises into assertions: truthful acknowledgement, one CRM record, exactly one owner, and valid downstream work.",
    icon: Braces,
  },
  {
    id: "observer",
    title: "Handoff observer",
    short: "Expected vs actual",
    color: "#24a9c8",
    receives: "The state crossing website, AI, CRM and routing boundaries",
    produces: "Evidence tied to the exact failing handoff",
    boundary: "Reads only the fields needed for the contract",
    explanation:
      "The observer watches the state produced between systems. This is why a green CRM can still coexist with a broken customer journey.",
    icon: GitBranch,
  },
  {
    id: "guard",
    title: "Guard layer",
    short: "Fail closed",
    color: "#d39736",
    receives: "A failed prerequisite such as owner_id = null",
    produces: "Blocked unsafe side effects",
    boundary: "Does not make the human business decision",
    explanation:
      "When required state is missing, the guard prevents Slack alerts and follow-up tasks from running with invalid data.",
    icon: LockKeyhole,
  },
  {
    id: "evidence",
    title: "Evidence + replay",
    short: "Recover safely",
    color: "#2eaa72",
    receives: "Incident evidence plus the corrected mapping",
    produces: "A bounded replay and verified recovery",
    boundary: "No duplicate CRM lead",
    explanation:
      "Recovery starts at the failed boundary and reuses the same idempotency key, so the existing synthetic CRM record is repaired rather than duplicated.",
    icon: DatabaseZap,
  },
] as const;

type LayerId = (typeof layers)[number]["id"];

const layerY = [2.9, 1.45, 0, -1.45, -2.9];

function LayerPlate({
  layer,
  index,
  active,
  exploded,
  onSelect,
}: {
  layer: (typeof layers)[number];
  index: number;
  active: boolean;
  exploded: boolean;
  onSelect: (id: LayerId) => void;
}) {
  const group = useRef<Group>(null);

  useEffect(() => {
    if (!group.current) return;

    const spacing = exploded ? 1.45 : 0.72;
    const targetY = (2 - index) * spacing;
    const targetZ = active ? 1.05 : index * 0.14;

    animate(group.current, {
      y: targetY,
      z: targetZ,
      scale: active ? 1.06 : 1,
      rotateY: active ? 4 : 0,
      duration: 680,
      ease: "out(4)",
    });
  }, [active, exploded, index]);

  return (
    <group
      ref={group}
      position={[0, layerY[index], index * 0.14]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(layer.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <RoundedBox args={[6.4, 0.28, 3.15]} radius={0.18} smoothness={5}>
        <meshStandardMaterial
          color={active ? layer.color : "#17202d"}
          metalness={0.2}
          roughness={0.34}
          transparent
          opacity={active ? 0.96 : 0.82}
          emissive={layer.color}
          emissiveIntensity={active ? 0.23 : 0.035}
        />
      </RoundedBox>

      <RoundedBox
        args={[5.75, 0.05, 2.52]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.18, 0]}
      >
        <meshStandardMaterial
          color={layer.color}
          transparent
          opacity={active ? 0.16 : 0.055}
        />
      </RoundedBox>

      <Html
        center
        transform
        distanceFactor={7.8}
        position={[0, 0.34, 0]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: 260,
            textAlign: "center",
            color: "white",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 650, letterSpacing: "-0.03em" }}>
            {layer.title}
          </div>
          <div style={{ marginTop: 5, fontSize: 13, color: "rgba(255,255,255,.55)" }}>
            {layer.short}
          </div>
        </div>
      </Html>

      <mesh position={[-2.82, 0.28, 1.15]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color={layer.color} emissive={layer.color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function ExternalNode({
  position,
  label,
  sublabel,
  color,
}: {
  position: [number, number, number];
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.38}
        />
      </mesh>
      <Html
        center
        position={[0, -0.72, 0]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: 140,
            textAlign: "center",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          <div style={{ color: "white", fontSize: 14, fontWeight: 650 }}>{label}</div>
          <div style={{ marginTop: 2, color: "rgba(255,255,255,.42)", fontSize: 12 }}>{sublabel}</div>
        </div>
      </Html>
    </group>
  );
}

function WatchdogScene({
  activeId,
  setActiveId,
  exploded,
  traceNonce,
  setTracing,
}: {
  activeId: LayerId;
  setActiveId: (id: LayerId) => void;
  exploded: boolean;
  traceNonce: number;
  setTracing: (value: boolean) => void;
}) {
  const signal = useRef<Mesh>(null);

  useEffect(() => {
    if (!signal.current || traceNonce === 0) return;

    setTracing(true);
    utils.set(signal.current, {
      x: -6.2,
      y: 3.75,
      z: 0.2,
      scale: 0.6,
      opacity: 1,
    });

    const timeline = createTimeline({
      defaults: {
        duration: 620,
        ease: "inOut(3)",
      },
      autoplay: false,
      onComplete: () => setTracing(false),
    });

    timeline
      .call(() => setActiveId("probe"), 0)
      .add(signal.current, { x: -1.8, y: 3.0, scale: 1 }, 0)
      .call(() => setActiveId("contract"), 620)
      .add(signal.current, { x: 0, y: 1.45, z: 0.5 }, 620)
      .call(() => setActiveId("observer"), 1240)
      .add(signal.current, { y: 0, z: 0.8 }, 1240)
      .call(() => setActiveId("guard"), 1860)
      .add(signal.current, { y: -1.45, z: 1.0 }, 1860)
      .call(() => setActiveId("evidence"), 2480)
      .add(signal.current, { y: -2.9, z: 1.2 }, 2480)
      .add(signal.current, { x: 6.0, y: -3.65, z: 0.2, scale: 0.65 }, 3100)
      .play();

    return () => timeline.cancel();
  }, [traceNonce, setActiveId, setTracing]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 8, 8]} intensity={2.2} />
      <pointLight position={[-6, 3, 3]} intensity={28} color="#5367ff" />
      <pointLight position={[5, -4, 4]} intensity={24} color="#2eaa72" />

      <PresentationControls
        global
        cursor
        speed={1}
        zoom={1}
        snap={{ mass: 1, tension: 150, friction: 24 }}
        rotation={[-0.16, -0.12, 0]}
        polar={[-0.35, 0.45]}
        azimuth={[-0.85, 0.85]}
      >
        <Float speed={0.85} rotationIntensity={0.04} floatIntensity={0.12}>
          <group>
            {layers.map((layer, index) => (
              <LayerPlate
                key={layer.id}
                layer={layer}
                index={index}
                active={activeId === layer.id}
                exploded={exploded}
                onSelect={setActiveId}
              />
            ))}

            <ExternalNode position={[-6.2, 3.75, 0.2]} label="Client workflow" sublabel="website · AI · CRM" color="#5d74ff" />
            <ExternalNode position={[6.0, -3.65, 0.2]} label="Safe outcome" sublabel="alert · task · evidence" color="#2eaa72" />

            <Line
              points={[[-5.75, 3.65, 0.15], [-3.5, 3.15, 0.08]]}
              color="#5267ff"
              lineWidth={1.25}
              transparent
              opacity={0.45}
            />
            <Line
              points={[[3.5, -3.15, 0.08], [5.55, -3.58, 0.15]]}
              color="#2eaa72"
              lineWidth={1.25}
              transparent
              opacity={0.45}
            />

            <mesh ref={signal} position={[-6.2, 3.75, 0.2]}>
              <sphereGeometry args={[0.17, 32, 32]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#8da0ff"
                emissiveIntensity={2.5}
              />
            </mesh>
          </group>
        </Float>
      </PresentationControls>
    </>
  );
}

export function WatchdogArchitecture3D() {
  const [activeId, setActiveId] = useState<LayerId>("observer");
  const [exploded, setExploded] = useState(true);
  const [traceNonce, setTraceNonce] = useState(0);
  const [tracing, setTracing] = useState(false);

  const active = useMemo(
    () => layers.find((layer) => layer.id === activeId) ?? layers[2],
    [activeId],
  );
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-[calc(100vh-52px)] bg-[#080b10] text-white">
      <div className="mx-auto max-w-[1540px] px-4 py-5 md:px-7 md:py-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/recovery"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[.04] text-white/65 transition hover:bg-white/[.08] hover:text-white"
              aria-label="Back to recovery"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-[15px] font-semibold text-[#8fa0ff]">Live 3D architecture</p>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.05em] md:text-[42px]">
                Pull Watchdog apart.
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setExploded((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 text-[14px] font-semibold text-white/75 transition hover:bg-white/[.08] hover:text-white"
            >
              <Layers3 size={16} />
              {exploded ? "Compress layers" : "Explode layers"}
            </button>
            <button
              onClick={() => setTraceNonce((value) => value + 1)}
              disabled={tracing}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
            >
              {tracing ? <RotateCcw size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
              {tracing ? "Tracing event" : "Trace one event"}
            </button>
          </div>
        </div>

        <div className="grid min-h-[760px] gap-4 xl:grid-cols-[1.25fr_.75fr]">
          <section className="relative min-h-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1018] xl:min-h-[760px]">
            <div className="pointer-events-none absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[13px] font-medium text-white/50 backdrop-blur">
              Drag to rotate · click any layer
            </div>

            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [9.2, 6.3, 12.5], fov: 38 }}
              gl={{ antialias: true, alpha: true }}
            >
              <color attach="background" args={["#0b1018"]} />
              <WatchdogScene
                activeId={activeId}
                setActiveId={setActiveId}
                exploded={exploded}
                traceNonce={traceNonce}
                setTracing={setTracing}
              />
            </Canvas>

            <div className="pointer-events-none absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[13px] font-medium text-white/45 backdrop-blur">
              <CircleDot size={13} className="text-[#55d99b]" />
              WebGL scene · Anime.js Three adapter
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-[#10151e] p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-white/40">Selected layer</p>
                <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.05em]">{active.title}</h2>
                <p className="mt-1 text-[15px] text-white/45">{active.short}</p>
              </div>
              <span
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${active.color}22`, color: active.color }}
              >
                <ActiveIcon size={21} />
              </span>
            </div>

            <p className="mt-7 text-[17px] leading-8 text-white/65">{active.explanation}</p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                <p className="text-[14px] font-medium text-white/35">Receives</p>
                <p className="mt-2 text-[15px] font-semibold leading-6 text-white/80">{active.receives}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                <p className="text-[14px] font-medium text-white/35">Produces</p>
                <p className="mt-2 text-[15px] font-semibold leading-6 text-white/80">{active.produces}</p>
              </div>
              <div className="rounded-2xl border border-[#55d99b]/20 bg-[#55d99b]/[.06] p-4">
                <div className="flex items-center gap-2 text-[#70e5ae]">
                  <ShieldCheck size={15} />
                  <p className="text-[14px] font-semibold">Safety boundary</p>
                </div>
                <p className="mt-2 text-[15px] font-semibold leading-6 text-white/75">{active.boundary}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[14px] font-semibold text-white/35">Five responsibilities, one path</p>
              <div className="mt-4 space-y-2">
                {layers.map((layer, index) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveId(layer.id)}
                    className={
                      layer.id === activeId
                        ? "flex w-full items-center justify-between rounded-xl bg-white px-3.5 py-3 text-left text-[#111318]"
                        : "flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-white/55 transition hover:bg-white/[.05] hover:text-white"
                    }
                  >
                    <span className="text-[14px] font-semibold">{layer.title}</span>
                    <span className="font-mono text-[13px] opacity-45">0{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
