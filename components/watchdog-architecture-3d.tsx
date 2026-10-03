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
import { animate } from "animejs";
import "animejs/adapters/three";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  DatabaseZap,
  Eye,
  GitBranch,
  LockKeyhole,
  MousePointer2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    id: "assembled",
    index: "00",
    title: "Assembled Watchdog",
    short: "A conceptual view of the complete control plane",
    explanation:
      "Watchdog is not one physical box. This model groups the services that work together around an automation: synthetic testing, business assertions, observation, guarding, and evidence.",
    location: "Runs beside the automation, with small inline gates only where a risky side effect needs protection.",
    input: "Journey events and business contracts",
    output: "Verified outcome or an isolated incident",
    icon: ShieldCheck,
  },
  {
    id: "probe",
    index: "01",
    title: "Synthetic probe",
    short: "Safely enters the same path as a real customer",
    explanation:
      "The probe lives outside the client workflow. It creates a synthetic enquiry and sends it through the same public entry point a real customer would use.",
    location: "Outside the automation → calls the same form, webhook, API, or trigger.",
    input: "Schedule, deploy event, or manual test",
    output: "Synthetic event + stable replay key",
    icon: Bot,
  },
  {
    id: "contract",
    index: "02",
    title: "Contract engine",
    short: "Defines what must remain true",
    explanation:
      "This service contains the business assertions. It is not checking whether an API key exists. It checks whether the outcome is valid: one owner, two approvals, no false confirmation, stock reserved before dispatch, and so on.",
    location: "A separate Watchdog service evaluates normalized events against client-defined rules.",
    input: "Observed state + business rule",
    output: "Pass / fail assertion",
    icon: Braces,
  },
  {
    id: "observer",
    index: "03",
    title: "Handoff observer",
    short: "Reads state crossing between tools",
    explanation:
      "The observer listens to the boundaries: webhook payloads, automation execution events, selected API responses, logs, or CRM state. It watches the data moving between systems without replacing those systems.",
    location: "Beside integrations → reads the handoff leaving each tool.",
    input: "Website, AI, CRM, routing, ERP, task-system events",
    output: "Expected-vs-actual evidence",
    icon: Eye,
  },
  {
    id: "guard",
    index: "04",
    title: "Guard layer",
    short: "Only this part may sit inline",
    explanation:
      "For sensitive side effects, a tiny gate asks Watchdog whether the prerequisite passed. If not, the payment, message, task, email, or other action stays blocked. Most of Watchdog remains out-of-band.",
    location: "Immediately before selected side effects, not wrapped around every API call.",
    input: "Assertion result + intended side effect",
    output: "Allow or hold",
    icon: LockKeyhole,
  },
  {
    id: "evidence",
    index: "05",
    title: "Evidence + replay store",
    short: "Remembers what happened and where to resume",
    explanation:
      "Watchdog does not rewrite production code. A human or deployment pipeline applies the fix. This module keeps the failed boundary, IDs, evidence, and idempotency key so Watchdog can verify a bounded replay afterward.",
    location: "Separate operational store attached to the Watchdog service.",
    input: "Failure evidence + corrected configuration",
    output: "Replay point + verified recovery",
    icon: DatabaseZap,
  },
] as const;

type StageId = (typeof stages)[number]["id"];
type PartId = Exclude<StageId, "assembled">;

type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  controls: OrbitControls;
  assembly: THREE.Group;
  groups: Record<PartId, THREE.Group>;
  meshes: Record<PartId, THREE.MeshStandardMaterial[]>;
  labels: Record<PartId, HTMLElement>;
  clickable: THREE.Object3D[];
  frame: number;
  resizeObserver: ResizeObserver;
};

const assembledPositions: Record<PartId, [number, number, number]> = {
  probe: [-2.25, 0, 0],
  contract: [-0.65, 0, 0],
  observer: [0, 0, 0],
  guard: [0, 0, 0],
  evidence: [2.15, 0, 0],
};

const explodedPositions: Record<PartId, [number, number, number]> = {
  probe: [-5.5, 0, 0],
  contract: [-2.45, 0, 0],
  observer: [0, 0, 0],
  guard: [2.7, 0, 0],
  evidence: [5.55, 0, 0],
};

