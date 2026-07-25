"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/lib/use-media-query";

/**
 * Translates children vertically as the element scrolls through the viewport
 * (desktop only — on mobile the extra motion fights the layout, so it's off).
 */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return <div className={className}>{children}</div>;
  return (
    <ParallaxInner speed={speed} className={className}>
      {children}
    </ParallaxInner>
  );
}

// Inner component so useScroll's target ref is always attached to a rendered node.
function ParallaxInner({
  children,
  speed,
  className,
}: {
  children: ReactNode;
  speed: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
