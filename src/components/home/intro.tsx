import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getSiteSettings } from "@/lib/settings";
import { OfficeCollage } from "./office-collage";

export async function Intro() {
  const t = await getTranslations("intro");
  const settings = await getSiteSettings();

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
          </div>

          <OfficeCollage brandName={settings.shortName} />
        </div>
      </Container>
    </section>
  );
}
