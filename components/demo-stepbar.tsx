"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Check, ChevronRight } from "lucide-react";

const steps = [
  { href: "/", label: "Customer site" },
  { href: "/automation", label: "Automation" },
  { href: "/crm", label: "CRM" },
  { href: "/watchdog", label: "Watchdog" },
  { href: "/recovery", label: "Recovery" },
];

function stepIndex(pathname: string) {
  if (pathname.startsWith("/automation")) return 1;
  if (pathname.startsWith("/crm")) return 2;
  if (pathname.startsWith("/watchdog")) return 3;
  if (pathname.startsWith("/recovery")) return 4;
  return 0;
}

export function DemoStepbar() {
  const pathname = usePathname();
  const architectureActive = pathname.startsWith("/architecture");
  const useCasesPage = pathname.startsWith("/use-cases");
  const current = architectureActive || useCasesPage ? -1 : stepIndex(pathname);

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#111318] text-white shadow-[0_8px_28px_rgba(17,19,24,.12)]">
      <div className="mx-auto flex min-h-[56px] max-w-[1480px] items-center gap-4 px-4 md:px-7">
        <Link href="/" className="shrink-0 text-[15px] font-semibold tracking-[-0.025em]">
          Journey Watchdog
        </Link>

        <span className="hidden h-5 w-px bg-white/15 md:block" />

        <nav aria-label="Demo journey" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          <div className="flex min-w-max items-center gap-1.5">
            {steps.map((step, index) => {
              const active = index === current;
              const completed = current >= 0 && index < current;
              return (
                <div key={step.href} className="flex items-center">
                  <Link
                    href={step.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "inline-flex h-9 items-center rounded-lg bg-[#5665ff] px-3.5 text-[14px] font-semibold text-white shadow-[0_5px_16px_rgba(86,101,255,.3)]"
                        : completed
                          ? "inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-medium text-white/82 transition hover:bg-white/10 hover:text-white"
                          : "inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-medium text-white/48 transition hover:bg-white/10 hover:text-white/85"
                    }
                  >
                    {completed ? (
                      <Check size={14} className="mr-1.5 text-[#62dda5]" />
                    ) : (
                      <span className="mr-1.5 font-mono text-[12px] opacity-65">{index + 1}</span>
                    )}
                    {step.label}
                  </Link>
                  {index < steps.length - 1 ? <ChevronRight size={14} className="mx-0.5 text-white/20" /> : null}
                </div>
              );
            })}
          </div>
        </nav>

        {!useCasesPage ? (
          <Link
            href="/architecture"
            className={
              architectureActive
                ? "hidden h-9 shrink-0 items-center gap-2 rounded-lg bg-white px-3.5 text-[13px] font-semibold text-[#111318] md:inline-flex"
                : "hidden h-9 shrink-0 items-center gap-2 rounded-lg border border-white/15 px-3.5 text-[13px] font-semibold text-white/72 transition hover:border-white/30 hover:bg-white/10 hover:text-white md:inline-flex"
            }
          >
            <Box size={14} />
            System anatomy
          </Link>
        ) : null}
      </div>
    </div>
  );
}
