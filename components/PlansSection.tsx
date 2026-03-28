"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import clsx from "clsx";
import type { CmsPlan } from "@/lib/api";
import { scaleUpVariant, staggerContainer } from "@/lib/animations";
import PlanPriceDisplay from "@/components/PlanPriceDisplay";
import { useIsMobile } from "@/lib/useIsMobile";

const tierRing: Record<string, string> = {
  silver:
    "from-slate-200 via-slate-100 to-slate-200 shadow-[0_0_0_1px_rgba(226,232,240,0.9)]",
  gold: "from-[#FDE68A] via-[#FBBF24] to-[#D97706] shadow-[0_0_32px_-4px_rgba(124,58,237,0.45)] ring-2 ring-[#7C3AED]/30",
  diamond:
    "from-cyan-200 via-sky-200 to-indigo-200 shadow-[0_0_0_1px_rgba(165,180,252,0.6)]",
};

function normalizeFeatures(raw: CmsPlan["features"]): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

const listParent = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.08, delayChildren: 0.02 },
  },
};

const listItem = {
  rest: { opacity: 0.88 },
  hover: { opacity: 1 },
};

export default function PlansSection({ plans }: { plans: CmsPlan[] }) {
  const isMobile = useIsMobile();
  const hoverLift = isMobile ? -4 : -10;
  const hoverScale = isMobile ? 1 : 1.02;

  return (
    <section
      id="plans"
      className="relative scroll-mt-24 bg-gradient-to-b from-white to-[#FAF5FF] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h2 className="text-2xl font-extrabold text-[#7C3AED] sm:text-3xl md:text-4xl">
            Apna Plan Chunein
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            No hidden charges. No lock-in. Sirf results.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-stretch"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {plans.map((plan) => {
            const tier = plan.name.toLowerCase();
            const ring = tierRing[tier] ?? tierRing.silver;
            const featured = Boolean(plan.badge);
            const features = normalizeFeatures(plan.features);

            return (
              <motion.div
                key={plan.id}
                variants={scaleUpVariant}
                whileHover={{
                  y: hoverLift,
                  scale: hoverScale,
                  transition: { type: "spring", stiffness: 260, damping: 22 },
                }}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  "relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-[2px]",
                  featured
                    ? "plan-gold-ring z-10 lg:scale-[1.05]"
                    : ring
                )}
              >
                {featured && plan.badge && (
                  <motion.span
                    className="absolute -top-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(236,72,153,0.55)]"
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    {plan.badge}
                  </motion.span>
                )}
                <div className="relative z-[1] flex h-full flex-col rounded-[14px] bg-white p-8 shadow-inner">
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                      {plan.name.toUpperCase()}
                    </p>
                    <p className="mt-2 flex items-baseline justify-center gap-0.5">
                      <PlanPriceDisplay
                        price={plan.price}
                        className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
                      />
                      <span className="text-gray-500">/month</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#7C3AED]">
                      [{plan.label}]
                    </p>
                  </div>
                  <motion.ul
                    className="mt-8 flex flex-1 flex-col gap-3 text-sm text-gray-700"
                    variants={listParent}
                    initial="rest"
                    whileHover="hover"
                  >
                    {features.map((f) => (
                      <motion.li
                        key={f}
                        className="flex gap-2"
                        variants={listItem}
                      >
                        <Check
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        <span>{f}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      "relative mt-8 inline-flex w-full items-center justify-center overflow-hidden rounded-full border-2 border-[#7C3AED] px-6 py-3 text-center text-sm font-semibold text-[#7C3AED] transition-colors hover:bg-[#7C3AED] hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED]",
                      featured &&
                        "bg-gradient-to-r from-[#7C3AED]/10 via-white to-[#EC4899]/10 bg-[length:200%_auto] hover:bg-none"
                    )}
                  >
                    {featured && (
                      <span
                        className="pointer-events-none absolute inset-0 opacity-30"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                          animation: "shimmer 2.5s ease-in-out infinite",
                        }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-[1]">{plan.cta_text}</span>
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
