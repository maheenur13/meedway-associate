import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import {
  Check,
  UserRound,
  Building2,
  HardHat,
  Factory,
  UtensilsCrossed,
  SprayCan,
  Truck,
  Sprout,
  Stethoscope,
  Cog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/home/cta-band";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("eyebrow"), description: t("intro") };
}

const seekerItems = [
  "info", "registration", "cv", "interview", "skills",
  "documents", "medical", "visa", "orientation", "travel",
] as const;

const employerItems = [
  "sourcing", "screening", "interview", "testing",
  "verification", "visa", "deployment", "communication",
] as const;

const industries: { key: string; icon: LucideIcon }[] = [
  { key: "construction", icon: HardHat },
  { key: "manufacturing", icon: Factory },
  { key: "hospitality", icon: UtensilsCrossed },
  { key: "cleaning", icon: SprayCan },
  { key: "transportation", icon: Truck },
  { key: "agriculture", icon: Sprout },
  { key: "healthcare", icon: Stethoscope },
  { key: "engineering", icon: Cog },
  { key: "general", icon: Users },
];

function ServiceList({
  ns,
  icon: Icon,
  cta,
  ctaHref,
}: {
  ns: "seekers" | "employers";
  icon: LucideIcon;
  cta: string;
  ctaHref: string;
}) {
  const t = useTranslations("services");
  const items = ns === "seekers" ? seekerItems : employerItems;
  return (
    <div className="rounded-2xl border border-line bg-paper-2 p-7 sm:p-9">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Icon className="h-6 w-6" />
      </span>
      <span className="mt-5 block text-xs font-medium uppercase tracking-[0.18em] text-accent">
        {t(`${ns}.eyebrow`)}
      </span>
      <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
        {t(`${ns}.title`)}
      </h3>
      <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {t(`${ns}.items.${item}`)}
          </li>
        ))}
      </ul>
      <Button href={ctaHref} variant="outline" size="sm" className="mt-8">
        {cta}
      </Button>
    </div>
  );
}

function ServicesContent() {
  const t = useTranslations("services");
  const nav = useTranslations("nav");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-10">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Reveal>
              <ServiceList
                ns="seekers"
                icon={UserRound}
                cta={nav("applyNow")}
                ctaHref="/jobs"
              />
            </Reveal>
            <Reveal delay={1}>
              <ServiceList
                ns="employers"
                icon={Building2}
                cta={nav("requestWorkers")}
                ctaHref="/request-workers"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <SectionHeader
            eyebrow={t("industries.eyebrow")}
            title={t("industries.title")}
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <Reveal key={ind.key} delay={i % 3} as="div">
                  <div className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-paper-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{t(`industries.items.${ind.key}`)}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesContent />;
}
