"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WhatsAppLogo from "@/components/WhatsAppLogo";

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export default function CTASection({
  headline,
  subtext,
  whatsappUrl,
}: {
  headline: string;
  subtext: string;
  whatsappUrl: string;
}) {
  const words = splitWords(headline);

  return (
    <section
      id="contact"
      className="cta-gradient-animated relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="mr-[0.3em] inline-block last:mr-0"
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 20,
                  delay: i * 0.1,
                }}
              >
                {w}
              </motion.span>
            ))}
          </h2>
          <p className="mt-4 text-base text-white/80 sm:text-lg">{subtext}</p>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="animate-breathe mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-10 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white sm:text-lg"
          >
            <WhatsAppLogo className="h-6 w-6 shrink-0" />
            Message us on WhatsApp
            <ArrowRight className="h-5 w-5" aria-hidden />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
