import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  BadgeCheck,
  MapPin,
  Globe2,
  Eye,
  Scale,
  Briefcase,
  HeartHandshake,
  Smile,
  Quote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { CtaBand } from "@/components/home/cta-band";
import { getSettings, toSettingLocale, type Settings } from "@/lib/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("eyebrow"), description: t("intro") };
}

const values: { key: string; icon: LucideIcon }[] = [
  { key: "honesty", icon: Scale },
  { key: "transparency", icon: Eye },
  { key: "professional", icon: Briefcase },
  { key: "safety", icon: HeartHandshake },
  { key: "satisfaction", icon: Smile },
];

function AboutContent({ settings }: { settings: Settings }) {
  const t = useTranslations("about");

  const facts = [
    { icon: ShieldCheck, label: t("facts.licence"), value: settings.licence },
    { icon: BadgeCheck, label: t("facts.member"), value: t("membership") },
    { icon: MapPin, label: t("facts.office"), value: t("officeLocation") },
    { icon: Globe2, label: t("facts.markets"), value: t("marketsValue") },
  ];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* facts strip */}
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {facts.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="rounded-2xl border border-line bg-paper-2 p-5"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <dt className="mt-3 text-xs uppercase tracking-wide text-ink-mute">
                    {f.label}
                  </dt>
                  <dd className="font-display mt-1 text-lg font-semibold">{f.value}</dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </Container>

      {/* mission + vision */}
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {(["mission", "vision"] as const).map((k, i) => (
              <Reveal key={k} delay={i} as="div">
                <div className="h-full rounded-2xl border border-line bg-paper-2 p-8">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {t(`${k}.title`)}
                  </span>
                  <p className="font-display mt-4 text-xl font-medium leading-snug tracking-tight">
                    {t(`${k}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* values */}
      <section className="border-y border-line bg-paper-2/50 py-20 backdrop-blur-sm">
        <Container>
          <SectionHeader
            eyebrow={t("values.eyebrow")}
            title={t("values.title")}
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.key} delay={i % 3} as="div">
                  <div className="flex h-full gap-4 rounded-2xl border border-line bg-paper p-6">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-medium">{t(`values.items.${v.key}.title`)}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {t(`values.items.${v.key}.body`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* leadership */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <Photo
                src="/photos/team/md.jpg"
                alt={settings.md}
                ratio="4 / 5"
                caption={settings.md}
              />
            </Reveal>
            <div>
              <Reveal>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  {t("leadership.eyebrow")}
                </span>
              </Reveal>
              <Reveal delay={1}>
                <h2 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-tight">
                  {t("leadership.title")}
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <Quote className="mt-6 h-8 w-8 text-accent/40" />
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">
                  {t("leadership.quote")}
                </p>
                <p className="mt-5 font-medium">{settings.md}</p>
                <p className="text-sm text-ink-mute">{t("leadership.role")}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* office gallery */}
      <section className="pb-20">
        <Container>
          <SectionHeader
            eyebrow={t("office.eyebrow")}
            title={t("office.title")}
            subtitle={t("office.body")}
          />
          {/* mobile / tablet: uniform grid (all same ratio → aligned) */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            <Photo src="/photos/office/office-1.jpg" alt="Reception" ratio="4 / 3" />
            <Photo src="/photos/office/office-2.png" alt="Waiting area" ratio="4 / 3" />
            <Photo src="/photos/process/processing.jpg" alt="Processing section" ratio="4 / 3" />
            <Photo src="/photos/office/signboard.jpg" alt="Company signboard" ratio="4 / 3" />
          </div>

          {/* desktop: fixed-height bento with fill photos → every cell aligns */}
          <div className="mt-12 hidden h-[460px] grid-cols-4 grid-rows-2 gap-4 lg:grid">
            <Reveal as="div" className="col-span-2 row-span-2">
              <Photo src="/photos/office/office-1.jpg" alt="Reception" fill className="h-full w-full" />
            </Reveal>
            <Reveal as="div" delay={1}>
              <Photo src="/photos/office/office-2.png" alt="Waiting area" fill className="h-full w-full" />
            </Reveal>
            <Reveal as="div" delay={2}>
              <Photo src="/photos/process/processing.jpg" alt="Processing section" fill className="h-full w-full" />
            </Reveal>
            <Reveal as="div" delay={1} className="col-span-2">
              <Photo src="/photos/office/signboard.jpg" alt="Company signboard" fill className="h-full w-full" />
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings(toSettingLocale(locale));
  return <AboutContent settings={settings} />;
}
