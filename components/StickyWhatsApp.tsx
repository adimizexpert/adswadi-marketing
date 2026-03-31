"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import { WHATSAPP_URL } from "@/lib/constants";

export default function StickyWhatsApp({
  whatsappUrl = WHATSAPP_URL,
}: {
  whatsappUrl?: string;
}) {
  const [hideNearCta, setHideNearCta] = useState(false);

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

  const visible = !hideNearCta;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on WhatsApp"
            className="wa-ping-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/25 ring-2 ring-white/35 transition-transform focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95"
          >
            <WhatsAppLogo className="h-7 w-7 shrink-0" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
