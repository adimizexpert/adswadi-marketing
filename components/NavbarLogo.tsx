"use client";

import Link from "next/link";

/** Animated logo: place `public/Adswadi.webm` in the repo. */
export default function NavbarLogo() {
  return (
    <Link
      href="#home"
      className="flex shrink-0 items-center overflow-hidden rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
    >
      <video
        className="h-9 w-auto max-h-10 max-w-[min(100vw-8rem,200px)] object-contain object-left"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Adswadi SSM — Home"
      >
        <source src="/Adswadi.webm" type="video/webm" />
      </video>
    </Link>
  );
}
