import { useTranslations } from "next-intl";
import { ArrowRight, Users, Globe2, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { HeroMotion } from "./hero-motion";
import { splitStat, type Settings } from "@/lib/settings-fields";

export function Hero({ settings }: { settings: Settings }) {
  const t = useTranslations("hero");
  const s = useTranslations("stats");

  // CMS values like "5,000+" / "98%" split into a number for the animated
  // counter plus a suffix; unparseable input keeps the previous default.
  const stats = [
    { raw: settings.statPlaced, fallback: { value: 5000, suffix: "+" }, label: s("placed"), icon: Users },
    { raw: settings.statCountries, fallback: { value: 8, suffix: "" }, label: s("countries"), icon: Globe2 },
    { raw: settings.statDeployed, fallback: { value: 98, suffix: "%" }, label: s("deployed"), icon: TrendingUp },
  ].map(({ raw, fallback, ...rest }) => ({ ...(splitStat(raw) ?? fallback), ...rest }));

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16">
      {/* soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]"
      />
      <Container>
       <HeroMotion>
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-paper-2 px-3 py-1.5 text-xs text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t("badge")}
            </span>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,4.4rem)] font-semibold leading-[1.02] tracking-tighter-2">
              {t("titleA")}
              <br />
              {t("titleB")}{" "}
              <span className="text-accent">{t("titleAccent")}</span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/jobs" variant="primary" size="lg">
                {t("ctaJobs")} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/request-workers" variant="outline" size="lg">
                {t("ctaRequest")}
              </Button>
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={4 + i} as="div">
                <div className="group relative overflow-hidden rounded-2xl border border-line-2 bg-paper-2/55 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-paper-2/75 hover:shadow-[0_12px_40px_-12px_rgba(29,78,216,0.35)]">
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
                  <dt className="mt-1 text-sm text-ink-mute">{stat.label}</dt>
                </div>
              </Reveal>
            );
          })}
        </dl>
       </HeroMotion>
      </Container>
    </section>
  );
}
