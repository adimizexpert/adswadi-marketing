"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** MP4 first — iOS Safari does not support WebM; add both under /public for best coverage. */
const VIDEO_MP4 = "/Adswadi.mp4";
const VIDEO_WEBM = "/Adswadi.webm";

export default function NavbarLogo() {
  const [showWordmark, setShowWordmark] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoError = useCallback(() => {
    setShowWordmark(true);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || showWordmark) return;
    el.play().catch(() => {
      /* Autoplay blocked — still show first frame if loaded */
    });
  }, [showWordmark]);

  return (
    <Link
      href="/"
      aria-label="Adswadi SSM home"
      className="flex min-h-[2rem] shrink-0 items-center rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
    >
      {showWordmark ? (
        <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#EC4899] bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
          Adswadi SSM
        </span>
      ) : (
        <video
          ref={videoRef}
          className="h-8 max-h-9 w-auto max-w-[min(52vw,11rem)] object-contain object-left sm:h-9 sm:max-w-[13rem]"
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
