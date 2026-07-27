import { Container } from "./container";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

/** Standard hero band for inner pages: eyebrow + large title + intro. */
export function PageHero({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-14 pb-10 sm:pt-20", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[380px] w-[380px] rounded-full bg-accent/10 blur-[120px]"
      />
      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <span className="inline-block h-px w-6 bg-accent/70" />
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tighter-2">
              {title}
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={2}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {intro}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
