"use client";

import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { scaleUpVariant, staggerContainer } from "@/lib/animations";
import { useIsMobile } from "@/lib/useIsMobile";

const pains = [
  {
    title: "You grind for hours but views still do not show up",
    sub: "Effort has to point in the right direction or you only get burnout.",
  },
  {
    title:
      "Writing scripts, editing, and thumbnails alone is impossible at scale",
    sub: "Each skill is different; one person cannot cover every piece at elite level.",
  },
  {
    title: "Other creators move ahead while you stay stuck",
    sub: "Without a system, growth stalls and consistency feels impossible.",
  },
];

export default function ProblemSection() {
  const isMobile = useIsMobile();
  const lift = isMobile ? -3 : -6;

  return (
    <section className="relative bg-gradient-to-b from-[#F0F4FF] to-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="text-center text-2xl font-extrabold text-[#7C3AED] sm:text-3xl md:text-4xl"
        >
          Sound familiar?
        </motion.h2>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {pains.map((item) => (
            <motion.article
              key={item.title}
              variants={scaleUpVariant}
              whileHover={{
                y: lift,
                boxShadow: "0 20px 40px rgba(124,58,237,0.12)",
                transition: { type: "spring", stiffness: 300, damping: 22 },
              }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-2xl border border-purple-100 bg-white p-6 text-left shadow-card"
            >
              <motion.span
                className="inline-flex text-rose-600"
                aria-hidden
                whileHover={{
                  rotate: [-5, 5, -5, 0],
                  transition: { duration: 0.45 },
                }}
              >
                <CircleX className="h-7 w-7" strokeWidth={2} />
              </motion.span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.sub}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center text-lg font-semibold sm:text-xl"
        >
          <motion.span
            className="inline-block"
            animate={{ color: ["#EC4899", "#7C3AED", "#EC4899"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            Adswadi SMM is built to fix exactly this.
          </motion.span>
        </motion.p>
      </div>
    </section>
  );
}
