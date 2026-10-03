"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bot,
  Boxes,
  Check,
  CircleDot,
  Database,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  MailCheck,
  PackageCheck,
  ReceiptText,
  Route,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserCheck,
  Workflow,
  X,
} from "lucide-react";

const cases = [
  {
    id: "lead",
    label: "Lead routing",
    eyebrow: "Sales automation",
    headline: "Catch the lead that technically exists but nobody owns.",
    description: "Watchdog verifies qualification, CRM creation, routing, notification and follow-up as one business journey.",
    accent: "#5865ff",
    failure: "owner_id = null",
    assertion: "Every qualified Birmingham lead has exactly one owner before team actions run.",
    impact: "Prevents silent lead loss and orphan tasks.",
    steps: [
      { label: "Website", icon: Workflow },
      { label: "AI qualify", icon: Bot },
      { label: "CRM", icon: Database },
      { label: "Route owner", icon: Route, failure: true },
      { label: "Notify", icon: MailCheck, guarded: true },
    ],
  },
  {
    id: "invoice",
    label: "Invoice approval",
    eyebrow: "Finance automation",
    headline: "Stop a payment flow when the approval chain is bypassed.",
    description: "Watchdog can verify extracted invoice values, approval thresholds, ERP state and payment eligibility before money moves.",
    accent: "#d49735",
    failure: "approval_count = 1",
    assertion: "Invoices above £25k require two approvals before payment can be created.",
    impact: "Prevents unauthorized or prematurely released payments.",
    steps: [
      { label: "Invoice", icon: ReceiptText },
      { label: "AI extract", icon: Bot },
      { label: "ERP", icon: Database },
      { label: "Approvals", icon: UserCheck, failure: true },
      { label: "Payment", icon: Banknote, guarded: true },
    ],
  },
  {
    id: "onboarding",
    label: "Customer onboarding",
    eyebrow: "Risk + operations",
    headline: "Block account activation when verification state is incomplete.",
    description: "Watchdog follows signup through identity checks, risk decisions, account provisioning and welcome communications.",
    accent: "#27a874",
    failure: "kyc_status = pending",
    assertion: "No account is activated while identity verification is unresolved.",
    impact: "Prevents unverified users entering downstream systems as active customers.",
    steps: [
      { label: "Signup", icon: Fingerprint },
      { label: "KYC", icon: BadgeCheck, failure: true },
      { label: "Risk", icon: FileCheck2 },
      { label: "Account", icon: Database, guarded: true },
      { label: "Welcome", icon: MailCheck, guarded: true },
    ],
  },
  {
    id: "fulfilment",
    label: "Order fulfilment",
    eyebrow: "Commerce operations",
    headline: "Catch inventory state that would create a false fulfilment promise.",
    description: "Watchdog checks order creation, inventory reservation, fulfilment assignment and customer messaging across tools.",
    accent: "#b75f9d",
    failure: "reserved_qty = 0",
    assertion: "Customer dispatch confirmation only runs after stock is successfully reserved.",
    impact: "Prevents false shipping promises and downstream support incidents.",
    steps: [
      { label: "Order", icon: ShoppingCart },
      { label: "Inventory", icon: Boxes, failure: true },
      { label: "Fulfilment", icon: PackageCheck, guarded: true },
      { label: "CRM", icon: Database, guarded: true },
      { label: "Customer", icon: MailCheck, guarded: true },
    ],
  },
] as const;

type CaseId = (typeof cases)[number]["id"];

