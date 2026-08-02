import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { tradeIcon } from "@/lib/trade-icons";
import type { TradeCategoryItem } from "@/lib/trade-categories";

/** `items` comes from the DB (admin → Trades), already localized. */
export function Categories({ items }: { items: TradeCategoryItem[] }) {
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
            const Icon = tradeIcon(item.icon);
            return (
              <Reveal key={item.id} delay={i % 4} as="div">
                <Link
                  href="/jobs"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-paper-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_34px_-16px_rgba(48,40,120,0.4)]"
                >
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-8 flex items-center justify-between font-medium">
                    {item.name}
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
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
