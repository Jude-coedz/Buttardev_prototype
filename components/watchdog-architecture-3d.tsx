"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { animate, createTimeline, utils } from "animejs";
import "animejs/adapters/three";
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
      "The probe enters the same customer-facing path as a real lead, but carries an isolated test identity and a stable idempotency key.",
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
    receives: "State crossing website, AI, CRM and routing boundaries",
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
    produces: "Slack alerts and follow-up tasks are blocked",
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

type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  controls: OrbitControls;
  root: THREE.Group;
  signal: THREE.Mesh;
  groups: Record<LayerId, THREE.Group>;
  clickableMeshes: THREE.Mesh[];
  frame: number;
  resizeObserver: ResizeObserver;
};

function makeLabel(title: string, subtitle: string, color: string) {
  const element = document.createElement("div");
  element.style.width = "245px";
  element.style.textAlign = "center";
  element.style.fontFamily = "var(--font-inter), Inter, sans-serif";
  element.style.pointerEvents = "none";
  element.style.userSelect = "none";
  element.innerHTML = `
    <div style="font-size:18px;font-weight:650;letter-spacing:-.03em;color:white">${title}</div>
    <div style="margin-top:5px;font-size:13px;color:rgba(255,255,255,.52)">${subtitle}</div>
    <div style="width:34px;height:2px;border-radius:99px;background:${color};margin:10px auto 0;opacity:.85"></div>
  `;
  return element;
}

function makeExternalLabel(title: string, subtitle: string) {
  const element = document.createElement("div");
  element.style.width = "150px";
  element.style.textAlign = "center";
  element.style.fontFamily = "var(--font-inter), Inter, sans-serif";
  element.style.pointerEvents = "none";
  element.style.userSelect = "none";
  element.innerHTML = `
    <div style="font-size:14px;font-weight:650;color:white">${title}</div>
    <div style="margin-top:3px;font-size:12px;color:rgba(255,255,255,.42)">${subtitle}</div>
  `;
  return element;
}

