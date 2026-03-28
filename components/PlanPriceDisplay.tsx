"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

export default function PlanPriceDisplay({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <span ref={ref} className={clsx("tabular-nums", className)}>
      {inView ? (
        <CountUp
          end={price}
          duration={1.5}
          prefix="₹"
          separator=","
          useEasing
        />
      ) : (
        `₹${price.toLocaleString("en-IN")}`
      )}
    </span>
  );
}
