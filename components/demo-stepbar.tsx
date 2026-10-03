"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, ChevronRight } from "lucide-react";

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
  const current = stepIndex(pathname);

  return (
    <div className="sticky top-0 z-50 border-b border-black/10 bg-[#111318] text-white">
      <div className="mx-auto flex min-h-[52px] max-w-[1480px] items-center gap-4 px-4 md:px-7">
        <Link href="/" className="shrink-0 text-[14px] font-semibold tracking-[-0.02em]">
          Journey Watchdog
        </Link>

        <span className="hidden h-5 w-px bg-white/15 md:block" />

        <nav aria-label="Demo journey" className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1">
            {steps.map((step, index) => (
              <div key={step.href} className="flex items-center">
                <Link
                  href={step.href}
                  className={
                    index === current
                      ? "rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-[#111318]"
                      : index < current
                        ? "rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                        : "rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white/80"
                  }
                >
                  <span className="mr-1.5 font-mono text-[11px] opacity-60">{index + 1}</span>
                  {step.label}
                </Link>
                {index < steps.length - 1 ? <ChevronRight size={13} className="mx-0.5 text-white/20" /> : null}
              </div>
            ))}
          </div>
        </nav>

        <Link
          href="/architecture"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-[13px] font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          <Box size={14} />
          3D architecture
        </Link>
      </div>
    </div>
  );
}
