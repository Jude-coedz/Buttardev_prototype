"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import {
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  Database,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  MessageSquare,
  Route,
  TriangleAlert,
  UserRoundCheck,
} from "lucide-react";

type StepState = "waiting" | "active" | "passed" | "failed" | "blocked";

const steps = [
  {
    id: "website",
    title: "Website enquiry",
    tool: "BrightHome form",
    detail: "Synthetic enquiry accepted",
    icon: Globe2,
  },
  {
    id: "qualify",
    title: "AI qualification",
    tool: "Qualifier AI",
    detail: "4 required details captured",
    icon: Bot,
  },
  {
    id: "crm",
    title: "Create CRM lead",
    tool: "FlowCRM",
    detail: "Record created once",
    icon: Database,
  },
  {
    id: "owner",
    title: "Assign an owner",
    tool: "Routing v4",
    detail: "Birmingham team expected",
    icon: Route,
  },
  {
    id: "alert",
    title: "Notify the team",
    tool: "Team chat",
    detail: "Requires a valid owner",
    icon: MessageSquare,
  },
  {
    id: "followup",
    title: "Create follow-up",
    tool: "CRM task",
    detail: "Requires a valid owner",
    icon: UserRoundCheck,
  },
] as const;

export function AutomationRun() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [states, setStates] = useState<StepState[]>(Array(6).fill("waiting"));
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const setStep = (index: number, state: StepState) => {
    setStates((previous) => previous.map((item, itemIndex) => (itemIndex === index ? state : item)));

    window.setTimeout(() => {
      const element = containerRef.current?.querySelector(`[data-node="${index}"]`);
      if (element) {
        animate(element, {
          scale: [0.985, 1.025, 1],
          opacity: [0.76, 1],
          duration: 520,
          ease: "out(4)",
        });
      }

      const connector = containerRef.current?.querySelector(`[data-connector="${index}"]`);
      if (connector && state === "passed") {
        animate(connector, {
          scaleX: [0, 1],
          opacity: [0.2, 1],
          duration: 420,
          ease: "out(3)",
        });
      }
    }, 0);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setFinished(false);
    setStates(Array(6).fill("waiting"));

    await fetch("/api/watchdog/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: "degraded" }),
    });

    for (let index = 0; index < 4; index += 1) {
      setStep(index, "active");
      await new Promise((resolve) => window.setTimeout(resolve, index === 1 ? 900 : 620));

      if (index < 3) {
        setStep(index, "passed");
      } else {
        setStep(index, "failed");
      }
    }

    setStep(4, "blocked");
    setStep(5, "blocked");
    setRunning(false);
    setFinished(true);
  };

  return (
    <div ref={containerRef}>
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[15px] font-semibold text-[var(--blue)]">Step 2 · Automation</p>
            <h1 className="mt-4 max-w-[760px] text-[46px] font-semibold leading-[1.02] tracking-[-0.06em] text-[var(--ink)] md:text-[62px]">
              The enquiry is now inside the workflow.
            </h1>
          </div>
          <div className="max-w-[610px] lg:justify-self-end">
            <p className="text-[18px] leading-8 text-[var(--copy)]">
              This is the automation ButtarDev could ship for a service business. Every handoff looks normal until one quiet routing rule stops producing the state the next tools depend on.
            </p>
            <button
              onClick={run}
              disabled={running}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35] disabled:cursor-wait disabled:opacity-65"
            >
              {running ? <LoaderCircle size={17} className="animate-spin" /> : <CircleDot size={17} />}
              {running ? "Running the automation" : finished ? "Run it again" : "Run the automation"}
            </button>
          </div>
        </div>

        <section className="mt-14 overflow-hidden rounded-[28px] border border-[var(--hairline)] bg-white shadow-[0_28px_90px_rgba(17,19,24,.06)]">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] px-6 py-4 md:px-7">
            <div>
              <p className="text-[15px] font-semibold text-[var(--ink)]">Residential enquiry · WD-1842</p>
              <p className="mt-1 text-[14px] text-[var(--muted)]">watchdog+1842@demo.local · B15 2TT</p>
            </div>
            <span className="hidden rounded-full bg-[var(--blue-soft)] px-3 py-1.5 text-[13px] font-semibold text-[var(--blue-deep)] sm:inline-flex">
              Synthetic test lead
            </span>
          </div>

          <div className="relative p-5 md:p-7">
            <div className="grid gap-4 lg:grid-cols-6 lg:gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const state = states[index];

                return (
                  <div key={step.id} className="relative min-w-0">
                    <div
                      data-node={index}
                      data-state={state}
                      className="flow-node relative z-10 h-full min-h-[205px] rounded-[20px] border border-[var(--hairline)] bg-white p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={
                            state === "failed"
                              ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rose-soft)] text-[var(--rose)]"
                              : state === "passed"
                                ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]"
                                : state === "active"
                                  ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--blue-soft)] text-[var(--blue)]"
                                  : "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f2f4] text-[#77808d]"
                          }
                        >
                          <Icon size={18} />
                        </span>

                        {state === "passed" ? (
                          <Check size={17} className="text-[var(--green)]" />
                        ) : state === "failed" ? (
                          <TriangleAlert size={17} className="text-[var(--rose)]" />
                        ) : state === "blocked" ? (
                          <LockKeyhole size={16} className="text-[#858d98]" />
                        ) : state === "active" ? (
                          <LoaderCircle size={17} className="animate-spin text-[var(--blue)]" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-[#d8dce1]" />
                        )}
                      </div>

                      <p className="mt-8 text-[17px] font-semibold tracking-[-0.025em] text-[var(--ink)]">{step.title}</p>
                      <p className="mt-1 text-[14px] font-medium text-[var(--muted)]">{step.tool}</p>
                      <p className="mt-4 text-[14px] leading-6 text-[var(--copy)]">
                        {state === "failed"
                          ? "Routing returned no owner."
                          : state === "blocked"
                            ? "Did not run."
                            : step.detail}
                      </p>

                      <p className="absolute bottom-4 left-5 font-mono text-[13px] text-[#9aa1aa]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    {index < steps.length - 1 ? (
                      <span className="pointer-events-none absolute -right-3 top-[50%] z-20 hidden h-px w-3 origin-left bg-[#d9dde3] lg:block">
                        <span
                          data-connector={index}
                          className={
                            states[index] === "passed"
                              ? "block h-full origin-left bg-[var(--blue)]"
                              : "block h-full origin-left bg-transparent"
                          }
                        />
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {finished ? (
              <div className="mt-6 grid gap-5 rounded-[22px] border border-[#f2c7cf] bg-[#fff8f9] p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--rose-soft)] text-[var(--rose)]">
                    <TriangleAlert size={20} />
                  </span>
                  <div>
                    <p className="text-[18px] font-semibold tracking-[-0.025em] text-[var(--ink)]">
                      The workflow stopped at owner assignment.
                    </p>
                    <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[var(--copy)]">
                      The form worked. The AI worked. The CRM created the lead. There is no platform outage. The next question is what the CRM actually received.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/crm?run=WD-1842")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35]"
                >
                  Open the CRM record
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
