"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Youtube,
} from "lucide-react";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import {
  fadeInVariant,
  fadeUpVariant,
  staggerContainer,
  staggerWords,
} from "@/lib/animations";
import { useIsMobile } from "@/lib/useIsMobile";

const HeroParticles = dynamic(() => import("./HeroParticles"), {
  ssr: false,
  loading: () => null,
});

export type HeroProps = {
  line1: string;
  line2: string;
  subheadline: string;
  subtextLine2: string;
  whatsappUrl: string;
};

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

export default function Hero({
  line1,
  line2,
  subheadline,
  subtextLine2,
  whatsappUrl,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const light = reduceMotion || isMobile;

  const line1Words = splitWords(line1);
  const line2Words = splitWords(line2);
  const subFull = `${subheadline}\n${subtextLine2}`;
  const subChars = subFull.split("");

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[#EDE0FF] via-[#FAE0F5] to-[#F0F4FF] pb-20 pt-28 sm:pb-28 sm:pt-32"
    >
      {!light && <HeroParticles />}

      {/* Orbs */}
      {!isMobile ? (
        <>
          <motion.div
            className="pointer-events-none absolute -left-40 top-10 z-0 h-[600px] w-[600px] rounded-full bg-[#7C3AED]/20 blur-[120px] will-change-transform"
            aria-hidden
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 30, 0], y: [0, -20, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="pointer-events-none absolute -right-32 top-24 z-0 h-[500px] w-[500px] rounded-full bg-[#EC4899]/20 blur-[100px] will-change-transform"
            aria-hidden
            animate={
              reduceMotion
                ? undefined
                : { x: [0, -24, 0], y: [0, 16, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: 11,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[80px] will-change-transform"
            aria-hidden
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 20, 0], y: [0, -14, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: 14,
              ease: "easeInOut",
            }}
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute -left-20 top-16 z-0 h-[300px] w-[300px] rounded-full bg-[#7C3AED]/18 blur-[60px] will-change-transform"
          aria-hidden
        />
      )}

      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {light ? (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.15] xl:text-6xl"
            >
              <span className="block text-[#7C3AED]">{line1}</span>
              <span className="mt-1 block text-[#EC4899]">{line2}</span>
            </motion.h1>
          ) : (
            <motion.h1
              className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.15] xl:text-6xl"
              variants={staggerWords}
              initial="hidden"
              animate="visible"
            >
              <span className="block text-[#7C3AED]">
                {line1Words.map((w, i) => (
                  <motion.span
                    key={`l1-${i}`}
                    variants={fadeUpVariant}
                    className="mr-[0.25em] inline-block bg-gradient-to-r from-[#7C3AED] via-fuchsia-200 to-[#7C3AED] bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer last:mr-0"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
              <span className="mt-1 block text-[#EC4899]">
                {line2Words.map((w, i) => (
                  <motion.span
                    key={`l2-${i}`}
                    variants={fadeUpVariant}
                    className="mr-[0.25em] inline-block bg-gradient-to-r from-[#EC4899] via-pink-200 to-[#EC4899] bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer last:mr-0"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          )}

          {light ? (
            <p className="mx-auto mt-8 max-w-2xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg">
              {subheadline}
              <br />
              {subtextLine2}
            </p>
          ) : (
            <motion.p
              className="mx-auto mt-8 max-w-2xl text-left text-base font-normal leading-relaxed text-gray-600 sm:text-center sm:text-lg"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {subChars.map((c, i) =>
                c === "\n" ? (
                  <br key={`br-${i}`} />
                ) : (
                  <motion.span key={i} variants={fadeInVariant} className="inline">
                    {c}
                  </motion.span>
                )
              )}
            </motion.p>
          )}

          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: isMobile ? 0.98 : 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-900/15 transition-colors hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
              <WhatsAppLogo className="relative z-[1] h-5 w-5 shrink-0" />
              <span className="relative z-[1]">Book free consultation on WhatsApp</span>
              <motion.span
                className="relative z-[1] inline-flex"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </motion.span>
            </motion.a>
            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#youtube"
                className="btn-secondary-line inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white/50 px-8 py-3.5 text-base font-semibold text-gray-800 transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:border-[#7C3AED] focus-visible:outline-none"
              >
                Explore YouTube services
              </Link>
            </motion.div>
          </div>

          {/* Marquee */}
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

      <motion.div
        className="relative z-[2] mt-10 flex justify-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        aria-hidden
      >
        <a href="#youtube" className="text-gray-400 hover:text-[#7C3AED]">
          <ChevronDown className="h-8 w-8" />
        </a>
      </motion.div>
    </section>
  );
}
