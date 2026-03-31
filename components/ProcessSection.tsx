"use client";

import { motion } from "framer-motion";
import {
  Clapperboard,
  LineChart,
  PenLine,
  Target,
  type LucideIcon,
} from "lucide-react";

const steps: {
  num: number;
  Icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    num: 1,
    Icon: Target,
    title: "Strategy",
    body: "We map your niche, audience, and goals in depth before we produce.",
  },
  {
    num: 2,
    Icon: PenLine,
    title: "Script & Plan",
    body: "Viral hooks, deep research, complete episode planning",
  },
  {
    num: 3,
    Icon: Clapperboard,
    title: "Production",
    body: "From script through final edit, our team runs production end to end.",
  },
  {
    num: 4,
    Icon: LineChart,
    title: "Upload & Analyze",
    body: "Video upload, search-style result tracking, and continuous iteration",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative scroll-mt-24 bg-gradient-to-b from-[#FAF5FF] to-[#F0F4FF] py-16 sm:py-24"
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
            How Adswadi SSM works
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Simple. Transparent. Result-driven.
          </p>
        </motion.div>

        {/* Mobile: vertical */}
        <div className="relative mt-14 md:hidden">
          <motion.div
            className="absolute left-[1.35rem] top-4 bottom-4 w-0.5 origin-top bg-purple-300"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />
          <ol className="relative space-y-10">
            {steps.map((step, i) => {
              const StepIcon = step.Icon;
              return (
              <li key={step.num} className="flex gap-4 pl-1">
                <motion.div
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-sm font-bold text-white shadow-md"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: [0, 1.2, 1], opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 18,
                    delay: i * 0.3,
                  }}
                >
                  {step.num}
                </motion.div>
                <motion.div
                  className="rounded-2xl border border-purple-100 bg-white p-5 shadow-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.3 + 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-lg font-bold text-gray-900">
                    <motion.span
                      className="mr-2 inline-flex align-middle text-[#7C3AED]"
                      whileHover={{ y: [-2, 0, -2] }}
                      transition={{ duration: 0.4 }}
                    >
                      <span aria-hidden>
                        <StepIcon className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </motion.span>
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.body}
                  </p>
                </motion.div>
              </li>
            );
            })}
          </ol>
        </div>

        {/* Desktop */}
        <div className="relative mt-14 hidden md:block">
          <motion.div
            className="absolute left-[8%] right-[8%] top-[1.35rem] h-0.5 origin-left rounded-full bg-purple-300"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-4 gap-4">
            {steps.map((step, i) => {
              const StepIcon = step.Icon;
              return (
              <li key={step.num} className="flex flex-col items-center text-center">
                <motion.div
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-sm font-bold text-white shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: [0, 1.2, 1], opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 18,
                    delay: i * 0.3,
                  }}
                >
                  {step.num}
                </motion.div>
                <motion.div
                  className="mt-6 flex flex-1 flex-col rounded-2xl border border-purple-100 bg-white p-6 shadow-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.3 + 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-base font-bold text-gray-900">
                    <motion.span
                      className="mr-2 inline-flex align-middle text-[#7C3AED]"
                      whileHover={{ y: [-3, 0, -3] }}
                      transition={{ duration: 0.35 }}
                    >
                      <span aria-hidden>
                        <StepIcon className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </motion.span>
                    {step.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {step.body}
                  </p>
                </motion.div>
              </li>
            );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
