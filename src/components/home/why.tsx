import { getTranslations } from "next-intl/server";
import { ShieldCheck, Eye, HeartHandshake, Rocket } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const items: { key: string; icon: LucideIcon }[] = [
  { key: "one", icon: ShieldCheck },
  { key: "two", icon: Eye },
  { key: "three", icon: HeartHandshake },
  { key: "four", icon: Rocket },
];

export async function Why() {
  const t = await getTranslations("why");
  const settings = await getSiteSettings();

  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow", { company: settings.shortName })}
          title={t("title")}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.key} delay={i % 2} as="div">
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper-2 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium">{t(`items.${item.key}.title`)}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">
                      {t(`items.${item.key}.body`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
