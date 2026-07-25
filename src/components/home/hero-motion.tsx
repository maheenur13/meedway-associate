"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/lib/use-media-query";

/**
 * Gently drifts the hero content up and fades it — but only as it actually
 * leaves the viewport (tied to the element's own scroll progress, so it stays
 * fully visible while on screen). Desktop only.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return <div>{children}</div>;
  return <HeroMotionInner>{children}</HeroMotionInner>;
}

function HeroMotionInner({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Stays fully opaque until it's ~65% scrolled out, then fades.
  const opacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
