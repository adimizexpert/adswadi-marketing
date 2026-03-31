"use client";

import { motion } from "framer-motion";
import { staggerContainer, scaleUpVariant } from "@/lib/animations";

const items = [
  { client: "Rohan Vlogs", views: "12" },
  { client: "Tech Hindi Pro", views: "8.5" },
  { client: "Finance With Neha", views: "15" },
  { client: "Cooking Studio", views: "6.2" },
  { client: "Gaming Zone IN", views: "22" },
  { client: "Motivation Daily", views: "9.8" },
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
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
          <h2 className="text-2xl font-extrabold text-[#EC4899] sm:text-3xl md:text-4xl">
            Let the work speak
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Real results from real channels.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          {items.map((item) => (
            <motion.article
              key={item.client}
              variants={scaleUpVariant}
              transition={{ duration: 0.45 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              tabIndex={0}
              className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-card outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              {/* Replace these with actual thumbnail images */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
                <div
                  className="portfolio-shimmer-bg absolute inset-0 opacity-90"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.12),transparent_50%)]" />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                  <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-gray-500 shadow">
                    Thumbnail
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-4 pt-16 transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                  <p className="text-sm font-semibold text-white">
                    Client: {item.client}
                  </p>
                  <p className="mt-1 text-sm text-white/90">
                    Views: {item.views} Lakh+
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
