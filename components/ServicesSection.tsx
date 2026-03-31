"use client";

import { motion } from "framer-motion";
import { Clapperboard, FileText, ImageIcon, type LucideIcon } from "lucide-react";
import type { CmsService } from "@/lib/api";
import { staggerContainer, fadeUpVariant } from "@/lib/animations";
import { useIsMobile } from "@/lib/useIsMobile";

const LUCIDE_BY_NAME: Record<string, LucideIcon> = {
  filetext: FileText,
  clapperboard: Clapperboard,
  image: ImageIcon,
  imageicon: ImageIcon,
};

function ServiceVisual({ icon }: { icon: string | null }) {
  const raw = icon?.trim() || "";
  const key = raw.toLowerCase().replace(/\s+/g, "");
  const Lucide = LUCIDE_BY_NAME[key];
  if (Lucide) {
    return (
      <Lucide className="h-8 w-8 text-[#7C3AED]" strokeWidth={1.75} aria-hidden />
    );
  }
  return (
    <FileText className="h-8 w-8 text-[#7C3AED]" strokeWidth={1.75} aria-hidden />
  );
}

export default function ServicesSection({
  services,
}: {
  services: CmsService[];
}) {
  const isMobile = useIsMobile();
  const lift = isMobile ? -3 : -8;

  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-white py-16 sm:py-24"
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
            What we do
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            A full YouTube growth system built for you.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {services.map((s) => (
            <motion.article
              key={s.id}
              variants={fadeUpVariant}
              whileHover={{
                y: lift,
                transition: { type: "spring", stiffness: 320, damping: 24 },
              }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-2xl border border-transparent bg-white p-8 shadow-card transition-colors duration-300 hover:border-purple-200 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 focus-within:border-purple-200"
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100"
                aria-hidden
                whileHover={{ rotate: 10, scale: isMobile ? 1.05 : 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <ServiceVisual icon={s.icon} />
              </motion.div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {s.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
