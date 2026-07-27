import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { JobsBrowser } from "@/components/jobs/jobs-browser";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("eyebrow"), description: t("intro") };
}

function JobsContent() {
  const t = useTranslations("jobs");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <JobsBrowser />
        </Container>
      </section>
    </>
  );
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JobsContent />;
}
