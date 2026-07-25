"use client";

import { useEffect, useRef } from "react";

/**
 * Layered aurora background:
 *  - slow-drifting, heavily-blurred colour blobs (with a gentle hue drift)
 *  - a soft light glow that tracks the cursor directly
 *  - a faint dot-grid for structure and film grain for texture
 * Everything parallaxes subtly toward the pointer. Honors reduced-motion.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      gx = window.innerWidth / 2,
      gy = window.innerHeight / 2,
      pgx = gx,
      pgy = gy,
      sy = 0,
      psy = 0,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      gx = e.clientX;
      gy = e.clientY;
    };
    const onScroll = () => {
      sy = window.scrollY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      pgx += (gx - pgx) * 0.08;
      pgy += (gy - pgy) * 0.08;
      psy += (sy - psy) * 0.1;
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      el.style.setProperty("--cx", pgx.toFixed(1) + "px");
      el.style.setProperty("--cy", pgy.toFixed(1) + "px");
      el.style.setProperty("--sy", psy.toFixed(1));
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const blobs = [
    { color: "rgba(99, 102, 241, 0.42)", size: "46vw", top: "-8%", left: "-6%", anim: "aurora-a 22s ease-in-out infinite", strength: 34, scroll: 0.12 },
    { color: "rgba(139, 92, 246, 0.36)", size: "42vw", top: "6%", left: "58%", anim: "aurora-b 26s ease-in-out infinite", strength: -46, scroll: 0.24 },
    { color: "rgba(96, 165, 250, 0.30)", size: "40vw", top: "48%", left: "18%", anim: "aurora-c 30s ease-in-out infinite", strength: 26, scroll: -0.16 },
    { color: "rgba(129, 140, 248, 0.26)", size: "34vw", top: "40%", left: "66%", anim: "aurora-a 28s ease-in-out infinite", strength: -30, scroll: 0.3 },
  ];

  const grain =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--mx" as string]: 0, ["--my" as string]: 0, ["--cx" as string]: "50%", ["--cy" as string]: "50%", ["--sy" as string]: 0 }}
    >
      {/* colour blobs with slow hue drift */}
      <div className="aurora-hue absolute inset-0">
        {blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              left: b.left,
              transform: `translate3d(calc(var(--mx) * ${b.strength}px), calc(var(--my) * ${b.strength}px + var(--sy, 0) * ${b.scroll}px), 0)`,
            }}
          >
            <div
              className="aurora-blob"
              style={{
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at center, ${b.color} 0%, transparent 68%)`,
                animation: b.anim,
              }}
            />
          </div>
        ))}
      </div>

      {/* cursor-tracking light glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(340px circle at var(--cx) var(--cy), rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      {/* faint dot-grid for structure, masked to fade at edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--grid-dot) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)",
        }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grain,
          backgroundSize: "140px 140px",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />

      {/* soft wash to keep it airy on the off-white paper */}
      <div className="absolute inset-0 bg-paper/25" />
    </div>
  );
}
