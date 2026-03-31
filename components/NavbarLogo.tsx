"use client";

import Link from "next/link";

/** Static wordmark — no video animation (lighter navbar, clearer brand read). */
export default function NavbarLogo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
    >
      <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#EC4899] bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
        Adswadi SSM
      </span>
    </Link>
  );
}
