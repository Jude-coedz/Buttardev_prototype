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
  ArrowRight,
  Bot,
  Braces,
  CircleDot,
  DatabaseZap,
  GitBranch,
  Layers3,
  LockKeyhole,
  MousePointer2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const modules = [
  {
    id: "probe",
    title: "Synthetic probe",
    short: "Enters the real customer path safely",
    color: "#5d74ff",
    receives: "A schedule, deployment event, or operator-triggered check",
    produces: "A synthetic customer event with a stable replay key",
    boundary: "Never needs a real customer's identity",
    explanation:
      "The probe is the input port. It injects a safe test event into the same route a real customer would use, giving Watchdog something realistic to observe without borrowing production PII.",
    icon: Bot,
  },
  {
    id: "contract",
    title: "Contract engine",
    short: "Turns business promises into assertions",
    color: "#9b72f2",
    receives: "The business conditions that must remain true",
    produces: "Executable assertions for each handoff",
    boundary: "Cannot invent policy that the client did not define",
    explanation:
      "This is the decision chip in the core. It knows the journey promises: one CRM record, one valid owner, truthful acknowledgements, approval thresholds, or any other condition the client depends on.",
    icon: Braces,
  },
  {
    id: "observer",
    title: "Handoff observer",
    short: "Sees the state crossing between tools",
    color: "#28b0d0",
    receives: "Outputs from the website, AI, CRM and routing adapters",
    produces: "Expected-vs-actual evidence at the exact boundary",
    boundary: "Reads the minimum fields required for the assertion",
    explanation:
      "The observer ring sits around the core. It watches integration boundaries, not vendor logos. This is how Watchdog catches a broken business outcome while every underlying platform still reports healthy.",
    icon: GitBranch,
  },
  {
    id: "guard",
    title: "Guard shell",
    short: "Stops invalid state from escaping",
    color: "#df9e39",
    receives: "Failed prerequisites and risk conditions",
    produces: "A gate that blocks unsafe downstream actions",
    boundary: "Does not replace the human business decision",
    explanation:
      "The outer shell is the fail-closed layer. If an assertion fails, downstream side effects stay sealed inside the boundary instead of propagating bad state into Slack, payments, tasks, emails, or fulfilment.",
    icon: LockKeyhole,
  },
  {
    id: "evidence",
    title: "Evidence cartridge",
    short: "Packages the incident and replay point",
    color: "#31b879",
    receives: "Failure evidence plus the corrected configuration",
    produces: "A bounded replay and verified recovery",
    boundary: "Reuses the same idempotency key instead of duplicating work",
    explanation:
      "The evidence cartridge is the recovery module. It stores what failed, where it failed, what was protected, and the stable identifiers needed to restart from the failed boundary safely.",
    icon: DatabaseZap,
  },
] as const;

type ModuleId = (typeof modules)[number]["id"];

type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  controls: OrbitControls;
  core: THREE.Group;
  signal: THREE.Mesh;
  groups: Record<ModuleId, THREE.Group>;
  labels: Record<ModuleId, HTMLElement>;
  clickable: THREE.Object3D[];
  frame: number;
  resizeObserver: ResizeObserver;
};

const assembled: Record<ModuleId, [number, number, number]> = {
  probe: [-2.55, 0, 0],
  contract: [0, 0, 0],
  observer: [0, 0, 0.05],
  guard: [0, 0, 0],
  evidence: [2.55, 0, 0],
};

const exploded: Record<ModuleId, [number, number, number]> = {
  probe: [-4.9, 0.3, 0.2],
  contract: [0, 3.45, 0.1],
  observer: [0.15, 0.1, 3.65],
  guard: [0, -3.65, -0.1],
  evidence: [4.95, -0.15, 0.25],
};

