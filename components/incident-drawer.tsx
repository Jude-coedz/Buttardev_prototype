"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

type IncidentDrawerProps = {
  open: boolean;
  onClose: () => void;
  onReplay: () => void;
};

const drawerVariants = {
  hidden: {
    x: "102%",
    opacity: 0.7,
    transition: { type: "spring" as const, stiffness: 360, damping: 38 },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 360,
      damping: 38,
      mass: 0.85,
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 30 },
  },
};

export function IncidentDrawer({ open, onClose, onReplay }: IncidentDrawerProps) {
  const [copied, setCopied] = useState(false);

  const copyEvidence = async () => {
    const evidence = [
      "Journey Watchdog incident WD-1842",
      "Failure: Owner assignment failed",
      "Expected: owner_id = saim.birmingham",
      "Received: owner_id = null",
      "Last change: CRM mapping updated 47m ago",
      "Likely cause: assignee_id renamed upstream",
      "Recovery: fix owner mapping and replay from routing with the same idempotency key",
    ].join("\n");

    await navigator.clipboard?.writeText(evidence);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close incident"
            className="fixed inset-0 z-40 bg-slate-950/18 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            aria-label="Incident details"
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[560px] flex-col border-l border-slate-200/80 bg-[#fbfbf8] shadow-[-24px_0_70px_rgba(15,23,42,0.12)]"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between border-b border-slate-200/80 px-7 py-5"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <AlertTriangle size={20} strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500">Incident WD-1842</p>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    Owner assignment failed
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X size={18} />
              </button>
            </motion.div>

            <div className="flex-1 overflow-y-auto px-7 py-7">
              <motion.section variants={itemVariants} className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-950">What the customer would feel</p>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    High impact
                  </span>
                </div>
                <p className="text-[16px] leading-7 text-slate-600">
                  The enquiry reaches the CRM, but nobody owns the next response. The customer sees a successful confirmation while the lead can quietly sit untouched.
                </p>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8">
                <p className="mb-3 text-sm font-semibold text-slate-950">Where Watchdog narrowed it down</p>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid grid-cols-[116px_1fr] gap-y-3 text-sm">
                    <span className="text-slate-500">Expected</span>
                    <span className="font-medium text-slate-900">owner_id = saim.birmingham</span>
                    <span className="text-slate-500">Received</span>
                    <span className="font-medium text-rose-700">owner_id = null</span>
                    <span className="text-slate-500">Last change</span>
                    <span className="font-medium text-slate-900">CRM mapping updated 47m ago</span>
                    <span className="text-slate-500">Likely cause</span>
                    <span className="font-medium text-slate-900">assignee_id renamed upstream</span>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8">
                <p className="mb-3 text-sm font-semibold text-slate-950">Protected downstream actions</p>
                <div className="space-y-2">
                  {[
                    "Team alert was not sent with an unowned lead",
                    "Follow-up task was not created against an invalid owner",
                    "Synthetic lead keeps a stable idempotency key for safe replay",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-3"
                    >
                      <ShieldCheck className="mt-0.5 text-emerald-600" size={17} />
                      <span className="text-sm leading-5 text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants}>
                <p className="mb-3 text-sm font-semibold text-slate-950">Safe recovery</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    No customer-facing action needs to be replayed
                  </div>
                  <p className="mb-5 text-[15px] leading-6 text-slate-300">
                    Fix the owner mapping, then replay from the routing step. Watchdog reuses the same test lead instead of creating a duplicate CRM record.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={onReplay}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                      <RotateCcw size={15} />
                      Apply fix & replay
                    </button>
                    <button
                      onClick={copyEvidence}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                      {copied ? "Copied" : "Copy evidence"}
                    </button>
                  </div>
                </div>
              </motion.section>
            </div>

            <motion.div
              variants={itemVariants}
              className="border-t border-slate-200/80 bg-white/70 px-7 py-4 backdrop-blur"
            >
              <button
                onClick={onClose}
                className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-left text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Back to journey
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