function labelElement(index: string, title: string) {
  const element = document.createElement("div");
  element.style.fontFamily = "var(--font-inter), Inter, sans-serif";
  element.style.pointerEvents = "none";
  element.style.userSelect = "none";
  element.style.whiteSpace = "nowrap";
  element.style.padding = "7px 10px";
  element.style.borderRadius = "999px";
  element.style.background = "rgba(255,255,255,.92)";
  element.style.border = "1px solid rgba(17,19,24,.12)";
  element.style.boxShadow = "0 8px 28px rgba(17,19,24,.09)";
  element.style.color = "#1a1d22";
  element.style.fontSize = "12px";
  element.style.fontWeight = "650";
  element.innerHTML = `<span style="color:#8a919b;margin-right:6px;font-family:ui-monospace,monospace">${index}</span>${title}`;
  return element;
}

function material(color: string, emissive = color) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: 0.08,
    metalness: 0.28,
    roughness: 0.3,
    transparent: true,
    opacity: 1,
  });
}

function buildAssembly(scene: THREE.Scene) {
  const assembly = new THREE.Group();
  assembly.rotation.set(-0.08, -0.25, 0.04);
  scene.add(assembly);

  const clickable: THREE.Object3D[] = [];
  const groups = {} as Record<PartId, THREE.Group>;
  const meshes = {} as Record<PartId, THREE.MeshStandardMaterial[]>;
  const labels = {} as Record<PartId, HTMLElement>;

  const register = (
    id: PartId,
    group: THREE.Group,
    mats: THREE.MeshStandardMaterial[],
    title: string,
    index: string,
  ) => {
    group.position.set(...assembledPositions[id]);
    group.userData.partId = id;
    groups[id] = group;
    meshes[id] = mats;

    const labelEl = labelElement(index, title);
    const label = new CSS2DObject(labelEl);
    label.position.set(0, 2.25, 0);
    group.add(label);
    labels[id] = labelEl;

    assembly.add(group);
  };

  // 01 Synthetic probe — input connector.
  {
    const group = new THREE.Group();
    const mats: THREE.MeshStandardMaterial[] = [];

    const bodyMat = material("#dfe6ff", "#6579ff");
    mats.push(bodyMat);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.8, 40), bodyMat);
    body.rotation.z = Math.PI / 2;
    body.userData.partId = "probe";
    group.add(body);
    clickable.push(body);

    const lensMat = material("#6d80ff");
    lensMat.emissiveIntensity = 0.5;
    mats.push(lensMat);
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), lensMat);
    lens.position.x = -1.0;
    lens.userData.partId = "probe";
    group.add(lens);
    clickable.push(lens);

    const collarMat = material("#aebaff");
    mats.push(collarMat);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.07, 18, 64), collarMat);
    collar.rotation.y = Math.PI / 2;
    collar.position.x = 0.72;
    group.add(collar);

    register("probe", group, mats, "Synthetic probe", "01");
  }

  // 02 Contract engine — central logic chip.
  {
    const group = new THREE.Group();
    const mats: THREE.MeshStandardMaterial[] = [];

    const chipMat = material("#e8ddff", "#9d71ed");
    mats.push(chipMat);
    const chip = new THREE.Mesh(new RoundedBoxGeometry(1.9, 1.4, 1.7, 6, 0.18), chipMat);
    chip.userData.partId = "contract";
    group.add(chip);
    clickable.push(chip);

    const faceMat = material("#9d71ed");
    faceMat.emissiveIntensity = 0.28;
    mats.push(faceMat);
    const face = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.85, 0.06, 4, 0.1), faceMat);
    face.position.z = 0.88;
    group.add(face);

    [-0.55, -0.28, 0, 0.28, 0.55].forEach((x) => {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.5), faceMat);
      pin.position.set(x, -0.84, 0);
      group.add(pin);
    });

    register("contract", group, mats, "Contract engine", "02");
  }

  // 03 Observer — sensing rings around the central body.
  {
    const group = new THREE.Group();
    const mats: THREE.MeshStandardMaterial[] = [];

    const ringMat = material("#d7f4fa", "#28b2cf");
    ringMat.emissiveIntensity = 0.28;
    mats.push(ringMat);

    [2.1, 2.42].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 0 ? 0.12 : 0.055, 20, 96),
        ringMat,
      );
      ring.userData.partId = "observer";
      group.add(ring);
      clickable.push(ring);
    });

    const sensorMat = material("#57cce1");
    sensorMat.emissiveIntensity = 0.55;
    mats.push(sensorMat);
    const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.22, 28, 28), sensorMat);
    sensor.position.set(0, 2.42, 0);
    sensor.userData.partId = "observer";
    group.add(sensor);
    clickable.push(sensor);

    register("observer", group, mats, "Handoff observer", "03");
  }

  // 04 Guard — split shell that slides apart like product casing.
  {
    const group = new THREE.Group();
    const mats: THREE.MeshStandardMaterial[] = [];
    const shellMat = material("#fff1cf", "#d79a34");
    shellMat.opacity = 0.92;
    mats.push(shellMat);

    const left = new THREE.Mesh(new RoundedBoxGeometry(1.15, 3.6, 3.5, 8, 0.24), shellMat);
    left.position.x = -0.72;
    left.userData.partId = "guard";
    group.add(left);
    clickable.push(left);

    const right = new THREE.Mesh(new RoundedBoxGeometry(1.15, 3.6, 3.5, 8, 0.24), shellMat);
    right.position.x = 0.72;
    right.userData.partId = "guard";
    group.add(right);
    clickable.push(right);

    const seamMat = material("#e5b45b");
    mats.push(seamMat);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.0, 3.0), seamMat);
    group.add(seam);

    register("guard", group, mats, "Guard layer", "04");
  }

  // 05 Evidence — removable cartridge.
  {
    const group = new THREE.Group();
    const mats: THREE.MeshStandardMaterial[] = [];

    const cartMat = material("#daf6e8", "#31b978");
    mats.push(cartMat);
    const cart = new THREE.Mesh(new RoundedBoxGeometry(1.55, 2.25, 1.9, 6, 0.2), cartMat);
    cart.userData.partId = "evidence";
    group.add(cart);
    clickable.push(cart);

    const railMat = material("#57ca91");
    railMat.emissiveIntensity = 0.22;
    mats.push(railMat);
    [-0.52, 0, 0.52].forEach((y) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 1.25), railMat);
      rail.position.set(0.8, y, 0);
      group.add(rail);
    });

    register("evidence", group, mats, "Evidence + replay", "05");
  }

  return { assembly, groups, meshes, labels, clickable };
}

