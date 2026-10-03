import { DemoStepbar } from "@/components/demo-stepbar";

export function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <DemoStepbar />
      <div className="page-enter">{children}</div>
    </div>
  );
}
