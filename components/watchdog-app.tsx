"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Activity,
  Braces,
  CircleDot,
  Route,
  ShieldCheck,
} from "lucide-react";
import { LiveSystem } from "@/components/live-system";
import { SystemModel } from "@/components/system-model";

type View = "live" | "model";

const spring = { type: "spring" as const, stiffness: 320, damping: 30 };

function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-950 text-white shadow-[0_8px_22px_rgba(15,23,42,0.18)]">
        <Route size={19} strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
      </div>
      <div>
        <p className="text-[17px] font-semibold tracking-[-0.035em] text-slate-950">Journey Watchdog</p>
        <p className="text-[12px] font-medium text-slate-500">ButtarDev product concept</p>
      </div>
    </div>
  );
}

export default function WatchdogApp() {
  const [view, setView] = useState<View>("live");

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f5f5f1] text-slate-950">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f5f5f1]/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-7">
            <AppLogo />

            <div className="order-3 grid w-full grid-cols-2 rounded-[14px] border border-slate-200 bg-white p-1 shadow-[0_6px_20px_rgba(15,23,42,.04)] sm:order-none sm:w-auto">
              <button
                onClick={() => setView("live")}
                className={
                  view === "live"
                    ? "inline-flex h-9 items-center justify-center gap-2 rounded-[10px] bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm"
                    : "inline-flex h-9 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                }
              >
                <Activity size={14} />
                Live system
              </button>
              <button
                onClick={() => setView("model")}
                className={
                  view === "model"
                    ? "inline-flex h-9 items-center justify-center gap-2 rounded-[10px] bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm"
                    : "inline-flex h-9 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                }
              >
                <Braces size={14} />
                System model
              </button>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 md:inline-flex">
              <CircleDot size={12} />
              Synthetic-only demo
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1480px] px-4 pb-10 pt-5 md:px-7 md:pt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={spring}
            >
              {view === "live" ? <LiveSystem /> : <SystemModel />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mx-auto flex max-w-[1480px] flex-col gap-3 border-t border-slate-200 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-7">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            Prototype uses synthetic demo identities and deterministic fixtures only.
          </div>
          <span>Built to explore proactive QA for ButtarDev client automations.</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
