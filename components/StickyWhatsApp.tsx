"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import { WHATSAPP_URL } from "@/lib/constants";

export default function StickyWhatsApp({
  whatsappUrl = WHATSAPP_URL,
}: {
  whatsappUrl?: string;
}) {
  const [showBar, setShowBar] = useState(false);
  const [hideNearCta, setHideNearCta] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowBar(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setHideNearCta(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = showBar && !hideNearCta;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-ping-ring relative flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-green-900/20 ring-2 ring-white/30 transition-transform focus-visible:outline focus-visible:ring-2 focus-visible:ring-white active:scale-95"
          >
            <WhatsAppLogo className="h-5 w-5 shrink-0" />
            WhatsApp Par Baat Karein
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
