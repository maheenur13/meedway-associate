import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { TrustMarquee } from "@/components/home/trust-marquee";
import { Intro } from "@/components/home/intro";
import { Categories } from "@/components/home/categories";
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

  return (
    <>
      <Hero />
      <TrustMarquee />
      <Intro />
      <Categories />
      <Process />
      <Why />
      <CtaBand />
    </>
  );
}