export function WatchdogArchitecture3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const [stageIndex, setStageIndex] = useState(0);

  const active = stages[stageIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f3f4f6");

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(9.5, 6.1, 12.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
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
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 19;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.HemisphereLight("#ffffff", "#cfd3da", 2.2));

    const key = new THREE.DirectionalLight("#ffffff", 3.2);
    key.position.set(4, 8, 7);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight("#dce4ff", 1.6);
    fill.position.set(-7, 3, 5);
    scene.add(fill);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8.8, 80),
      new THREE.ShadowMaterial({ color: "#111318", opacity: 0.1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.55;
    floor.receiveShadow = true;
    scene.add(floor);

    const built = buildAssembly(scene);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const hitTest = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(built.clickable, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      renderer.domElement.style.cursor = hitTest(event).length ? "pointer" : "grab";
    };

    const onClick = (event: PointerEvent) => {
      const hit = hitTest(event)[0];
      const id = hit?.object.userData.partId as PartId | undefined;
      if (!id) return;
      const next = stages.findIndex((item) => item.id === id);
      if (next >= 0) setStageIndex(next);
    };

    let wheelLock = false;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (wheelLock || Math.abs(event.deltaY) < 8) return;
      wheelLock = true;
      setStageIndex((current) => {
        if (event.deltaY > 0) return Math.min(stages.length - 1, current + 1);
        return Math.max(0, current - 1);
      });
      window.setTimeout(() => {
        wheelLock = false;
      }, 360);
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.fov = width < 760 ? 45 : 36;
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
      assembly: built.assembly,
      groups: built.groups,
      meshes: built.meshes,
      labels: built.labels,
      clickable: built.clickable,
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
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
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

    const activePart = active.id === "assembled" ? null : (active.id as PartId);
    const exploded = stageIndex > 0;

    (Object.keys(state.groups) as PartId[]).forEach((id) => {
      const group = state.groups[id];
      const target = exploded ? explodedPositions[id] : assembledPositions[id];
      const selected = activePart === id;

      animate(group, {
        x: target[0],
        y: target[1] + (selected ? 0.18 : 0),
        z: target[2] + (selected ? 0.7 : 0),
        scale: selected ? 1.12 : 1,
        duration: 720,
        ease: "out(4)",
      });

      state.labels[id].style.opacity = exploded ? "1" : "0";

      state.meshes[id].forEach((m) => {
        m.opacity = activePart && !selected ? 0.28 : 1;
        m.emissiveIntensity = selected ? 0.38 : 0.08;
      });
    });

    animate(state.assembly, {
      rotateY: stageIndex === 0 ? -14 : -7,
      duration: 760,
      ease: "out(4)",
    });
  }, [active.id, stageIndex]);

  const resetView = () => {
    const state = sceneRef.current;
    if (!state) return;
    state.camera.position.set(9.5, 6.1, 12.4);
    state.controls.target.set(0, 0, 0);
    state.controls.update();
    setStageIndex(0);
  };

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-[#f6f6f4] text-[#111318]">
      <div className="mx-auto max-w-[1540px] px-4 py-4 md:px-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/recovery"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe2e6] bg-white text-[#59616b] transition hover:bg-[#f0f1f2]"
              aria-label="Back to recovery"
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <p className="text-[14px] font-semibold text-[#6670e8]">Exploded product view</p>
              <h1 className="mt-0.5 text-[30px] font-semibold tracking-[-0.05em] md:text-[38px]">
                Deconstruct Watchdog, one module at a time.
              </h1>
            </div>
          </div>

          <button
            onClick={resetView}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe2e6] bg-white px-3.5 text-[14px] font-semibold text-[#555e69] transition hover:bg-[#f0f1f2]"
          >
            <RotateCcw size={15} />
            Reset assembly
          </button>
        </div>

        <div className="grid h-[calc(100dvh-145px)] min-h-[520px] max-h-[790px] gap-4 xl:grid-cols-[1.3fr_.7fr]">
          <section className="relative overflow-hidden rounded-[28px] border border-[#dedfe2] bg-[#f3f4f6] shadow-[0_28px_90px_rgba(17,19,24,.06)]">
            <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/85 px-3 py-2 text-[13px] font-medium text-[#626a75] shadow-sm backdrop-blur">
                <MousePointer2 size={13} />
                Drag to inspect
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/85 px-3 py-2 text-[13px] font-medium text-[#626a75] shadow-sm backdrop-blur">
                <GitBranch size={13} />
                Scroll here to deconstruct
              </span>
            </div>

            <div ref={mountRef} className="absolute inset-0" />

            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="rounded-[18px] border border-black/8 bg-white/90 p-3 shadow-[0_10px_32px_rgba(17,19,24,.08)] backdrop-blur">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
                  {stages.map((stage, index) => (
                    <button
                      key={stage.id}
                      onClick={() => setStageIndex(index)}
                      className={
                        index === stageIndex
                          ? "inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-[#111318] px-3 text-[13px] font-semibold text-white"
                          : "inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-semibold text-[#747c86] transition hover:bg-[#f0f1f2] hover:text-[#23272d]"
                      }
                    >
                      <span className="font-mono text-[11px] opacity-60">{stage.index}</span>
                      {stage.id === "assembled" ? "Assembled" : stage.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col overflow-y-auto rounded-[28px] border border-[#dedfe2] bg-white p-5 shadow-[0_18px_50px_rgba(17,19,24,.045)] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-[#9097a1]">
                  {active.index === "00" ? "Start here" : `Module ${active.index} of 05`}
                </p>
                <h2 className="mt-2 text-[29px] font-semibold tracking-[-0.045em] text-[#111318]">{active.title}</h2>
                <p className="mt-1 text-[15px] font-medium text-[#747c86]">{active.short}</p>
              </div>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f1f4] text-[#5e6874]">
                <ActiveIcon size={20} />
              </span>
            </div>

            <p className="mt-5 text-[16px] leading-7 text-[#535b66]">{active.explanation}</p>

            <div className="mt-5 rounded-[18px] bg-[#f6f7f8] p-4">
              <p className="text-[13px] font-semibold text-[#8a929c]">Where it actually sits</p>
              <p className="mt-2 text-[15px] font-semibold leading-6 text-[#2f353c]">{active.location}</p>
            </div>

            <div className="mt-3 grid gap-3">
              <div className="rounded-[18px] border border-[#e3e5e8] p-4">
                <p className="text-[13px] font-medium text-[#949ba4]">Receives</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#343a42]">{active.input}</p>
              </div>
              <div className="rounded-[18px] border border-[#e3e5e8] p-4">
                <p className="text-[13px] font-medium text-[#949ba4]">Produces</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#343a42]">{active.output}</p>
              </div>
            </div>

            {stageIndex < stages.length - 1 ? (
              <button
                onClick={() => setStageIndex((value) => Math.min(stages.length - 1, value + 1))}
                className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111318] px-4 text-[14px] font-semibold text-white transition hover:bg-[#292d33]"
              >
                {stageIndex === 0 ? "Start the breakdown" : "Next module"}
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="mt-auto rounded-[18px] border border-[#d9dcff] bg-[#f2f3ff] p-4">
                <div className="flex items-center gap-2 text-[#5865d8]">
                  <Sparkles size={15} />
                  <p className="text-[14px] font-semibold">Now apply the pattern elsewhere</p>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[#646b96]">
                  See the same control-plane pattern around finance, onboarding, fulfilment, and other mimicked automations.
                </p>
                <Link
                  href="/use-cases"
                  className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-[#313a9f]"
                >
                  Open Watchdog use cases
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
