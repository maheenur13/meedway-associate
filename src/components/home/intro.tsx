import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { OfficeCollage } from "./office-collage";
import { siteConfig } from "@/lib/site-config";
import { MapPin } from "lucide-react";

export function Intro() {
  const t = useTranslations("intro");

  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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

            <Reveal delay={3}>
              <div className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-mute">
                  Countries we recruit for
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {siteConfig.countries.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1.5 text-sm text-ink-soft"
                    >
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <OfficeCollage />
        </div>
      </Container>
    </section>
  );
}
