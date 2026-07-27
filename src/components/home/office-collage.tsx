"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Photo } from "@/components/ui/photo";
import { siteConfig } from "@/lib/site-config";
import { useIsDesktop } from "@/lib/use-media-query";

/**
 * The SEPARATED state is a clean, aligned bento grid (equal gaps) — this is the
 * base CSS layout. At rest the two right photos are translated inward to overlap
 * the main photo (the "collage" look); as the section reaches the centre of the
 * viewport those offsets ease to zero, so the photos detach into the tidy grid.
 * Desktop only; mobile shows the static grid.
 */
export function OfficeCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 1 = separated grid (centred), 0 = collage (default). Plateaus at 1 while the
  // section is roughly centred so the tidy grid holds for a comfortable range.
  const s = useTransform(
    scrollYProgress,
    [0.12, 0.42, 0.58, 0.88],
    [0, 1, 1, 0]
  );

  // offsets that gather the right cards onto the main photo when NOT separated
  const topX = useTransform(s, [0, 1], [-52, 0]);
  const topY = useTransform(s, [0, 1], [42, 0]);
  const botX = useTransform(s, [0, 1], [-52, 0]);
  const botY = useTransform(s, [0, 1], [-42, 0]);
  const mainScale = useTransform(s, [0, 1], [1.05, 1]);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none"
    >
      {/* main — left column, full height */}
      <motion.div
        style={isDesktop ? { scale: mainScale } : undefined}
        className="absolute left-0 top-0 z-10 h-full w-[55%] origin-left"
      >
        <Photo
          src="/photos/office/office-1.jpg"
          alt="Reception at our Banani office"
          fill
          priority
          className="h-full w-full shadow-2xl shadow-panel/20"
          caption={`${siteConfig.short} · Banani`}
          sizes="(max-width: 768px) 55vw, 480px"
        />
      </motion.div>

      {/* top-right */}
      <motion.div
        style={isDesktop ? { x: topX, y: topY } : undefined}
        className="absolute right-0 top-0 z-20 h-[48%] w-[42%]"
      >
        <Photo
          src="/photos/office/office-2.png"
          alt="Candidate waiting area"
          fill
          className="h-full w-full shadow-2xl shadow-panel/30 ring-2 ring-paper"
          sizes="(max-width: 768px) 45vw, 360px"
        />
      </motion.div>

      {/* bottom-right — aligned under the top card with an equal gap */}
      <motion.div
        style={isDesktop ? { x: botX, y: botY } : undefined}
        className="absolute right-0 top-[52%] z-20 h-[48%] w-[42%]"
      >
        <Photo
          src="/photos/process/processing.jpg"
          alt="Our processing section at work"
          fill
          className="h-full w-full shadow-2xl shadow-panel/30 ring-2 ring-paper"
          sizes="(max-width: 768px) 50vw, 400px"
        />
      </motion.div>

    </div>
  );
}
