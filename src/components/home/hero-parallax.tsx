"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsDesktop } from "@/lib/use-media-query";

/**
 * Parallax for the hero banner image: as the page scrolls, the photo drifts
 * down inside its (overflow-hidden) frame, so it travels slower than the page.
 *
 * `isolate` is load-bearing. The slideshow stacks its slides with z-index, and
 * without a stacking context here those z-indexes compete with the banner's
 * scrim and headline instead of each other — the photo then paints over both,
 * leaving an unscrimmed image and no visible copy.
 *
 * The wrapper is taller than the frame and offset upwards; without that
 * overscan, translating the photo would expose empty strips at top and bottom.
 * Travel is a share of the *inner* element, so the sum that must stay under the
 * slack is travel × height:
 *   mobile   10% × 1.30 = 13% of the frame, against 15% of slack
 *   desktop  20% × 1.80 = 36% of the frame, against 40% of slack
 * The mobile frame is shallower on purpose: the banner is portrait there, and a
 * 180%-tall inner frame would crop the skyline to a narrow vertical slice.
 *
 * Desktop also has to out-run <HeroMotion>, which pulls the whole hero up ~70px
 * over the same scroll range; too little travel and the two cancel out.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className="absolute inset-0 isolate">{children}</div>;
  return <HeroParallaxInner>{children}</HeroParallaxInner>;
}

function HeroParallaxInner({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", isDesktop ? "20%" : "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 isolate overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform md:-top-[40%] md:h-[180%]"
      >
        {children}
      </motion.div>
    </div>
  );
}
