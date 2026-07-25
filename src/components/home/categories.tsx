import { useTranslations } from "next-intl";
import {
  HardHat,
  Factory,
  Car,
  SprayCan,
  UtensilsCrossed,
  Zap,
  Wrench,
  Flame,
  HeartHandshake,
  Users,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";

const items: { key: string; icon: LucideIcon }[] = [
  { key: "construction", icon: HardHat },
  { key: "factory", icon: Factory },
  { key: "drivers", icon: Car },
  { key: "cleaners", icon: SprayCan },
  { key: "hospitality", icon: UtensilsCrossed },
  { key: "electricians", icon: Zap },
  { key: "plumbers", icon: Wrench },
  { key: "welders", icon: Flame },
  { key: "caregivers", icon: HeartHandshake },
  { key: "general", icon: Users },
];

export function Categories() {
  const t = useTranslations("categories");

  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.key} delay={i % 4} as="div">
                <Link
                  href="/jobs"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-paper-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-8 font-medium">{t(`items.${item.key}`)}</span>
                </Link>
              </Reveal>
            );
          })}

          <Reveal delay={2} as="div">
            <Link
              href="/jobs"
              className="group flex h-full flex-col justify-between rounded-2xl bg-panel p-5 text-panel-ink transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-soft">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-8 font-medium">{t("viewAll")}</span>
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
