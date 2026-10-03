"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate, stagger } from "animejs";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Database,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Route,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { JourneyRun } from "@/lib/watchdog-engine";

export function RecoveryReplay() {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<JourneyRun | null>(null);

  const recover = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);

    const mapping = shellRef.current?.querySelector(".mapping-after");
    if (mapping) {
      animate(mapping, {
        opacity: [0.45, 1],
        scale: [0.985, 1.025, 1],
        duration: 620,
        ease: "out(4)",
      });
    }

    const response = await fetch("/api/watchdog/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: "healthy" }),
    });
    const run = (await response.json()) as JourneyRun;

    const replayItems = shellRef.current?.querySelectorAll(".replay-step");
    if (replayItems?.length) {
      animate(replayItems, {
        opacity: [0.35, 1],
        translateY: [8, 0],
        delay: stagger(280),
        duration: 520,
        ease: "out(4)",
      });
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    setResult(run);
    setRunning(false);
  };

  return (
    <div ref={shellRef} className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[15px] font-semibold text-[var(--blue)]">Step 5 · Recovery</p>
          <h1 className="mt-4 max-w-[760px] text-[46px] font-semibold leading-[1.02] tracking-[-0.06em] md:text-[62px]">
            Fix the boundary. Don’t replay the whole world.
          </h1>
        </div>
        <p className="max-w-[590px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          The CRM lead already exists. Recovery should repair the owner mapping, reuse that same synthetic record, and resume only the work that was safely blocked.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[.86fr_1.14fr]">
        <section className="rounded-[28px] border border-[var(--hairline)] bg-white p-6 shadow-[0_24px_70px_rgba(17,19,24,.05)] md:p-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f1f3] text-[#636c78]">
              <Code2 size={18} />
            </span>
            <div>
              <p className="text-[17px] font-semibold">Routing mapping</p>
              <p className="mt-0.5 text-[14px] text-[var(--muted)]">routing-v4</p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <div className="rounded-2xl border border-[#f0c2cb] bg-[#fff6f8] p-5">
              <p className="text-[14px] font-medium text-[#9f6270]">Before</p>
              <div className="mt-3 font-mono text-[14px] leading-7 text-[#6e4650]">
                source.<span className="font-semibold text-[var(--rose)]">assignee_id</span><br />
                → owner_id
              </div>
            </div>

            <div className="mapping-after rounded-2xl border border-[#bfe2cf] bg-[#f2fbf6] p-5">
              <p className="text-[14px] font-medium text-[#4d8467]">After</p>
              <div className="mt-3 font-mono text-[14px] leading-7 text-[#315d46]">
                source.<span className="font-semibold text-[var(--green)]">owner_id</span><br />
                → owner_id
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#f5f6f7] p-4">
            <p className="text-[14px] font-medium text-[var(--copy)]">Replay boundary</p>
            <p className="mt-1 font-mono text-[13px] leading-6 text-[#777f8a]">
              crm_demo_1842 · same idempotency key
            </p>
          </div>

          <button
            onClick={recover}
            disabled={running || Boolean(result)}
            className={
              result
                ? "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-5 text-[15px] font-semibold text-white"
                : "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35] disabled:cursor-wait disabled:opacity-65"
            }
          >
            {running ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Replaying from routing
              </>
            ) : result ? (
              <>
                <CheckCircle2 size={17} />
                Recovery verified
              </>
            ) : (
              <>
                <RefreshCw size={17} />
                Apply fix and replay
              </>
            )}
          </button>
        </section>

        <section className="rounded-[28px] border border-[var(--hairline)] bg-[#111318] p-6 text-white shadow-[0_28px_90px_rgba(17,19,24,.12)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[17px] font-semibold">Replay trace</p>
              <p className="mt-1 text-[14px] text-white/45">Resume from the first failed boundary</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-[13px] font-medium text-white/60">
              <Database size={14} />
              CRM record reused
            </span>
          </div>

          <div className="mt-8 grid gap-3">
            {[
              [Route, "Owner routing", result ? "Saim · Birmingham" : running ? "Re-evaluating mapping…" : "Waiting for replay"],
              [MessageSquare, "Team notification", result ? "#birmingham-leads notified" : running ? "Held until owner passes" : "Protected"],
              [UserRoundCheck, "Follow-up task", result ? "Assigned to Saim · due in 5 min" : running ? "Held until owner passes" : "Protected"],
            ].map(([Icon, title, detail], index) => {
              const StepIcon = Icon as typeof Route;
              const passed = Boolean(result);

              return (
                <div
                  key={String(title)}
                  className={
                    passed
                      ? "replay-step grid gap-4 rounded-[20px] border border-[#48ce8e]/25 bg-[#48ce8e]/[.06] p-5 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                      : "replay-step grid gap-4 rounded-[20px] border border-white/10 bg-white/[.035] p-5 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                  }
                >
                  <span className={
                    passed
                      ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#174330] text-[#63dfa9]"
                      : "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[.07] text-white/55"
                  }>
                    <StepIcon size={18} />
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold">{String(title)}</p>
                    <p className={passed ? "mt-1 text-[14px] text-[#82e6b8]" : "mt-1 text-[14px] text-white/40"}>{String(detail)}</p>
                  </div>
                  <span className="justify-self-start sm:justify-self-end">
                    {passed ? (
                      <Check size={18} className="text-[#63dfa9]" />
                    ) : running && index === 0 ? (
                      <LoaderCircle size={18} className="animate-spin text-[#8f98ff]" />
                    ) : (
                      <ShieldCheck size={18} className="text-white/25" />
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {result ? (
            <div className="mt-6 rounded-[22px] border border-[#48ce8e]/30 bg-[#48ce8e]/[.075] p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16855b] text-white">
                  <CheckCircle2 size={20} />
                </span>
                <div>
                  <p className="text-[19px] font-semibold tracking-[-0.025em]">The same journey now passes end to end.</p>
                  <p className="mt-2 text-[15px] leading-7 text-white/55">
                    No duplicate lead was created. The original synthetic CRM record gained the missing owner, then the two guarded actions were allowed to continue.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {result ? (
        <div className="mt-7 flex flex-col gap-4 rounded-[24px] border border-[var(--hairline)] bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-[17px] font-semibold">That is the full operating loop.</p>
            <p className="mt-1 text-[15px] leading-6 text-[var(--copy)]">
              Next, pull Watchdog apart in a live 3D model and inspect how the layers interact.
            </p>
          </div>
          <button
            onClick={() => router.push("/architecture")}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 text-[15px] font-semibold text-white transition hover:bg-[var(--blue-deep)]"
          >
            Open 3D architecture
            <ArrowRight size={17} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
