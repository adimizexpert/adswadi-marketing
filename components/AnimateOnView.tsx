"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { fadeUpVariant } from "@/lib/animations";

type AnimateOnViewProps = {
  children: React.ReactNode;
  variant?: Variants;
  delay?: number;
  className?: string;
};

export default function AnimateOnView({
  children,
  variant = fadeUpVariant,
  delay = 0,
  className,
}: AnimateOnViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variant}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}
