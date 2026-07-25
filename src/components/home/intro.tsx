import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { siteConfig } from "@/lib/site-config";
import { MapPin } from "lucide-react";

export function Intro() {
  const t = useTranslations("intro");

  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-xl">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                {t("eyebrow")}
              </span>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-display mt-3 text-[clamp(1.7rem,3.5vw,2.6rem)] font-semibold leading-[1.1] tracking-tight">
                {t("title")}
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t("body")}</p>
            </Reveal>
          </div>

          <Reveal delay={2}>
           <Parallax speed={0.15}>
            <div className="rounded-2xl border border-line bg-paper-2 p-6">
              <h3 className="text-sm font-medium text-ink-mute">Countries we recruit for</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {siteConfig.countries.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft"
                  >
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
           </Parallax>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
