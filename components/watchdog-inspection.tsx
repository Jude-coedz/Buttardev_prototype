"use client";

import { useEffect, useRef, useState } from "react";
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
  ShieldCheck,
  TriangleAlert,
  UserRoundCheck,
} from "lucide-react";
import type { JourneyRun } from "@/lib/watchdog-engine";

const trace = [
  { id: "website", label: "Website", icon: Globe2 },
  { id: "qualify", label: "AI", icon: Bot },
  { id: "crm", label: "CRM", icon: Database },
  { id: "owner", label: "Owner", icon: Route },
  { id: "alert", label: "Team alert", icon: MessageSquare },
  { id: "followup", label: "Follow-up", icon: UserRoundCheck },
] as const;

export function WatchdogInspection() {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState<JourneyRun | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    const inspect = async () => {
      const response = await fetch("/api/watchdog/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "degraded" }),
      });
      const result = (await response.json()) as JourneyRun;
      if (cancelled) return;

      setRun(result);

      for (let index = 0; index < trace.length; index += 1) {
        if (cancelled) return;
        setActive(index);

        window.setTimeout(() => {
          const node = shellRef.current?.querySelector(`[data-trace="${index}"]`);
          if (node) {
            animate(node, {
              scale: [0.94, 1.08, 1],
              duration: 480,
              ease: "out(4)",
            });
          }
        }, 0);

        await new Promise((resolve) => window.setTimeout(resolve, index === 3 ? 900 : 430));
      }
    };

    void inspect();

    return () => {
      cancelled = true;
    };
  }, []);

  const failed = run?.incident;

  return (
    <div ref={shellRef} className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[15px] font-semibold text-[var(--blue)]">Step 4 · Watchdog</p>
          <h1 className="mt-4 max-w-[720px] text-[46px] font-semibold leading-[1.02] tracking-[-0.06em] md:text-[62px]">
            Watchdog finds the break the CRM cannot see.
          </h1>
        </div>
        <p className="max-w-[590px] text-[18px] leading-8 text-[var(--copy)] lg:justify-self-end">
          It does not ask “is HubSpot online?” It asks whether the business state leaving each handoff is good enough for the next one to safely continue.
        </p>
      </div>

      <section className="mt-14 overflow-hidden rounded-[30px] bg-[#111318] text-white shadow-[0_34px_110px_rgba(17,19,24,.18)]">
        <div className="border-b border-white/10 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4f5cff] text-white">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-[17px] font-semibold">Residential enquiry</p>
                <p className="mt-0.5 text-[14px] text-white/45">Run WD-1842 · synthetic-only</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-[13px] font-medium text-white/65">
              {run ? <CircleDot size={14} className="text-[#4ee0a0]" /> : <LoaderCircle size={14} className="animate-spin text-[#8f98ff]" />}
              {run ? "Inspection complete" : "Inspecting handoffs"}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="rounded-[22px] border border-white/10 bg-white/[.035] p-5 md:p-6">
            <p className="text-[14px] font-medium text-white/45">Journey contract</p>
            <p className="mt-2 max-w-4xl text-[23px] font-semibold leading-8 tracking-[-0.03em] text-white md:text-[27px]">
              Every qualified Birmingham lead must have exactly one owner before a team alert or follow-up task can run.
            </p>
          </div>

          <div className="relative mt-8">
            <div className="absolute left-[7%] right-[7%] top-[28px] hidden h-px bg-white/10 lg:block">
              <span
                className="watchdog-line block h-full origin-left transition-[width] duration-500"
                style={{ width: active < 0 ? "0%" : `${Math.min((active / 5) * 100, 100)}%` }}
              />
            </div>

            <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {trace.map((item, index) => {
                const Icon = item.icon;
                const step = run?.steps[index];
                const isFailed = step && !step.ok && !step.blocked;
                const isBlocked = step?.blocked;
                const isPassed = step?.ok;
                const isActive = active === index && !run;

                return (
                  <div
                    key={item.id}
                    data-trace={index}
                    className={
                      isFailed
                        ? "relative z-10 min-h-[154px] rounded-[20px] border border-[#d94b63]/60 bg-[#d94b63]/10 p-4"
                        : isBlocked
                          ? "relative z-10 min-h-[154px] rounded-[20px] border border-white/10 bg-white/[.025] p-4 opacity-60"
                          : isPassed
                            ? "relative z-10 min-h-[154px] rounded-[20px] border border-[#39c885]/25 bg-[#39c885]/[.055] p-4"
                            : "relative z-10 min-h-[154px] rounded-[20px] border border-white/10 bg-[#171a21] p-4"
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isFailed
                            ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d94b63] text-white"
                            : isPassed
                              ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#183f32] text-[#64e1aa]"
                              : "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07] text-white/65"
                        }
                      >
                        <Icon size={17} />
                      </span>

                      {isFailed ? (
                        <TriangleAlert size={17} className="text-[#ff8599]" />
                      ) : isBlocked ? (
                        <LockKeyhole size={16} className="text-white/40" />
                      ) : isPassed ? (
                        <Check size={16} className="text-[#64e1aa]" />
                      ) : isActive ? (
                        <LoaderCircle size={16} className="animate-spin text-[#8f98ff]" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-white/15" />
                      )}
                    </div>

                    <p className="mt-6 text-[16px] font-semibold">{item.label}</p>
                    <p className={
                      isFailed
                        ? "mt-2 text-[14px] leading-5 text-[#ff9bac]"
                        : "mt-2 text-[14px] leading-5 text-white/45"
                    }>
                      {isFailed
                        ? "owner_id = null"
                        : isBlocked
                          ? "Protected from running"
                          : isPassed
                            ? step?.summary
                            : "Waiting"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {failed ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
              <div className="rounded-[24px] border border-[#d94b63]/35 bg-[#d94b63]/[.075] p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d94b63] text-white">
                    <TriangleAlert size={20} />
                  </span>
                  <div>
                    <p className="text-[19px] font-semibold tracking-[-0.025em]">Owner assignment broke the contract.</p>
                    <p className="mt-2 text-[15px] leading-7 text-white/55">
                      The customer got a valid acknowledgement and the CRM record exists, but nobody owns the next human response.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-[14px] font-medium text-white/40">Expected</p>
                    <p className="mt-2 font-mono text-[15px] text-white">owner_id = saim.birmingham</p>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-[14px] font-medium text-white/40">Observed</p>
                    <p className="mt-2 font-mono text-[15px] font-semibold text-[#ff8da0]">owner_id = null</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[.035] p-6 md:p-7">
                <p className="text-[17px] font-semibold">What Watchdog protected</p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole size={17} className="mt-1 shrink-0 text-[#e7b15e]" />
                    <p className="text-[15px] leading-6 text-white/55">No team alert was sent with an unowned lead.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <LockKeyhole size={17} className="mt-1 shrink-0 text-[#e7b15e]" />
                    <p className="text-[15px] leading-6 text-white/55">No orphan follow-up task was created.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <LockKeyhole size={17} className="mt-1 shrink-0 text-[#e7b15e]" />
                    <p className="text-[15px] leading-6 text-white/55">The same synthetic lead can be replayed safely after the fix.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {failed ? (
        <div className="mt-7 flex flex-col gap-4 rounded-[24px] border border-[var(--hairline)] bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-[17px] font-semibold">Likely regression: routing field changed upstream.</p>
            <p className="mt-1 text-[15px] leading-6 text-[var(--copy)]">Next: fix the mapping and replay only the failed boundary.</p>
          </div>
          <button
            onClick={() => router.push("/recovery?run=WD-1842")}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2a2d35]"
          >
            Fix and replay
            <ArrowRight size={17} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
