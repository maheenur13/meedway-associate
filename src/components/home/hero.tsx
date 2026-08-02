import { useTranslations } from "next-intl";
import { ArrowRight, Users, Globe2, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { HeroMotion } from "./hero-motion";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";
import { splitStat, type Settings } from "@/lib/settings-fields";

export function Hero({ settings }: { settings: Settings }) {
  const t = useTranslations("hero");
  const s = useTranslations("stats");

  // CMS values like "5,000+" / "98%" split into a number for the animated
  // counter plus a suffix; unparseable input keeps the previous default.
  const stats = [
    { raw: settings.statPlaced, fallback: { value: 5000, suffix: "+" }, label: s("placed"), icon: Users },
    { raw: settings.statCountries, fallback: { value: 8, suffix: "" }, label: s("countries"), icon: Globe2 },
    { raw: settings.statVacancies, fallback: { value: 200, suffix: "+" }, label: s("vacancies"), icon: Briefcase },
  ].map(({ raw, fallback, ...rest }) => ({ ...(splitStat(raw) ?? fallback), ...rest }));

  // Destination markets, in the order the banner cycles them. `lift` evens out
  // the different shooting conditions so the cross-fade doesn't flicker —
  // see HeroSlide for the measured luminances.
  const slides: HeroSlide[] = [
    { key: "dubai", src: "/photos/hero/skyline-dubai.jpg" },
    { key: "malaysia", src: "/photos/hero/skyline-malaysia.jpg", lift: 1.1 },
    { key: "saudi", src: "/photos/hero/skyline-saudi.jpg", lift: 1.18 },
  ].map(({ key, ...rest }) => ({
    ...rest,
    city: t(`slides.${key}.city`),
    alt: t(`slides.${key}.alt`),
  }));

  return (
    <section className="relative pb-16">
     <HeroMotion>
      {/* Full-bleed skyline banner with the headline sitting on top of it. */}
      <div className="relative h-[clamp(440px,64vh,620px)] w-full overflow-hidden">
        <HeroSlideshow slides={slides} />

        {/* Scrim: heavy on the left so the headline stays legible, clearing to
            the right so the skyline still reads. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-panel/90 via-panel/65 to-panel/20"
        />


        {/* Below lg the copy is full-width, so it has to sit above the
            slideshow's badge row. From lg the copy is left and the controls
            are bottom-right, and they no longer share horizontal space. */}
        <Container className="relative flex h-full items-center pb-14 lg:pb-0">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-panel-ink backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {t("badge", { licence: settings.licence })}
              </span>
            </Reveal>

            <Reveal delay={1}>
              {/* leading is looser than the site's usual 1.02 so the highlight
                  block below clears the line above it — a padded inline box is
                  taller than the line spacing at 1.02. */}
              <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,4.4rem)] font-semibold leading-[1.32] tracking-tighter-2 text-panel-ink">
                {t("titleA")}
                <br />
                {t("titleB")}{" "}
                {/* box-decoration-clone so the block wraps per line rather than
                    stretching one box across the break on narrow screens. */}
                <span className="box-decoration-clone inline-block rounded-xl bg-accent-on-panel-fill px-3 py-1.5 leading-none text-white sm:py-2">
                  {t("titleAccent")}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-panel-ink/80">
                {t("subtitle")}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/jobs" variant="primary" size="lg">
                  {t("ctaJobs")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/request-workers"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-panel-ink hover:bg-white/10"
                >
                  {t("ctaRequest")}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <Container>
        {/* From lg the cards straddle the bottom edge of the banner. Below that
            they sit under it — floated, a full-width card lands on top of the
            slideshow's badge and progress bars. */}
        <dl className="relative z-10 mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 lg:-mt-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={4 + i} as="div">
                {/* Page-surface card, not a panel one: these straddle the banner
                    edge but sit mostly on the page below it, so they follow the
                    same language as every other card on the site and invert with
                    the theme. Kept at /85 + blur for the frosted look over the
                    photo — opaque enough not to wash out against a bright sky. */}
                <div className="group relative overflow-hidden rounded-2xl border border-line-2 bg-paper-2/85 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-paper-2/95 hover:shadow-[0_12px_40px_-12px_rgba(48,40,120,0.35)]">
                  {/* accent sheen that sweeps on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-300 group-hover:scale-150" />
                  </div>
                  <dd className="font-display mt-4 text-4xl font-semibold tracking-tighter-2">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                  {/* ink-soft, not ink-mute: at 14px over a frosted card the
                      muted grey only reaches ~3.3:1. */}
                  <dt className="mt-1 text-sm text-ink-soft">{stat.label}</dt>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </Container>
     </HeroMotion>
    </section>
  );
}
