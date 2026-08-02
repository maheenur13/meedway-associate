import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { JobsBrowser } from "@/components/jobs/jobs-browser";
import { prisma } from "@/lib/prisma";
import type { Job } from "@/lib/jobs-data";

// Job listings change rarely, so this page is prerendered like the rest of the
// public site. The admin actions call revalidatePath("/", "layout") on every
// job edit, so changes show up immediately; the hourly window is only a safety
// net for rows changed outside the panel (e.g. straight in the DB).
export const revalidate = 3600;

async function getJobs(): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((j) => ({
    id: j.id,
    title: j.title,
    category: j.category,
    country: j.country,
    vacancies: j.vacancies,
    salary: j.salary ?? "",
    workingHours: j.workingHours ?? "",
    contract: j.contract ?? "",
    experience: j.experience ?? "",
    accommodation: j.accommodation,
    deadline: j.deadline ? new Date(j.deadline).toISOString() : "",
    documents: j.documents ? (JSON.parse(j.documents) as string[]) : [],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("eyebrow"), description: t("intro") };
}

function JobsContent({ jobs }: { jobs: Job[] }) {
  const t = useTranslations("jobs");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <JobsBrowser jobs={jobs} />
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
  const jobs = await getJobs();
  return <JobsContent jobs={jobs} />;
}