function moduleLabel(title: string, color: string) {
  const element = document.createElement("div");
  element.style.padding = "7px 10px";
  element.style.borderRadius = "10px";
  element.style.background = "rgba(6, 10, 16, .82)";
  element.style.border = "1px solid rgba(255,255,255,.12)";
  element.style.backdropFilter = "blur(12px)";
  element.style.fontFamily = "var(--font-inter), Inter, sans-serif";
  element.style.fontSize = "13px";
  element.style.fontWeight = "650";
  element.style.color = "white";
  element.style.whiteSpace = "nowrap";
  element.style.pointerEvents = "none";
  element.style.transition = "opacity .25s ease";
  element.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:${color};margin-right:7px;box-shadow:0 0 12px ${color}"></span>${title}`;
  return element;
}

function makeCore(scene: THREE.Scene) {
  const core = new THREE.Group();
  scene.add(core);

  const chassis = new THREE.Mesh(
    new RoundedBoxGeometry(4.8, 3.45, 3.15, 8, 0.28),
    new THREE.MeshPhysicalMaterial({
      color: "#111824",
      roughness: 0.26,
      metalness: 0.46,
      transmission: 0.06,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.65,
      clearcoatRoughness: 0.22,
    }),
  );
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  core.add(chassis);

  const innerGlow = new THREE.Mesh(
    new RoundedBoxGeometry(4.28, 2.92, 2.65, 6, 0.22),
    new THREE.MeshStandardMaterial({
      color: "#172236",
      emissive: "#3552a8",
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.72,
      roughness: 0.44,
    }),
  );
  core.add(innerGlow);

  const seamMaterial = new THREE.LineBasicMaterial({ color: "#40506a", transparent: true, opacity: 0.34 });
  [-1.05, 1.05].forEach((x) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -1.42, 1.59),
      new THREE.Vector3(x, 1.42, 1.59),
    ]);
    core.add(new THREE.Line(geometry, seamMaterial));
  });

  return core;
}

function addProbe(core: THREE.Group, clickable: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.userData.moduleId = "probe";

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 1.5, 40),
    new THREE.MeshStandardMaterial({
      color: "#21366d",
      emissive: "#5d74ff",
      emissiveIntensity: 0.32,
      metalness: 0.45,
      roughness: 0.24,
    }),
  );
  body.rotation.z = Math.PI / 2;
  body.userData.moduleId = "probe";
  group.add(body);
  clickable.push(body);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 32, 32),
    new THREE.MeshStandardMaterial({ color: "#8fa0ff", emissive: "#5d74ff", emissiveIntensity: 1.5 }),
  );
  cap.position.x = -0.78;
  cap.userData.moduleId = "probe";
  group.add(cap);
  clickable.push(cap);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.055, 16, 48),
    new THREE.MeshStandardMaterial({ color: "#8fa0ff", emissive: "#5d74ff", emissiveIntensity: 0.9 }),
  );
  ring.rotation.y = Math.PI / 2;
  ring.position.x = 0.45;
  group.add(ring);

  core.add(group);
  return group;
}

function addContract(core: THREE.Group, clickable: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.userData.moduleId = "contract";

  const chip = new THREE.Mesh(
    new RoundedBoxGeometry(1.7, 1.15, 1.45, 6, 0.18),
    new THREE.MeshStandardMaterial({
      color: "#2e2148",
      emissive: "#9b72f2",
      emissiveIntensity: 0.45,
      metalness: 0.38,
      roughness: 0.25,
    }),
  );
  chip.userData.moduleId = "contract";
  group.add(chip);
  clickable.push(chip);

  for (let i = -2; i <= 2; i += 1) {
    const pin = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.36),
      new THREE.MeshStandardMaterial({ color: "#c9b8ff", emissive: "#9b72f2", emissiveIntensity: 0.45 }),
    );
    pin.position.set(i * 0.26, -0.64, 0);
    group.add(pin);
  }

  const coreDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 24),
    new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#b89cff", emissiveIntensity: 2.1 }),
  );
  coreDot.position.z = 0.78;
  group.add(coreDot);

  core.add(group);
  return group;
}

