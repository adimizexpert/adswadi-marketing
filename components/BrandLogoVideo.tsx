"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** MP4 first — iOS Safari does not support WebM; add both under /public for best coverage. */
const VIDEO_MP4 = "/Adswadi.mp4";
const VIDEO_WEBM = "/Adswadi.webm";

const variants = {
  nav: {
    link: "flex min-h-[2rem] shrink-0 items-center rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2",
    video:
      "h-8 max-h-9 w-auto max-w-[min(52vw,11rem)] object-contain object-left sm:h-9 sm:max-w-[13rem]",
    fallback:
      "bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#EC4899] bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl",
  },
  footer: {
    link: "inline-flex min-h-[2.5rem] items-center rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]",
    video:
      "h-10 w-auto max-w-[min(85vw,16rem)] object-contain object-left brightness-110 contrast-105 sm:h-12 sm:max-w-[18rem]",
    fallback:
      "bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4] bg-clip-text text-2xl font-extrabold text-transparent",
  },
} as const;

export type BrandLogoVariant = keyof typeof variants;

export default function BrandLogoVideo({ variant }: { variant: BrandLogoVariant }) {
  const [showWordmark, setShowWordmark] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const v = variants[variant];

  const onVideoError = useCallback(() => {
    setShowWordmark(true);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || showWordmark) return;
    el.play().catch(() => {});
  }, [showWordmark]);

  return (
    <Link
      href="/"
      aria-label="Adswadi SMM home"
      className={v.link}
    >
      {showWordmark ? (
        <span className={v.fallback}>Adswadi SMM</span>
      ) : (
        <video
          ref={videoRef}
          className={v.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={onVideoError}
        >
          <source src={VIDEO_MP4} type="video/mp4" />
          <source src={VIDEO_WEBM} type="video/webm" />
        </video>
      )}
    </Link>
  );
}
