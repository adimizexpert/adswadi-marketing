"use client";

import { motion } from "framer-motion";
import { slideLeftVariant, slideRightVariant } from "@/lib/animations";

const rows = [
  {
    bad: "Bas ek video banao aur upload karo",
    good: "Strategy-first approach — pehle samjho, phir banao",
  },
  {
    bad: "Copy-paste scripts, zero research",
    good: "Deep niche research + psychology-based storytelling",
  },
  {
    bad: "Generic edits, bekar thumbnails",
    good: "Data-driven thumbnails + cinematic editing",
  },
];

export default function WhyUs() {
  return (
    <section className="relative bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="text-center text-2xl font-extrabold text-[#EC4899] sm:text-3xl md:text-4xl"
        >
          90% Agencies Se Alag Kyun Hain Hum?
        </motion.h2>

        <div className="mt-12 space-y-6">
          {rows.map((row, i) => (
            <motion.div
              key={row.bad}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: i * 0.2 }}
              className="grid gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-card md:grid-cols-2 md:gap-0 md:p-0"
            >
              <motion.div
                className="flex gap-3 rounded-xl bg-red-50/80 p-5 md:rounded-l-2xl md:rounded-r-none md:border-r md:border-red-100"
                variants={slideLeftVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="text-xl leading-none"
                  aria-hidden
                  initial={{ x: 0 }}
                  whileInView={{
                    x: [0, -3, 3, -2, 2, 0],
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  ❌
                </motion.span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600/90">
                    Others
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800 sm:text-base">
                    {row.bad}
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex gap-3 rounded-xl bg-emerald-50/80 p-5 md:rounded-l-none md:rounded-r-2xl"
                variants={slideRightVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="text-xl leading-none"
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 500, damping: 16, delay: 0.15 }}
                >
                  ✅
                </motion.span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Adswadi
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800 sm:text-base">
                    {row.good}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
