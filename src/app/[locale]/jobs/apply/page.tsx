import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ApplicationForm } from "@/components/forms/application-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: t("title"), description: t("intro") };
}

function ApplyContent() {
  const t = useTranslations("apply");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-paper-2 p-7 sm:p-9">
            <Suspense fallback={null}>
              <ApplicationForm />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ApplyContent />;
}
