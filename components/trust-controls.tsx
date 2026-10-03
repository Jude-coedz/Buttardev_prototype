"use client";

import {
  CheckCircle2,
  Database,
  EyeOff,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

const implemented = [
  {
    icon: Fingerprint,
    title: "Synthetic identity",
    body: "The demo runner creates a dedicated test lead. No real customer's name, email or CRM record is required.",
  },
  {
    icon: RefreshCw,
    title: "Idempotent replay",
    body: "A stable idempotency key lets the failed journey replay without creating a duplicate CRM lead.",
  },
  {
    icon: LockKeyhole,
    title: "Guarded downstream actions",
    body: "When owner assignment fails, notification and follow-up steps are prevented from running with invalid state.",
  },
  {
    icon: EyeOff,
    title: "No external accounts connected",
    body: "This prototype is deterministic. It does not connect to a live CRM, mailbox, Slack workspace or client database.",
  },
];

const production = [
  ["Scoped service accounts", "Each adapter should receive only the permissions it needs for the journey being verified."],
  ["Encrypted evidence", "Incident evidence and credentials should be encrypted at rest and in transit."],
  ["Retention controls", "Clients should define how long synthetic run evidence is retained and when it is deleted."],
  ["Role-based access", "Operators, client viewers and admins should have separate access to evidence and replay controls."],
  ["Secret isolation", "Connector secrets should live server-side and never be exposed to the browser."],
  ["Audit trail", "Contract edits, replays and incident resolution should be attributable to a named actor."],
] as const;

export function TrustControls() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_55px_rgba(15,23,42,.045)] md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} />
            Trust boundary
          </div>
          <h1 className="max-w-3xl text-[34px] font-semibold leading-[1.06] tracking-[-0.055em] text-slate-950 md:text-[46px]">
            Prove the journey without borrowing the customer's identity.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
            The prototype deliberately separates what is implemented today from the controls a production ButtarDev deployment would still need.
          </p>
        </div>

        <div className="rounded-[28px] border border-emerald-200/70 bg-emerald-950 p-6 text-white md:p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-100">Demo data boundary</p>
            <Database size={18} className="text-emerald-400" />
          </div>
          <div className="mt-7 space-y-3">
            {[
              ["Synthetic enquiry", "Allowed"],
              ["Stable test lead", "Allowed"],
              ["Assertion evidence", "Allowed"],
              ["Real customer PII", "Not used"],
              ["Live client credentials", "Not used"],
            ].map(([label, state]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                <span className="text-sm text-emerald-100/70">{label}</span>
                <span className={state === "Allowed" ? "text-xs font-semibold text-emerald-300" : "text-xs font-semibold text-amber-300"}>
                  {state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">Implemented in this prototype</p>
            <p className="mt-1 text-sm text-slate-500">These are real behaviours in the current demo, not presentation-only claims.</p>
          </div>
          <span className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <CheckCircle2 size={14} />
            Verifiable in code
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {implemented.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[22px] border border-slate-200/80 bg-white p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={18} />
                </span>
                <p className="mt-5 text-[15px] font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-amber-200/80 bg-[#fffdf5] p-6 md:p-7">
        <div className="mb-5 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <TriangleAlert size={18} />
          </span>
          <div>
            <p className="text-[16px] font-semibold text-slate-950">Production guardrails still required</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              A credible prototype should show where the security work starts, not pretend a demo has already solved it.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {production.map(([title, body], index) => (
            <div key={title} className="rounded-2xl border border-amber-200/70 bg-white/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <KeyRound size={15} className="text-amber-700" />
                <span className="font-mono text-[10px] font-semibold text-amber-700/60">P{index + 1}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-2 text-[13px] leading-5 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
