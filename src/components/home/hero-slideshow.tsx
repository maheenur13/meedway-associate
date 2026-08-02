"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HeroParallax } from "./hero-parallax";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  src: string;
  alt: string;
  /** City + country shown in the badge, e.g. "Dubai, UAE". */
  city: string;
  /**
   * Per-image brightness correction. The three photos were shot in different
   * light (measured mean luminance 163 / 132 / 118), and without this the
   * transition reads as a brightness step rather than a change of place.
   */
  lift?: number;
};

const HOLD_MS = 6500;
const WIPE_MS = 900;
/** Site easing — the same expo-out curve <Reveal> uses. */
const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The incoming photo is uncovered by a vertical edge sweeping right to left —
 * no cross-fade, so neither image is ever ghosted or half-transparent. The
 * photo itself doesn't travel; only the edge does, which keeps it calm enough
 * to sit behind the headline, and echoes the vertical lines of the skylines.
 *
 * Every slide stays mounted and fully painted; only stacking order and the
 * incoming slide's clip change. That avoids remounting <Image> mid-transition,
 * which would risk a decode flash.
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  // "closed" is the pre-wipe state, applied with transitions off, so the next
  // frame can animate to "open". Without the two phases the browser coalesces
  // both changes and no transition runs.
  const [phase, setPhase] = useState<"closed" | "open">("open");
  const raf = useRef<number[]>([]);

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        const target = ((next % slides.length) + slides.length) % slides.length;
        if (target === cur) return cur;
        setPrev(cur);
        setPhase("closed");
        return target;
      });
    },
    [slides.length]
  );

  // Flip to "open" one frame after "closed" has painted. The timeout is a
  // backstop: browsers pause rAF in background tabs, and without it a slide
  // that changed while hidden would stay clipped to nothing. Long enough that
  // rAF always wins in a visible tab, so the wipe still runs there.
  useEffect(() => {
    if (phase !== "closed") return;
    const ids = raf.current;
    ids.push(
      requestAnimationFrame(() => {
        ids.push(requestAnimationFrame(() => setPhase("open")));
      })
    );
    const fallback = setTimeout(() => setPhase("open"), 200);
    return () => {
      ids.forEach(cancelAnimationFrame);
      ids.length = 0;
      clearTimeout(fallback);
    };
  }, [phase]);

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const id = setTimeout(() => go(index + 1), HOLD_MS);
    return () => clearTimeout(id);
  }, [index, reduced, slides.length, go]);

  const wiping = phase === "closed";

  return (
    <>
      <HeroParallax>
        {slides.map((slide, i) => {
          const active = i === index;
          const behind = i === prev;
          return (
            <div
              key={slide.src}
              className="absolute inset-0"
              style={{
                // Incoming on top, the one it is covering just beneath, the
                // rest parked at the back where they can be reset unseen.
                zIndex: active ? 30 : behind ? 20 : 10,
                clipPath:
                  active && wiping && !reduced ? "inset(0 0 0 100%)" : "inset(0 0 0 0)",
                transition:
                  active && !wiping && !reduced
                    ? `clip-path ${WIPE_MS}ms ${EASE_CSS}`
                    : "none",
                willChange: active ? "clip-path" : undefined,
                filter: slide.lift ? `brightness(${slide.lift})` : undefined,
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                // Live slide drifts 1.08 → 1 for longer than it is on screen,
                // so it never settles. A slide only resets to 1.08 once it is
                // parked at the back and fully covered — resetting while it is
                // still the "behind" layer would show as a jump mid-wipe.
                animate={{ scale: active || behind || reduced ? 1 : 1.08 }}
                transition={{ duration: active && !reduced ? 8 : 0, ease: "linear" }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  quality={90}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  className="object-cover"
                />
              </motion.div>

              {/* Gold hairline riding the leading edge of the wipe. It ends up
                  past the left edge, where the banner's overflow clips it. */}
              {active && !reduced && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 z-10 block w-px bg-gold"
                  style={{
                    left: wiping ? "100%" : "0%",
                    transition: wiping ? "none" : `left ${WIPE_MS}ms ${EASE_CSS}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </HeroParallax>

      {/* Controls sit above the scrim (which is a later sibling) via z-20. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        {/* Below lg the stat cards sit under the banner, so the controls only
            need to clear the copy. From lg they float 48px up over the banner,
            and pb-14 lifts the controls clear of that band. */}
        <div className="mx-auto flex w-full max-w-6xl items-end justify-end px-5 pb-5 sm:px-6 lg:px-8 lg:pb-14">
          {/* One compact row until lg — stacking the badge above the dots needs
              ~56px, which the narrower banner can't spare without running into
              the copy. */}
          <div className="flex w-full items-center justify-between lg:w-auto lg:flex-col lg:items-end lg:gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={slides[index].city}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-lg bg-panel/70 px-3 py-1.5 text-xs font-medium text-panel-ink backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {slides[index].city}
              </motion.span>
            </AnimatePresence>

            <div className="pointer-events-auto flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={slide.city}
                  aria-current={i === index}
                  className="group h-4 w-10 py-1.5"
                >
                  <span
                    className={cn(
                      "relative block h-1 w-full overflow-hidden rounded-full transition-colors",
                      i === index ? "bg-white/30" : "bg-white/20 group-hover:bg-white/35"
                    )}
                  >
                    {/* Gold fill runs the length of the hold, so the bar doubles
                        as a countdown to the next slide. */}
                    {i === index && !reduced && (
                      <motion.span
                        key={index}
                        className="absolute inset-y-0 left-0 block rounded-full bg-gold"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
                      />
                    )}
                    {i === index && reduced && (
                      <span className="absolute inset-0 block rounded-full bg-gold" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