export function WatchdogUseCases() {
  const [activeId, setActiveId] = useState<CaseId>("lead");
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(-1);
  const shellRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => cases.find((item) => item.id === activeId) ?? cases[0], [activeId]);

  useEffect(() => {
    setPosition(-1);
    const cards = shellRef.current?.querySelectorAll(".use-case-card");
    if (cards?.length) {
      animate(cards, {
        translateY: [8, 0],
        opacity: [0.6, 1],
        delay: stagger(70),
        duration: 480,
        ease: "out(4)",
      });
    }
  }, [activeId]);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    setPosition(-1);

    for (let index = 0; index < active.steps.length; index += 1) {
      setPosition(index);
      const node = shellRef.current?.querySelector(`[data-flow-node="${index}"]`);
      if (node) {
        animate(node, {
          scale: [0.95, 1.045, 1],
          duration: 520,
          ease: "out(4)",
        });
      }
      await new Promise((resolve) => window.setTimeout(resolve, index === active.steps.findIndex((step) => "failure" in step && step.failure) ? 900 : 620));
    }

    setPlaying(false);
  };

  return (
    <div ref={shellRef} className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 md:py-10">
      <section className="grid gap-7 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
        <div>
          <p className="text-[16px] font-semibold text-[var(--blue)]">Beyond one workflow</p>
          <h1 className="mt-3 max-w-[790px] text-[42px] font-semibold leading-[1.02] tracking-[-0.06em] md:text-[56px]">
            Watchdog is a pattern for any automation where the business outcome matters more than a green API.
          </h1>
        </div>
        <p className="max-w-[620px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          Pick a workflow below. Each one uses the same operating model: observe handoffs, assert the business contract, stop unsafe side effects, capture evidence, then replay from the failed boundary.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cases.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={
                selected
                  ? "use-case-card relative min-h-[182px] overflow-hidden rounded-[24px] border border-[#cfd4ff] bg-white p-5 text-left shadow-[0_18px_55px_rgba(79,92,255,.10)]"
                  : "use-case-card relative min-h-[182px] overflow-hidden rounded-[24px] border border-[var(--hairline)] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#cfd4dc] hover:shadow-[0_14px_38px_rgba(17,19,24,.06)]"
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-semibold text-[#8a929d]">0{index + 1}</span>
                <span className={selected ? "h-2.5 w-2.5 rounded-full bg-[#5865ff]" : "h-2.5 w-2.5 rounded-full bg-[#d7dbe0]"} />
              </div>
              <p className="mt-7 text-[14px] font-semibold text-[#858d98]">{item.eyebrow}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[var(--ink)]">{item.label}</p>
              <p className="mt-3 text-[15px] leading-6 text-[var(--copy)]">{item.impact}</p>
            </button>
          );
        })}
      </section>

      <section className="mt-5 overflow-hidden rounded-[30px] bg-[#111318] text-white shadow-[0_32px_105px_rgba(17,19,24,.16)]">
        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-[14px] font-semibold text-white/58">
              <Sparkles size={15} style={{ color: active.accent }} />
              {active.eyebrow}
            </div>
            <h2 className="mt-6 text-[32px] font-semibold leading-[1.08] tracking-[-0.05em] md:text-[40px]">{active.headline}</h2>
            <p className="mt-4 text-[17px] leading-8 text-white/58">{active.description}</p>

            <div className="mt-7 rounded-[20px] border border-white/10 bg-white/[.035] p-5">
              <p className="text-[14px] font-medium text-white/35">Business contract</p>
              <p className="mt-2 text-[17px] font-semibold leading-7 text-white/82">{active.assertion}</p>
            </div>

            <button
              onClick={play}
              disabled={playing}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-[#111318] transition hover:bg-[#eef0f3] disabled:opacity-60"
            >
              {playing ? <CircleDot size={16} className="animate-pulse" /> : <Workflow size={17} />}
              {playing ? "Running mimicked automation" : "Run this automation"}
            </button>
          </div>

          <div className="relative min-h-[470px] overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(88,101,255,.15),transparent_32%)]" />
            <div className="relative flex min-h-[410px] flex-col justify-center">
              <div className="relative grid gap-3 md:grid-cols-5">
                <div className="pointer-events-none absolute left-[8%] right-[8%] top-[42px] hidden h-px bg-white/10 md:block" />
                {active.steps.map((step, index) => {
                  const Icon = step.icon;
                  const failure = "failure" in step && step.failure && position >= index;
                  const guarded = "guarded" in step && step.guarded && position >= index;
                  const visited = position >= index;
                  const selected = position === index;

                  return (
                    <div
                      key={step.label}
                      data-flow-node={index}
                      className={
                        failure
                          ? "relative z-10 rounded-[20px] border border-[#d94b63]/50 bg-[#d94b63]/10 p-4"
                          : guarded
                            ? "relative z-10 rounded-[20px] border border-[#d5a447]/30 bg-[#d5a447]/[.07] p-4"
                            : selected
                              ? "relative z-10 rounded-[20px] border border-[#8d98ff]/55 bg-[#5865ff]/14 p-4"
                              : visited
                                ? "relative z-10 rounded-[20px] border border-[#44c989]/22 bg-[#44c989]/[.05] p-4"
                                : "relative z-10 rounded-[20px] border border-white/10 bg-[#171a21] p-4"
                      }
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07] text-white/72">
                        <Icon size={18} />
                      </span>
                      <p className="mt-6 text-[16px] font-semibold">{step.label}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {failure ? <X size={15} className="text-[#ff8da0]" /> : guarded ? <LockKeyhole size={14} className="text-[#e7b768]" /> : visited ? <Check size={15} className="text-[#65dda8]" /> : <span className="h-2 w-2 rounded-full bg-white/15" />}
                        <span className={
                          failure
                            ? "text-[14px] font-medium text-[#ff8da0]"
                            : guarded
                              ? "text-[14px] font-medium text-[#e7b768]"
                              : visited
                                ? "text-[14px] font-medium text-[#65dda8]"
                                : "text-[14px] text-white/32"
                        }>
                          {failure ? "Contract failed" : guarded ? "Guarded" : visited ? "Passed" : "Waiting"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {position >= 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-[#d94b63]/30 bg-[#d94b63]/[.07] p-5">
                    <p className="text-[14px] font-medium text-white/38">Failure evidence</p>
                    <p className="mt-2 font-mono text-[16px] font-semibold text-[#ff92a4]">{active.failure}</p>
                  </div>
                  <div className="rounded-[20px] border border-[#55d99b]/22 bg-[#55d99b]/[.055] p-5">
                    <div className="flex items-center gap-2 text-[#6de1aa]">
                      <ShieldCheck size={16} />
                      <p className="text-[14px] font-semibold">Watchdog response</p>
                    </div>
                    <p className="mt-2 text-[15px] leading-6 text-white/58">{active.impact}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 text-center text-[15px] text-white/35">Run the mimicked automation to watch the contract fail and the guard layer react.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
