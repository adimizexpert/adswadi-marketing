"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function HeroParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        number: { value: 22, density: { enable: true, width: 900, height: 600 } },
        color: { value: ["#7C3AED", "#EC4899", "#C4B5FD"] },
        opacity: { value: { min: 0.06, max: 0.18 } },
        size: { value: { min: 1, max: 2.5 } },
        move: {
          enable: true,
          speed: 0.35,
          direction: "none" as const,
          random: true,
          straight: false,
        },
        links: { enable: false },
      },
      detectRetina: true,
    }),
    []
  );

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-40"
      options={options}
    />
  );
}
