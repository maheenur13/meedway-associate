import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { WorkerRequestForm } from "@/components/forms/worker-request-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "requestWorkers" });
  return { title: t("title"), description: t("intro") };
}

function RequestWorkersContent() {
  const t = useTranslations("requestWorkers");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-paper-2 p-7 sm:p-9">
            <WorkerRequestForm />
          </div>
        </Container>
      </section>
    </>
  );
}

export default async function RequestWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RequestWorkersContent />;
}
