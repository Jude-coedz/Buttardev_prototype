"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { animate } from "animejs";

export function BrightHomeEnquiry() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    const animation = animate(ctaRef.current, {
      translateY: [0, -5, 0],
      opacity: [0.72, 1, 0.72],
      duration: 1900,
      loop: true,
      ease: "inOut(3)",
    });
    return () => { animation.cancel(); };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);

    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setSending(false);
    setSent(true);

    window.setTimeout(() => {
      router.push("/automation?run=WD-1842");
    }, 650);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[26px] border border-black/10 bg-white p-6 shadow-[0_30px_90px_rgba(27,34,29,.12)] md:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[20px] font-semibold tracking-[-0.03em] text-[#162019]">Request a clean</p>
          <p className="mt-1 text-[15px] leading-6 text-[#677069]">Tell us what you need. We’ll confirm availability.</p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef7ef] text-[#267342]">
          <ShieldCheck size={18} />
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Name", "Amina Test"],
          ["Email", "watchdog+1842@demo.local"],
          ["Postcode", "B15 2TT"],
          ["Property", "3 bedroom"],
        ].map(([label, value]) => (
          <label key={label} className="block">
            <span className="mb-2 block text-[14px] font-medium text-[#3f4842]">{label}</span>
            <input
              aria-label={label}
              defaultValue={value}
              className="h-12 w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-3.5 text-[15px] font-medium text-[#202722] outline-none transition focus:border-[#87a88e] focus:bg-white"
            />
          </label>
        ))}

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[14px] font-medium text-[#3f4842]">Service</span>
          <select
            aria-label="Service"
            defaultValue="Residential deep clean"
            className="h-12 w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-3.5 text-[15px] font-medium text-[#202722] outline-none transition focus:border-[#87a88e] focus:bg-white"
          >
            <option>Residential deep clean</option>
            <option>Regular house clean</option>
            <option>End of tenancy clean</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[14px] font-medium text-[#3f4842]">Preferred date</span>
          <input
            aria-label="Preferred date"
            defaultValue="6 October 2026"
            className="h-12 w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-3.5 text-[15px] font-medium text-[#202722] outline-none transition focus:border-[#87a88e] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-[#f3f7f2] px-4 py-3 text-[14px] leading-6 text-[#536058]">
        Your preferred date is a request until a BrightHome team member confirms it.
      </div>

      {!sending && !sent ? (
        <div ref={ctaRef} className="mt-5 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#516058]">
          <ArrowDownRight size={16} className="text-[#267342]" />
          Start the demo here
        </div>
      ) : null}

      <button
        type="submit"
        disabled={sending || sent}
        className={
          sent
            ? "mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#267342] px-4 text-[15px] font-semibold text-white"
            : "mt-3 inline-flex h-12 w-full ring-4 ring-[#dfeade]/80 items-center justify-center gap-2 rounded-xl bg-[#162019] px-4 text-[15px] font-semibold text-white transition hover:bg-[#27332b] disabled:cursor-wait disabled:opacity-70"
        }
      >
        {sending ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Sending enquiry
          </>
        ) : sent ? (
          <>
            <CheckCircle2 size={17} />
            Enquiry sent
          </>
        ) : (
          <>
            Send enquiry
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-[13px] leading-5 text-[#8a938c]">
        Demo identity only. No real customer data is used.
      </p>
    </form>
  );
}
