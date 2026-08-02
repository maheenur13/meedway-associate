import { setRequestLocale } from "next-intl/server";
import { getSettings, toSettingLocale } from "@/lib/settings";
import { getTradeCategories } from "@/lib/trade-categories";
import { getReachLocations } from "@/lib/reach";
import { Hero } from "@/components/home/hero";
import { TrustMarquee } from "@/components/home/trust-marquee";
import { Intro } from "@/components/home/intro";
import { Categories } from "@/components/home/categories";
import { WorldReach } from "@/components/home/world-reach";
import { Process } from "@/components/home/process";
import { Why } from "@/components/home/why";
import { CtaBand } from "@/components/home/cta-band";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, categories, reach] = await Promise.all([
    getSettings(toSettingLocale(locale)),
    getTradeCategories(toSettingLocale(locale)),
    getReachLocations(toSettingLocale(locale)),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <TrustMarquee />
      <Intro />
      <Categories items={categories} />
      <WorldReach items={reach} />
      <Process />
      <Why />
      <CtaBand />
    </>
  );
}
