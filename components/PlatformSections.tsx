"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Clapperboard,
  ImageIcon,
  Megaphone,
  PenLine,
  Sparkles,
  TrendingUp,
  Users,
  Youtube,
  Instagram,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import WhatsAppLogo from "@/components/WhatsAppLogo";

function BorderedCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.article
      variants={fadeUpVariant}
      className="rounded-2xl border-2 border-[#7C3AED]/20 bg-white p-5 shadow-sm transition-shadow hover:border-[#7C3AED]/35 hover:shadow-md sm:p-6"
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED]/15 to-[#EC4899]/15 text-[#7C3AED]">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function YouTubePlatformSection() {
  return (
    <section
      id="youtube"
      className="scroll-mt-24 bg-gradient-to-b from-white to-[#FAF5FF] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700">
            <Youtube className="h-4 w-4" aria-hidden />
            YouTube
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-[#7C3AED] sm:text-3xl md:text-4xl">
            Social media management: YouTube first
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            Our most prominent focus is YouTube growth with scripts, thumbnails, editing, and AI-assisted production built to compete on what is trending now.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <BorderedCard icon={PenLine} title="High retention scriptwriting">
            Story-first scripts designed to hold attention from the first second through the full narrative arc.
          </BorderedCard>
          <BorderedCard icon={ImageIcon} title="High CTR thumbnails">
            Click-focused thumbnail systems built to lift click-through rate in search and suggested traffic.
          </BorderedCard>
          <BorderedCard icon={Clapperboard} title="Professional video editing">
            Polished edits, pacing, sound, and graphics that match serious creator and brand standards.
          </BorderedCard>
          <BorderedCard icon={Bot} title="AI video production">
            AI-assisted production workflows where they save time and raise output without cutting quality.
          </BorderedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="rounded-2xl border-2 border-[#EC4899]/30 bg-gradient-to-br from-[#FDF2F8] to-white p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EC4899]/15 text-[#DB2777]">
                <TrendingUp className="h-6 w-6" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Compete on trending topics
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
                  We track what is rising in your niche and turn those movements into videos so you stay in the same conversation as your competitors and move faster when a topic spikes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function InstagramPlatformSection() {
  return (
    <section
      id="instagram"
      className="scroll-mt-24 bg-gradient-to-b from-[#FAF5FF] to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-sm font-semibold text-pink-700">
            <Instagram className="h-4 w-4" aria-hidden />
            Instagram
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-[#7C3AED] sm:text-3xl md:text-4xl">
            Instagram growth and day-to-day management
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            Hooks that fit the feed, edits that feel native, and a full operating rhythm for posts, reels, and community.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <BorderedCard icon={Sparkles} title="Scriptwriting with a trending hook">
            Short scripts built around hooks that match what is working on Reels and the feed right now so viewers stay past the first beat.
          </BorderedCard>
          <BorderedCard icon={Clapperboard} title="Professional video editing">
            Clean cuts, captions, pacing, and brand-safe looks for Reels, ads, and organic posts.
          </BorderedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="rounded-2xl border-2 border-[#7C3AED]/25 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
              <Megaphone className="h-5 w-5 text-[#7C3AED]" aria-hidden />
              Posting, community, and reporting
            </h3>
            <ul className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2 sm:text-base">
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Instagram post and reel posting on schedule
              </li>
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Captions aligned to your brand voice
              </li>
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Replying to comments for your brand
              </li>
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Stories updates and weekly content planning
              </li>
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Performance checks on a regular rhythm
              </li>
              <li className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                Monthly reporting for the Instagram account
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function formatPhoneForTel(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("91") ? `+${d}` : `+91${d}`;
}

function formatPhoneDisplay(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("91")) {
    const rest = d.slice(2);
    if (rest.length === 10) {
      return `+91 ${rest.slice(0, 5)} ${rest.slice(5)}`;
    }
  }
  if (d.length === 10) {
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  return digits || "Your number (set in Admin)";
}

export function UGCPlatformSection({
  whatsappUrl,
  whatsappDigits,
}: {
  whatsappUrl: string;
  whatsappDigits: string;
}) {
  const telHref = formatPhoneForTel(whatsappDigits);
  const display = formatPhoneDisplay(whatsappDigits);

  return (
    <section
      id="ugc"
      className="scroll-mt-24 bg-gradient-to-b from-white to-[#F0F4FF] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-800">
            <Users className="h-4 w-4" aria-hidden />
            UGC and paid social
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-[#7C3AED] sm:text-3xl md:text-4xl">
            UGC and performance creative
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            Full-funnel creative and partnerships for brands that need leads, ads, and authority in one system.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.06 }}
        >
          <BorderedCard icon={Megaphone} title="Lead generation content">
            Creative built to pull qualified interest into your funnel, not just views.
          </BorderedCard>
          <BorderedCard icon={Clapperboard} title="Content production">
            End-to-end production for ads, organic, and campaign bursts.
          </BorderedCard>
          <BorderedCard icon={BarChart3} title="Content strategy">
            Positioning, pillars, and calendars that match business goals.
          </BorderedCard>
          <BorderedCard icon={Sparkles} title="Ad creatives">
            Meta, Facebook, and Google-ready creative sets with testing in mind.
          </BorderedCard>
          <BorderedCard icon={TrendingUp} title="Brand and profile optimization">
            Profiles, bios, highlights, and funnels tuned for trust and conversion.
          </BorderedCard>
          <BorderedCard icon={Users} title="Influencer collaborations">
            Sourcing and coordination so partnerships match your offer and audience.
          </BorderedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 space-y-6"
        >
          <div className="rounded-2xl border-2 border-[#25D366]/40 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-center text-base font-medium text-gray-800 sm:text-lg">
              Packages are tailored after we understand your goals. Book a free consultation on WhatsApp and we will walk through scope and pricing on a call.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#25D366]"
              >
                <WhatsAppLogo className="h-6 w-6" />
                Free consultation on WhatsApp
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#7C3AED]/25 bg-gradient-to-br from-purple-50/80 to-white p-6 text-center sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-[#7C3AED]">
              Direct line
            </p>
            <p className="mt-2 text-base text-gray-700 sm:text-lg">
              More questions? Message or call on the same number we use for WhatsApp.
            </p>
            {telHref ? (
              <a
                href={`tel:${telHref}`}
                className="mt-4 inline-flex items-center justify-center gap-2 text-xl font-bold text-gray-900 transition hover:text-[#7C3AED] sm:text-2xl"
              >
                <Phone className="h-6 w-6 shrink-0 text-[#7C3AED]" aria-hidden />
                {display}
              </a>
            ) : (
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Set your WhatsApp number in Admin so this line shows your phone.
              </p>
            )}
            <p className="mt-3 flex items-center justify-center gap-1 text-sm text-gray-500">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Same number for WhatsApp and phone when configured in Admin
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
