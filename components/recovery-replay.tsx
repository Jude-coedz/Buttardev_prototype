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
  GitBranch,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Wrench,
} from "lucide-react";
import type { JourneyRun } from "@/lib/watchdog-engine";

export function RecoveryReplay() {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<JourneyRun | null>(null);

  const applyFix = () => {
    setFixed(true);
    window.setTimeout(() => {
      const mapping = shellRef.current?.querySelector(".mapping-fixed");
      if (mapping) {
        animate(mapping, {
          opacity: [0.25, 1],
          translateX: [12, 0],
          scale: [0.985, 1.015, 1],
          duration: 620,
          ease: "out(4)",
        });
      }
    }, 0);
  };

  const replay = async () => {
    if (!fixed || running) return;
    setRunning(true);
    setResult(null);

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
        delay: stagger(420),
        duration: 560,
        ease: "out(4)",
      });
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1800));
    setResult(run);
    setRunning(false);
  };

  return (
    <div ref={shellRef} className="mx-auto max-w-[1420px] px-5 py-7 md:px-8 md:py-9">
      <section className="grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[16px] font-semibold text-[var(--blue)]">Step 5 · Recovery</p>
          <h1 className="mt-3 max-w-[760px] text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[52px]">
            Watchdog tells you where to recover. It does not blindly rerun everything.
          </h1>
        </div>
        <p className="max-w-[640px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          The CRM record is already valid. The fault lives in the routing adapter between FlowCRM and the downstream actions, so that is where the operator applies the fix and where Watchdog resumes verification.
        </p>
      </section>

      <section className="mt-7 rounded-[26px] border border-[#dfe2ff] bg-[#f5f6ff] p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#5665ff] text-white">
                <ShieldCheck size={19} />
              </span>
              <div>
                <p className="text-[17px] font-semibold text-[#252d8f]">Watchdog recovery recommendation</p>
                <p className="mt-1 text-[15px] text-[#6670a5]">Boundary: FlowCRM → routing-v4</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Do not recreate", "CRM lead", "crm_demo_1842 already exists"],
              ["Fix here", "Routing adapter", "owner field mapping is wrong"],
              ["Resume here", "Owner assignment", "then unlock guarded actions"],
            ].map(([eyebrow, title, body]) => (
              <div key={title} className="rounded-[18px] border border-[#daddff] bg-white/80 p-4">
                <p className="text-[13px] font-semibold text-[#7a82b3]">{eyebrow}</p>
                <p className="mt-1 text-[16px] font-semibold text-[#2b337e]">{title}</p>
                <p className="mt-2 text-[14px] leading-5 text-[#68719c]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.92fr_1.08fr]">
        <section className="rounded-[28px] border border-[var(--hairline)] bg-white p-5 shadow-[0_24px_70px_rgba(17,19,24,.05)] md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f1f3] text-[#636c78]">
                <Code2 size={18} />
              </span>
              <div>
                <p className="text-[18px] font-semibold">Routing adapter</p>
                <p className="mt-0.5 text-[15px] text-[var(--muted)]">routing-v4 / field mapper</p>
              </div>
            </div>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1.5 font-mono text-[13px] text-[#727b86]">operator-owned change</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-[20px] border border-[#e0e4e8] bg-[#101319] text-white">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b78]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f4bf55]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#53c989]" />
              </div>
              <span className="font-mono text-[12px] text-white/35">routing-v4.ts</span>
            </div>

            <div className="p-5 font-mono text-[14px] leading-7 md:text-[15px]">
              <p className="text-white/35">{"// map qualified CRM lead to regional owner"}</p>
              <p className="mt-3 text-white/78">const owner = source.</p>
              {!fixed ? (
                <div className="mt-1 rounded-lg bg-[#d94b63]/12 px-3 py-2 text-[#ff91a3]">
                  <span className="mr-3 select-none text-white/20">-</span>assignee_id
                </div>
              ) : (
                <div className="mapping-fixed mt-1 rounded-lg bg-[#48ce8e]/12 px-3 py-2 text-[#77e5b4]">
                  <span className="mr-3 select-none text-white/20">+</span>owner_id
                </div>
              )}
              <p className="mt-1 text-white/78">return owner;</p>
            </div>
          </div>

          <div className="mt-5 rounded-[18px] bg-[#f6f7f8] p-4">
            <div className="flex items-start gap-3">
              <Wrench size={18} className="mt-0.5 shrink-0 text-[#59626e]" />
              <div>
                <p className="text-[16px] font-semibold text-[#2f353d]">What Watchdog does here</p>
                <p className="mt-1 text-[15px] leading-6 text-[#626b76]">It identifies the failing boundary and provides evidence. The operator or deployment pipeline applies the routing fix. Watchdog then verifies the recovery.</p>
              </div>
            </div>
          </div>

          <button
            onClick={applyFix}
            disabled={fixed}
            className={
              fixed
                ? "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-5 text-[15px] font-semibold text-white"
                : "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35]"
            }
          >
            {fixed ? <CheckCircle2 size={17} /> : <GitBranch size={17} />}
            {fixed ? "Routing mapping corrected" : "Apply routing fix"}
          </button>
        </section>

        <section className="rounded-[28px] border border-[var(--hairline)] bg-[#111318] p-5 text-white shadow-[0_28px_90px_rgba(17,19,24,.12)] md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[18px] font-semibold">Bounded replay</p>
              <p className="mt-1 text-[15px] text-white/48">Resume after the last known-good state, not from the website.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-[14px] font-medium text-white/65">
              <Database size={15} />
              Reuse crm_demo_1842
            </span>
          </div>

          <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[.03] p-4">
            <div className="flex items-center gap-3 text-[15px] text-white/58">
              <Check size={16} className="text-[#63dfa9]" />
              Website, AI and CRM stay untouched
            </div>
            <div className="my-3 ml-2 h-5 w-px bg-white/12" />
            <div className="flex items-center gap-3 text-[16px] font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#5865ff]/15 text-[#9aa4ff]">
                <Route size={16} />
              </span>
              Replay begins at owner routing
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              [Route, "Owner routing", result ? "Saim · Birmingham" : running ? "Re-checking corrected mapping…" : fixed ? "Ready to replay" : "Waiting for fix"],
              [MessageSquare, "Team notification", result ? "#birmingham-leads notified" : running ? "Waiting for owner assertion" : "Guarded"],
              [UserRoundCheck, "Follow-up task", result ? "Assigned to Saim · due in 5 min" : running ? "Waiting for owner assertion" : "Guarded"],
            ].map(([Icon, title, detail], index) => {
              const StepIcon = Icon as typeof Route;
              const passed = Boolean(result);
              return (
                <div
                  key={String(title)}
                  className={
                    passed
                      ? "replay-step grid gap-4 rounded-[18px] border border-[#48ce8e]/25 bg-[#48ce8e]/[.06] p-4 sm:grid-cols-[44px_1fr_auto] sm:items-center"
                      : "replay-step grid gap-4 rounded-[18px] border border-white/10 bg-white/[.035] p-4 sm:grid-cols-[44px_1fr_auto] sm:items-center"
                  }
                >
                  <span className={
                    passed
                      ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#174330] text-[#63dfa9]"
                      : "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07] text-white/55"
                  }>
                    <StepIcon size={18} />
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold">{String(title)}</p>
                    <p className={passed ? "mt-1 text-[15px] text-[#82e6b8]" : "mt-1 text-[15px] text-white/48"}>{String(detail)}</p>
                  </div>
                  {passed ? <Check size={18} className="text-[#63dfa9]" /> : running && index === 0 ? <LoaderCircle size={18} className="animate-spin text-[#8f98ff]" /> : <ShieldCheck size={18} className="text-white/25" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={replay}
            disabled={!fixed || running || Boolean(result)}
            className={
              result
                ? "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-5 text-[15px] font-semibold text-white"
                : "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-[#111318] transition hover:bg-[#f0f1f3] disabled:cursor-not-allowed disabled:opacity-30"
            }
          >
            {running ? <LoaderCircle size={17} className="animate-spin" /> : result ? <CheckCircle2 size={17} /> : <RefreshCw size={17} />}
            {running ? "Verifying recovery" : result ? "Recovery verified" : "Replay from routing boundary"}
          </button>

          {result ? (
            <div className="mt-5 rounded-[20px] border border-[#48ce8e]/30 bg-[#48ce8e]/[.075] p-5">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16855b] text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="text-[18px] font-semibold">Recovery passed without duplicating the lead.</p>
                  <p className="mt-2 text-[15px] leading-7 text-white/58">The original CRM record gained the missing owner, then Watchdog released the two guarded actions because their prerequisite was valid again.</p>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {result ? (
        <div className="mt-5 flex flex-col gap-4 rounded-[24px] border border-[var(--hairline)] bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[18px] font-semibold">Now inspect the Watchdog itself.</p>
            <p className="mt-1 text-[16px] leading-7 text-[var(--copy)]">The next screen is a live 3D teardown of the control plane, then you can jump into broader use cases and mimicked automation flows.</p>
          </div>
          <button
            onClick={() => router.push("/architecture")}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 text-[15px] font-semibold text-white transition hover:bg-[var(--blue-deep)]"
          >
            Open 3D teardown
            <ArrowRight size={17} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