function addObserver(core: THREE.Group, clickable: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.userData.moduleId = "observer";

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, 0.105, 24, 96),
    new THREE.MeshStandardMaterial({
      color: "#1e6d7e",
      emissive: "#28b0d0",
      emissiveIntensity: 0.68,
      metalness: 0.32,
      roughness: 0.24,
    }),
  );
  ring.userData.moduleId = "observer";
  group.add(ring);
  clickable.push(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.34, 0.035, 18, 96),
    new THREE.MeshStandardMaterial({
      color: "#6cdbed",
      emissive: "#28b0d0",
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.72,
    }),
  );
  group.add(ring2);

  const sensor = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 28, 28),
    new THREE.MeshStandardMaterial({ color: "#9bedf7", emissive: "#28b0d0", emissiveIntensity: 1.6 }),
  );
  sensor.position.set(0, 2.72, 0);
  sensor.userData.moduleId = "observer";
  group.add(sensor);
  clickable.push(sensor);

  core.add(group);
  return group;
}

function addGuard(core: THREE.Group, clickable: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.userData.moduleId = "guard";

  const shellGeo = new THREE.BoxGeometry(5.35, 4.0, 3.72);
  const shell = new THREE.Mesh(
    shellGeo,
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.025, color: "#df9e39" }),
  );
  shell.userData.moduleId = "guard";
  group.add(shell);
  clickable.push(shell);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: "#df9e39", transparent: true, opacity: 0.5 }),
  );
  group.add(edges);

  const corner = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.18),
    new THREE.MeshStandardMaterial({ color: "#ffd17f", emissive: "#df9e39", emissiveIntensity: 1.0 }),
  );
  corner.position.set(2.67, 2, 1.86);
  group.add(corner);

  core.add(group);
  return group;
}

function addEvidence(core: THREE.Group, clickable: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.userData.moduleId = "evidence";

  const cartridge = new THREE.Mesh(
    new RoundedBoxGeometry(1.4, 2.0, 1.75, 6, 0.2),
    new THREE.MeshStandardMaterial({
      color: "#173e31",
      emissive: "#31b879",
      emissiveIntensity: 0.36,
      metalness: 0.4,
      roughness: 0.28,
    }),
  );
  cartridge.userData.moduleId = "evidence";
  group.add(cartridge);
  clickable.push(cartridge);

  [0.45, 0, -0.45].forEach((y) => {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.18, 1.2),
      new THREE.MeshStandardMaterial({ color: "#72e4ae", emissive: "#31b879", emissiveIntensity: 0.6 }),
    );
    slot.position.set(0.72, y, 0);
    group.add(slot);
  });

  core.add(group);
  return group;
}