export function WatchdogArchitecture3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const [activeId, setActiveId] = useState<LayerId>("observer");
  const [exploded, setExploded] = useState(true);
  const [traceNonce, setTraceNonce] = useState(0);
  const [tracing, setTracing] = useState(false);

  const active = useMemo(
    () => layers.find((layer) => layer.id === activeId) ?? layers[2],
    [activeId],
  );
  const ActiveIcon = active.icon;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1018");

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(9.2, 6.3, 12.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.inset = "0";
    labelRenderer.domElement.style.pointerEvents = "none";

    mount.appendChild(renderer.domElement);
    mount.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI * 0.24;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight("#c8d4ff", 1.3));

    const key = new THREE.DirectionalLight("#ffffff", 3.2);
    key.position.set(6, 9, 8);
    scene.add(key);

    const blue = new THREE.PointLight("#5367ff", 42, 30);
    blue.position.set(-6, 3, 4);
    scene.add(blue);

    const green = new THREE.PointLight("#2eaa72", 34, 28);
    green.position.set(6, -4, 4);
    scene.add(green);

    const root = new THREE.Group();
    root.rotation.set(-0.14, -0.12, 0);
    scene.add(root);

    const groups = {} as Record<LayerId, THREE.Group>;
    const clickableMeshes: THREE.Mesh[] = [];

    layers.forEach((layer, index) => {
      const group = new THREE.Group();
      group.position.set(0, (2 - index) * 1.45, index * 0.14);
      group.userData.layerId = layer.id;

      const geometry = new RoundedBoxGeometry(6.4, 0.28, 3.15, 6, 0.16);
      const material = new THREE.MeshStandardMaterial({
        color: "#17202d",
        roughness: 0.34,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
        emissive: new THREE.Color(layer.color),
        emissiveIntensity: layer.id === "observer" ? 0.18 : 0.035,
      });

      const plate = new THREE.Mesh(geometry, material);
      plate.castShadow = true;
      plate.receiveShadow = true;
      plate.userData.layerId = layer.id;
      group.add(plate);
      clickableMeshes.push(plate);

      const insetGeometry = new RoundedBoxGeometry(5.72, 0.055, 2.48, 5, 0.12);
      const insetMaterial = new THREE.MeshStandardMaterial({
        color: layer.color,
        transparent: true,
        opacity: layer.id === "observer" ? 0.18 : 0.06,
        roughness: 0.42,
      });
      const inset = new THREE.Mesh(insetGeometry, insetMaterial);
      inset.position.y = 0.19;
      group.add(inset);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.105, 24, 24),
        new THREE.MeshStandardMaterial({
          color: layer.color,
          emissive: layer.color,
          emissiveIntensity: 1.2,
        }),
      );
      marker.position.set(-2.82, 0.28, 1.12);
      group.add(marker);

      const label = new CSS2DObject(makeLabel(layer.title, layer.short, layer.color));
      label.position.set(0, 0.48, 0);
      group.add(label);

      root.add(group);
      groups[layer.id] = group;
    });

    const makeExternalNode = (
      position: [number, number, number],
      color: string,
      title: string,
      subtitle: string,
    ) => {
      const group = new THREE.Group();
      group.position.set(...position);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.43, 32, 32),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.45,
          roughness: 0.38,
        }),
      );
      group.add(sphere);

      const label = new CSS2DObject(makeExternalLabel(title, subtitle));
      label.position.set(0, -0.78, 0);
      group.add(label);

      root.add(group);
      return group;
    };

    makeExternalNode([-6.2, 3.75, 0.2], "#5d74ff", "Client workflow", "website · AI · CRM");
    makeExternalNode([6.0, -3.65, 0.2], "#2eaa72", "Safe outcome", "alert · task · evidence");

    const lineMaterialIn = new THREE.LineBasicMaterial({
      color: "#5d74ff",
      transparent: true,
      opacity: 0.42,
    });
    const lineIn = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-5.78, 3.68, 0.18),
        new THREE.Vector3(-3.45, 3.12, 0.08),
      ]),
      lineMaterialIn,
    );
    root.add(lineIn);

    const lineMaterialOut = new THREE.LineBasicMaterial({
      color: "#2eaa72",
      transparent: true,
      opacity: 0.42,
    });
    const lineOut = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(3.45, -3.12, 0.08),
        new THREE.Vector3(5.56, -3.56, 0.18),
      ]),
      lineMaterialOut,
    );
    root.add(lineOut);

    const signal = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 32, 32),
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#8da0ff",
        emissiveIntensity: 2.6,
      }),
    );
    signal.position.set(-6.2, 3.75, 0.2);
    root.add(signal);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const pointerFromEvent = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickableMeshes, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      renderer.domElement.style.cursor = pointerFromEvent(event).length ? "pointer" : "grab";
    };

    const onClick = (event: PointerEvent) => {
      const hit = pointerFromEvent(event)[0];
      const id = hit?.object.userData.layerId as LayerId | undefined;
      if (id) setActiveId(id);
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      labelRenderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    render();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      labelRenderer,
      controls,
      root,
      signal,
      groups,
      clickableMeshes,
      frame,
      resizeObserver,
    };

    return () => {
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
      controls.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
      sceneRef.current = null;
      document.body.style.cursor = "default";
    };
  }, []);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;

    layers.forEach((layer, index) => {
      const group = state.groups[layer.id];
      const plate = group.children.find(
        (child) => child instanceof THREE.Mesh,
      ) as THREE.Mesh | undefined;
      const material = plate?.material as THREE.MeshStandardMaterial | undefined;

      const spacing = exploded ? 1.45 : 0.72;
      const targetY = (2 - index) * spacing;
      const selected = layer.id === activeId;

      animate(group, {
        y: targetY,
        z: selected ? 1.05 : index * 0.14,
        scale: selected ? 1.06 : 1,
        rotateY: selected ? 4 : 0,
        duration: 680,
        ease: "out(4)",
      });

      if (material) {
        material.emissiveIntensity = selected ? 0.22 : 0.035;
        material.color.set(selected ? layer.color : "#17202d");
      }
    });
  }, [activeId, exploded]);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state || traceNonce === 0) return;

    setTracing(true);

    utils.set(state.signal, {
      x: -6.2,
      y: 3.75,
      z: 0.2,
      scale: 0.6,
    });

    const timeline = createTimeline({
      defaults: { duration: 620, ease: "inOut(3)" },
      autoplay: false,
      onComplete: () => setTracing(false),
    });

    timeline
      .call(() => setActiveId("probe"), 0)
      .add(state.signal, { x: -1.8, y: 3.0, scale: 1 }, 0)
      .call(() => setActiveId("contract"), 620)
      .add(state.signal, { x: 0, y: 1.45, z: 0.5 }, 620)
      .call(() => setActiveId("observer"), 1240)
      .add(state.signal, { y: 0, z: 0.8 }, 1240)
      .call(() => setActiveId("guard"), 1860)
      .add(state.signal, { y: -1.45, z: 1.0 }, 1860)
      .call(() => setActiveId("evidence"), 2480)
      .add(state.signal, { y: -2.9, z: 1.2 }, 2480)
      .add(state.signal, { x: 6.0, y: -3.65, z: 0.2, scale: 0.65 }, 3100)
      .play();

    return () => timeline.cancel();
  }, [traceNonce]);

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

            <div ref={mountRef} className="absolute inset-0" />

            <div className="pointer-events-none absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[13px] font-medium text-white/45 backdrop-blur">
              <CircleDot size={13} className="text-[#55d99b]" />
              Three.js · Anime.js Three adapter
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
