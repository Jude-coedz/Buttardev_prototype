"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LoaderCircle,
  Route,
  Search,
  Settings2,
  Sparkles,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

export function CrmLeadView() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [resolving, setResolving] = useState(false);
  const [checked, setChecked] = useState(false);

  const runRoutingCheck = async () => {
    if (resolving || checked) return;

    setResolving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    setResolving(false);
    setChecked(true);

    window.setTimeout(() => {
      if (!resultRef.current) return;
      animate(resultRef.current, {
        opacity: [0.45, 1],
        translateY: [10, 0],
        scale: [0.985, 1.015, 1],
        duration: 560,
        ease: "out(4)",
      });
    }, 0);
  };

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-7 md:py-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[15px] font-semibold text-[var(--blue)]">Step 3 · CRM</p>
          <h1 className="mt-2 text-[36px] font-semibold leading-[1.03] tracking-[-0.05em] md:text-[46px]">
            The lead exists. Now inspect what routing received.
          </h1>
        </div>
        <p className="max-w-[560px] text-[17px] leading-7 text-[var(--copy)]">
          The CRM is healthy and the lead was created. The next interaction deliberately checks the owner-routing rule so the failure is visible instead of happening off-screen.
        </p>
      </div>

      <section className="crm-shell overflow-visible rounded-[26px] border border-[#dfe3e8] bg-[#f7f8fa]">
        <div className="flex">
          <aside className="hidden w-[220px] shrink-0 border-r border-[#e1e5ea] bg-[#171a21] p-4 text-white lg:flex lg:flex-col">
            <div className="flex items-center gap-3 px-2 py-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#5865ff] text-white">
                <Sparkles size={17} />
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.03em]">FlowCRM</span>
            </div>

            <nav className="mt-5 space-y-1">
              {[
                [LayoutDashboard, "Overview", false],
                [UsersRound, "Leads", true],
                [Bell, "Tasks", false],
                [Settings2, "Automations", false],
              ].map(([Icon, label, active]) => {
                const ItemIcon = Icon as typeof LayoutDashboard;
                return (
                  <div
                    key={String(label)}
                    className={
                      active
                        ? "flex h-10 items-center gap-3 rounded-xl bg-white/10 px-3 text-[14px] font-semibold text-white"
                        : "flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] font-medium text-white/45"
                    }
                  >
                    <ItemIcon size={16} />
                    {String(label)}
                  </div>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.04] p-4">
              <p className="text-[14px] font-semibold text-white">Birmingham workspace</p>
              <p className="mt-1 text-[14px] leading-6 text-white/55">BrightHome Cleaning</p>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="flex h-[60px] items-center justify-between border-b border-[#e1e5ea] bg-white px-5 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Search size={17} className="text-[#9ba2ad]" />
                <span className="hidden text-[15px] text-[#818995] sm:inline">Search leads, contacts, tasks…</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full bg-[#edf8f1] px-3 py-1.5 text-[14px] font-semibold text-[#25734b] sm:inline-flex">
                  CRM healthy
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#edf0f4] text-[#58606b]">
                  <CircleUserRound size={18} />
                </span>
              </div>
            </header>

            <div className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-medium text-[#707986]">Leads / Residential enquiry</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171a21]">Amina Test</h2>
                    <span className="rounded-full bg-[#eef0ff] px-3 py-1.5 text-[14px] font-semibold text-[#4350d9]">Qualified</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[14px] text-[#717a86]">crm_demo_1842</p>
                </div>
                <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce1e6] bg-white px-3.5 text-[14px] font-semibold text-[#525a65]">
                  Actions
                  <ChevronDown size={15} />
                </button>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
                <section className="rounded-[22px] border border-[#e0e4e9] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-[#747d88]">Critical next handoff</p>
                      <h3 className="mt-1 text-[19px] font-semibold text-[#171a21]">Resolve Birmingham owner</h3>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#626b76]">
                      <Check size={14} className="text-[#2e8d5d]" />
                      Lead synced
                    </span>
                  </div>

                  <div
                    ref={resultRef}
                    className={
                      checked
                        ? "mt-4 rounded-[18px] border border-[#efb7c1] bg-[#fff5f7] p-4"
                        : "mt-4 rounded-[18px] border border-[#dfe3e8] bg-[#f8f9fa] p-4"
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={
                          checked
                            ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffe3e8] text-[var(--rose)]"
                            : "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5865ff]"
                        }>
                          {resolving ? <LoaderCircle size={19} className="animate-spin" /> : checked ? <TriangleAlert size={19} /> : <Route size={19} />}
                        </span>
                        <div>
                          <p className="text-[14px] font-medium text-[#737c87]">Lead owner</p>
                          <p className={
                            checked
                              ? "mt-1 text-[20px] font-semibold tracking-[-0.025em] text-[#9f3043]"
                              : "mt-1 text-[18px] font-semibold text-[#313740]"
                          }>
                            {resolving ? "routing-v4 is evaluating…" : checked ? "Unassigned" : "Not evaluated yet"}
                          </p>
                        </div>
                      </div>

                      {checked ? (
                        <div className="rounded-xl bg-white px-4 py-2.5 font-mono text-[14px] leading-6 text-[#5d6672]">
                          expected: <span className="text-[#2f3944]">saim.birmingham</span><br />
                          received: <span className="font-semibold text-[#b73d52]">null</span>
                        </div>
                      ) : (
                        <button
                          onClick={runRoutingCheck}
                          disabled={resolving}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#171a21] px-4 text-[15px] font-semibold text-white transition hover:bg-[#2b3038] disabled:cursor-wait disabled:opacity-60"
                        >
                          {resolving ? <LoaderCircle size={16} className="animate-spin" /> : <Route size={16} />}
                          {resolving ? "Checking routing" : "Run owner-routing rule"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-3">
                    {[
                      ["Email", "watchdog+1842@demo.local"],
                      ["Postcode", "B15 2TT"],
                      ["Service", "Residential deep clean"],
                      ["Property", "3 bedroom"],
                      ["Preferred date", "6 Oct · request"],
                      ["Qualification", "96% confidence"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[14px] font-medium text-[#7b8490]">{label}</p>
                        <p className="mt-1 text-[15px] font-semibold text-[#2c3139]">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <aside className="rounded-[22px] border border-[#e0e4e9] bg-white p-5">
                  <h3 className="text-[17px] font-semibold text-[#171a21]">Activity</h3>
                  <div className="mt-5 space-y-5">
                    {[
                      ["14:32:01", "Website enquiry received", "Webhook accepted"],
                      ["14:32:02", "AI qualification complete", "4 fields captured"],
                      ["14:32:03", "Lead created", "crm_demo_1842"],
                      ["14:32:03", resolving ? "Owner routing running" : checked ? "Owner routing completed" : "Owner routing waiting", resolving ? "routing-v4 evaluating…" : checked ? "owner_id = null" : "Waiting for manual check"],
                    ].map(([time, title, detail], index) => (
                      <div key={String(title)} className="grid grid-cols-[14px_1fr] gap-3">
                        <div className="relative flex justify-center">
                          <span className={
                            index === 3 && checked
                              ? "mt-1.5 h-2.5 w-2.5 rounded-full bg-[var(--rose)]"
                              : "mt-1.5 h-2.5 w-2.5 rounded-full bg-[#8a95a2]"
                          } />
                          {index < 3 ? <span className="absolute bottom-[-20px] top-4 w-px bg-[#e3e6ea]" /> : null}
                        </div>
                        <div>
                          <p className="font-mono text-[13px] text-[#7f8791]">{time}</p>
                          <p className="mt-1 text-[15px] font-semibold text-[#343a43]">{title}</p>
                          <p className={
                            index === 3 && checked
                              ? "mt-1 text-[15px] font-semibold text-[var(--rose)]"
                              : "mt-1 text-[14px] text-[#707986]"
                          }>{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              {checked ? (
                <div className="mt-4 flex flex-col gap-4 rounded-[22px] border border-[#dae0e6] bg-[#171a21] p-5 text-white md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[17px] font-semibold">The CRM is healthy, but the journey contract is not.</p>
                    <p className="mt-1 text-[15px] leading-6 text-white/55">
                      That mismatch is exactly what Watchdog should inspect next.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/watchdog?run=WD-1842")}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-[#171a21] transition hover:bg-[#f1f2f4]"
                  >
                    Let Watchdog inspect it
                    <ArrowRight size={17} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
