"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { WHATSAPP_URL } from "@/lib/constants";
import NavbarLogo from "@/components/NavbarLogo";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import { staggerContainer } from "@/lib/animations";

type NavbarProps = { whatsappUrl?: string };

const navItems = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "YouTube", href: "/#youtube" },
  { label: "Instagram", href: "/#instagram" },
  { label: "UGC", href: "/#ugc" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({ whatsappUrl = WHATSAPP_URL }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,255,0.35)", "rgba(255,255,255,0.7)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    [
      "0px 0px 0px rgba(124,58,237,0)",
      "0 12px 32px rgba(124,58,237,0.12)",
    ]
  );
  const blurPx = useTransform(scrollY, [0, 50], [10, 22]);
  const backdropFilter = useMotionTemplate`saturate(180%) blur(${blurPx}px)`;

  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 50);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-purple-100/80 shadow-lg shadow-purple-100/50"
          : "border-transparent"
      )}
      style={{
        backgroundColor: headerBg,
        boxShadow: headerShadow,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavbarLogo />

        <ul className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="nav-link-underline text-gray-700 transition-colors hover:text-[#7C3AED] focus-visible:text-[#7C3AED] focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <WhatsAppLogo className="h-4 w-4 shrink-0" />
            Free Consultation
          </a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-gray-800 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.25 }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative z-50 overflow-hidden border-b border-purple-100 bg-white/95 backdrop-blur-xl md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.ul
                className="flex flex-col gap-1 px-4 py-4 text-base font-medium text-gray-800"
                variants={staggerContainer}
                initial="hidden"
                animate={open ? "visible" : "hidden"}
              >
                {navItems.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-lg py-2 hover:bg-purple-50 hover:text-[#7C3AED] focus-visible:bg-purple-50 focus-visible:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  className="pt-2"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    <WhatsAppLogo className="h-4 w-4 shrink-0" />
                    Free Consultation
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
