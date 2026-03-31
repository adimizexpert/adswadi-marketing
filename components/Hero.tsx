"use client";

import Link from "next/link";
import { ChevronDown, Instagram, Youtube } from "lucide-react";

export type HeroProps = {
  line1: string;
  line2: string;
  subheadline: string;
  subtextLine2: string;
};

export default function Hero({
  line1,
  line2,
  subheadline,
  subtextLine2,
}: HeroProps) {
  const subBlock = [subheadline, subtextLine2].filter(Boolean).join(" ");

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[#EDE0FF] via-[#FAE0F5] to-[#F0F4FF] pb-20 pt-28 sm:pb-28 sm:pt-32"
    >
      {/* Static ambient wash — no moving orbs */}
      <div
        className="pointer-events-none absolute -left-40 top-10 z-0 h-[520px] w-[520px] rounded-full bg-[#7C3AED]/12 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-24 z-0 h-[420px] w-[420px] rounded-full bg-[#EC4899]/10 blur-[90px]"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="leading-[1.08]">
            <span
              className="font-display block bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A78BFA] bg-clip-text text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold tracking-[-0.03em] text-transparent drop-shadow-[0_2px_24px_rgba(124,58,237,0.25)]"
              style={{ fontFeatureSettings: '"ss01", "ss02"' }}
            >
              {line1}
            </span>
            <span className="font-outfit mt-3 block bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#F472B6] bg-clip-text text-[clamp(1.35rem,3.8vw,2.25rem)] font-semibold leading-snug tracking-[-0.02em] text-transparent sm:mt-4">
              {line2}
            </span>
          </h1>

          {subBlock && (
            <p className="mx-auto mt-8 max-w-2xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg">
              {subBlock}
            </p>
          )}

          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="#instagram"
              className="group font-outfit inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-900/20 ring-2 ring-white/30 transition-transform hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#DD2A7B] focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              <Instagram className="h-5 w-5 shrink-0" aria-hidden />
              Explore Instagram services
            </Link>
            <Link
              href="#youtube"
              className="btn-secondary-line font-outfit inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white/50 px-8 py-3.5 text-base font-semibold text-gray-800 transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:border-[#7C3AED] focus-visible:outline-none"
            >
              Explore YouTube services
            </Link>
          </div>

          <div className="mt-12 overflow-hidden rounded-full border border-purple-100 bg-white/80 py-2 shadow-card backdrop-blur-sm">
            <div className="group flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  className="flex shrink-0 items-center gap-10 px-6 md:gap-12"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Youtube className="h-5 w-5 text-red-600" />
                    Trusted by 50+ Creators
                  </span>
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <Youtube className="h-5 w-5 text-red-600" />
                    YouTube Growth
                  </span>
                  <Instagram className="h-5 w-5 text-pink-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] mt-10 flex justify-center" aria-hidden>
        <a href="#youtube" className="text-gray-400 hover:text-[#7C3AED]">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
}