export function WatchdogArchitecture3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const [activeId, setActiveId] = useState<ModuleId>("contract");
  const [explodeProgress, setExplodeProgress] = useState(0.72);
  const [traceNonce, setTraceNonce] = useState(0);
  const [tracing, setTracing] = useState(false);

  const active = useMemo(() => modules.find((item) => item.id === activeId) ?? modules[1], [activeId]);
  const ActiveIcon = active.icon;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080c12");

    const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 100);
    camera.position.set(9.6, 6.2, 11.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.inset = "0";
    labelRenderer.domElement.style.pointerEvents = "none";

    mount.appendChild(renderer.domElement);
    mount.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 18;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight("#b8c7e7", 1.2));

    const key = new THREE.DirectionalLight("#ffffff", 3.5);
    key.position.set(6, 8, 8);
    key.castShadow = true;
    scene.add(key);

    const blue = new THREE.PointLight("#5d74ff", 32, 24);
    blue.position.set(-5, 2.5, 4);
    scene.add(blue);

    const green = new THREE.PointLight("#31b879", 26, 22);
    green.position.set(5, -2.5, 4);
    scene.add(green);

    const purple = new THREE.PointLight("#9b72f2", 18, 18);
    purple.position.set(0, 5, -2);
    scene.add(purple);

    const floor = new THREE.GridHelper(22, 22, "#233044", "#121a26");
    floor.position.y = -4.3;
    floor.material.transparent = true;
    floor.material.opacity = 0.28;
    scene.add(floor);

    const core = makeCore(scene);
    core.rotation.set(-0.08, -0.16, 0.02);

    const clickable: THREE.Object3D[] = [];
    const groups = {
      probe: addProbe(core, clickable),
      contract: addContract(core, clickable),
      observer: addObserver(core, clickable),
      guard: addGuard(core, clickable),
      evidence: addEvidence(core, clickable),
    } as Record<ModuleId, THREE.Group>;

    const labels = {} as Record<ModuleId, HTMLElement>;
    modules.forEach((module) => {
      const labelEl = moduleLabel(module.title, module.color);
      const label = new CSS2DObject(labelEl);
      label.position.set(0, 1.55, 0);
      groups[module.id].add(label);
      labels[module.id] = labelEl;
    });

    const signal = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#91a4ff", emissiveIntensity: 2.8 }),
    );
    signal.position.set(-7.2, 0, 0);
    scene.add(signal);

    const inputLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-7, 0, 0), new THREE.Vector3(-3.3, 0, 0)]),
      new THREE.LineBasicMaterial({ color: "#5d74ff", transparent: true, opacity: 0.45 }),
    );
    scene.add(inputLine);

    const outputLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(3.3, 0, 0), new THREE.Vector3(7, 0, 0)]),
      new THREE.LineBasicMaterial({ color: "#31b879", transparent: true, opacity: 0.45 }),
    );
    scene.add(outputLine);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const intersections = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickable, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      renderer.domElement.style.cursor = intersections(event).length ? "pointer" : "grab";
    };

    const onClick = (event: PointerEvent) => {
      const hit = intersections(event)[0];
      const id = hit?.object.userData.moduleId as ModuleId | undefined;
      if (id) setActiveId(id);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setExplodeProgress((value) => Math.max(0, Math.min(1, value + event.deltaY * 0.0013)));
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.fov = width < 760 ? 49 : 41;
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
      core,
      signal,
      groups,
      labels,
      clickable,
      frame,
      resizeObserver,
    };

    return () => {
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
      controls.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;

    modules.forEach((module) => {
      const group = state.groups[module.id];
      const start = assembled[module.id];
      const end = exploded[module.id];
      const selected = module.id === activeId;

      const x = start[0] + (end[0] - start[0]) * explodeProgress;
      const y = start[1] + (end[1] - start[1]) * explodeProgress;
      const z = start[2] + (end[2] - start[2]) * explodeProgress + (selected ? 0.55 : 0);

      animate(group, {
        x,
        y,
        z,
        scale: selected ? 1.08 : 1,
        duration: 420,
        ease: "out(4)",
      });

      state.labels[module.id].style.opacity = explodeProgress > 0.28 || selected ? "1" : "0";
    });
  }, [activeId, explodeProgress]);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state || traceNonce === 0) return;

    setTracing(true);
    setExplodeProgress(0.55);

    utils.set(state.signal, { x: -7.2, y: 0, z: 0, scale: 0.7 });

    const timeline = createTimeline({
      defaults: { duration: 720, ease: "inOut(3)" },
      autoplay: false,
      onComplete: () => setTracing(false),
    });

    timeline
      .call(() => setActiveId("probe"), 0)
      .add(state.signal, { x: -2.55, y: 0, z: 0, scale: 1.1 }, 0)
      .call(() => setActiveId("contract"), 760)
      .add(state.signal, { x: 0, y: 0, z: 0.1 }, 760)
      .call(() => setActiveId("observer"), 1520)
      .add(state.signal, { x: 0, y: 0.4, z: 2.0 }, 1520)
      .call(() => setActiveId("guard"), 2280)
      .add(state.signal, { x: 0, y: -1.7, z: 0 }, 2280)
      .call(() => setActiveId("evidence"), 3040)
      .add(state.signal, { x: 2.55, y: 0, z: 0.1 }, 3040)
      .add(state.signal, { x: 7.2, y: 0, z: 0, scale: 0.72 }, 3800)
      .play();

    return () => {
      timeline.cancel();
    };
  }, [traceNonce]);

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-[#080b10] text-white">
      <div className="mx-auto max-w-[1540px] px-4 py-3 md:px-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/recovery" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.04] text-white/65 transition hover:bg-white/[.08] hover:text-white" aria-label="Back to recovery">
              <ArrowLeft size={17} />
            </Link>
            <div>
              <p className="text-[14px] font-semibold text-[#91a1ff]">Live 3D teardown</p>
              <h1 className="mt-0.5 text-[29px] font-semibold tracking-[-0.045em] md:text-[36px]">Take the Watchdog core apart.</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setExplodeProgress((value) => value > 0.4 ? 0 : 1)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3.5 text-[14px] font-semibold text-white/72 transition hover:bg-white/[.08]"
            >
              <Layers3 size={15} />
              {explodeProgress > 0.4 ? "Reassemble core" : "Explode core"}
            </button>
            <button
              onClick={() => setTraceNonce((value) => value + 1)}
              disabled={tracing}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3.5 text-[14px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
            >
              {tracing ? <RotateCcw size={15} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              {tracing ? "Tracing event" : "Trace an event"}
            </button>
          </div>
        </div>

        <div className="grid h-[calc(100dvh-150px)] min-h-[500px] max-h-[760px] gap-4 xl:grid-cols-[1.35fr_.65fr]">
          <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1018]">
            <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[13px] font-medium text-white/52 backdrop-blur">
                <MousePointer2 size={13} />
                Drag to rotate · click a part
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[13px] font-medium text-white/52 backdrop-blur">
                <Layers3 size={13} />
                Scroll over the model to pull it apart
              </span>
            </div>

            <div ref={mountRef} className="absolute inset-0" />

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-4">
              <div className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[13px] font-medium text-white/45 backdrop-blur">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#55d99b]" />
                Three.js core · Anime.js object animation
              </div>
              <div className="hidden w-40 md:block">
                <div className="mb-1.5 flex justify-between text-[11px] font-medium text-white/32">
                  <span>assembled</span><span>exploded</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#7180ff] transition-[width] duration-200" style={{ width: `${explodeProgress * 100}%` }} />
                </div>
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col overflow-y-auto rounded-[26px] border border-white/10 bg-[#10151e] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-white/38">Selected physical module</p>
                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.045em]">{active.title}</h2>
                <p className="mt-1 text-[15px] text-white/46">{active.short}</p>
              </div>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${active.color}22`, color: active.color }}>
                <ActiveIcon size={20} />
              </span>
            </div>

            <p className="mt-5 text-[16px] leading-7 text-white/64">{active.explanation}</p>

            <div className="mt-5 space-y-2.5">
              <div className="rounded-[16px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/34">Receives</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/80">{active.receives}</p>
              </div>
              <div className="rounded-[16px] border border-white/10 bg-white/[.035] p-4">
                <p className="text-[13px] font-medium text-white/34">Produces</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/80">{active.produces}</p>
              </div>
              <div className="rounded-[16px] border border-[#55d99b]/18 bg-[#55d99b]/[.05] p-4">
                <div className="flex items-center gap-2 text-[#70e5ae]">
                  <ShieldCheck size={14} />
                  <p className="text-[13px] font-semibold">Safety boundary</p>
                </div>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-white/75">{active.boundary}</p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              <div className="rounded-[18px] border border-[#8c99ff]/22 bg-[#5865ff]/[.07] p-4">
                <div className="flex items-center gap-2 text-[#9fa9ff]">
                  <Sparkles size={15} />
                  <p className="text-[14px] font-semibold">After the teardown</p>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-white/52">See the same architecture wrapped around invoice approvals, onboarding, fulfilment and other mimicked automations.</p>
                <Link href="/use-cases" className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-white">
                  Open use cases
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
