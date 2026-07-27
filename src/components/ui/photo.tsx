"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Business-context image with a crisp, on-brand treatment:
 *  - clarity grade (contrast/saturation bump)
 *  - a brand-navy gradient for depth + caption legibility
 *  - a subtle blue tint that lifts on hover to reveal full colour
 * Falls back to a clean labelled placeholder until the file exists at `src`.
 *
 * Pass `fill` to make the figure fill its parent (for collages / bento grids);
 * otherwise it uses the `ratio` aspect ratio.
 */
export function Photo({
  src,
  alt,
  ratio = "3 / 2",
  fill = false,
  className,
  caption,
  priority = false,
  rounded = "rounded-2xl",
  overlay = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  quality = 90,
}: {
  src: string;
  alt: string;
  ratio?: string;
  fill?: boolean;
  className?: string;
  caption?: string;
  priority?: boolean;
  rounded?: string;
  overlay?: boolean;
  sizes?: string;
  quality?: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={cn(
        "group relative overflow-hidden border border-line bg-paper-2 ring-1 ring-inset ring-black/[0.03]",
        rounded,
        fill ? "h-full w-full" : "",
        className
      )}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      {failed ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2 text-ink-mute">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">{alt || "Add photo"}</span>
            <code className="rounded bg-paper px-2 py-0.5 text-[11px] text-ink-mute">
              {src.replace("/photos/", "")}
            </code>
          </div>
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            priority={priority}
            onError={() => setFailed(true)}
            className="object-cover contrast-[1.06] saturate-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {overlay && (
            <>
              {/* brand-navy depth gradient (also aids caption legibility) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel/45 via-transparent to-transparent" />
              {/* cinematic brand colour-blend (blue in shadows, gold highlight) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/60 via-accent/15 to-gold/25 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60" />
              {/* light blue brand tint that clears on hover for full clarity */}
              <div className="pointer-events-none absolute inset-0 bg-accent/10 opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
              {/* soft light sweep that crosses the image on hover */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute inset-y-0 -left-3/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />
              </div>
              {/* thin brand ring on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-accent/0 transition-all duration-500 group-hover:ring-accent/30" />
            </>
          )}
        </>
      )}

      {caption && (
        <figcaption className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-panel/75 px-3 py-1.5 text-xs font-medium text-panel-ink backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
