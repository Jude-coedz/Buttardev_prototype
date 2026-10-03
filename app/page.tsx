import { BrightHomeEnquiry } from "@/components/brighthome-enquiry";
import { DemoFrame } from "@/components/demo-frame";
import {
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <DemoFrame>
      <div className="bg-[#eef2eb] text-[#162019]">
        <header className="border-b border-black/[0.07]">
          <div className="mx-auto flex h-[64px] max-w-[1380px] items-center justify-between px-5 md:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#162019] text-white">
                <Sparkles size={18} />
              </span>
              <span className="text-[19px] font-semibold tracking-[-0.04em]">BrightHome</span>
            </div>

            <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#5a655e] md:flex">
              <a href="#services" className="transition hover:text-[#162019]">Services</a>
              <a href="#why" className="transition hover:text-[#162019]">Why BrightHome</a>
              <a href="#enquiry" className="rounded-full bg-[#162019] px-4 py-2.5 font-semibold text-white">Request a clean</a>
            </nav>
          </div>
        </header>

        <main>
          <section className="mx-auto grid min-h-[calc(100dvh-120px)] max-w-[1380px] items-center gap-8 px-5 py-7 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-8">
            <div className="max-w-[720px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ccd5cb] bg-white/60 px-3 py-2 text-[14px] font-medium text-[#516058]">
                <MapPin size={15} />
                Birmingham · trusted local cleaning
              </div>

              <h1 className="text-[46px] font-semibold leading-[.98] tracking-[-0.06em] text-[#121914] sm:text-[58px] lg:text-[70px]">
                Come home to done.
              </h1>

              <p className="mt-5 max-w-[600px] text-[18px] leading-7 text-[#566159] md:text-[20px]">
                Reliable home cleaning without the back-and-forth. Tell us what you need and we’ll confirm the right team and time.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  "Fully vetted cleaners",
                  "Simple scheduling",
                  "Clear confirmations",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 text-[15px] font-medium text-[#3c4940]">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check size={13} />
                    </span>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center gap-5 border-t border-black/[0.08] pt-5">
                <div className="flex -space-x-2">
                  {["A", "J", "M", "R"].map((letter, index) => (
                    <span
                      key={letter}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#eef2eb] bg-[#d9e3d7] text-[13px] font-semibold text-[#334038]"
                      style={{ zIndex: 4 - index }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#b27122]">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
                  </div>
                  <p className="mt-1 text-[14px] text-[#657068]">4.9 from local customers</p>
                </div>
              </div>
            </div>

            <div id="enquiry" className="lg:justify-self-end lg:max-w-[570px]">
              <BrightHomeEnquiry />
            </div>
          </section>

          <section id="services" className="bg-[#162019] text-white">
            <div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-12 md:px-8 lg:grid-cols-[.75fr_1.25fr] lg:py-14">
              <div>
                <p className="text-[15px] font-medium text-[#9eb1a3]">Built around the next step</p>
                <h2 className="mt-3 max-w-md text-[38px] font-semibold leading-[1.06] tracking-[-0.05em] md:text-[46px]">
                  No vague “we’ll be in touch.”
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
                  <Clock3 size={22} className="text-[#a9cdb2]" />
                  <h3 className="mt-8 text-[20px] font-semibold">Know what happens next</h3>
                  <p className="mt-3 text-[16px] leading-7 text-white/60">
                    Every enquiry gets a clear acknowledgement without promising availability the team has not confirmed.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
                  <ArrowUpRight size={22} className="text-[#a9cdb2]" />
                  <h3 className="mt-8 text-[20px] font-semibold">One clear owner</h3>
                  <p className="mt-3 text-[16px] leading-7 text-white/60">
                    Once qualified, the right local team member owns the follow-up instead of the lead disappearing between tools.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </DemoFrame>
  );
}
