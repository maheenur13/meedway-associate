import { prisma } from "@/lib/prisma";
import { JobsTable, type JobRow } from "@/components/admin/jobs-table";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const rows = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  const jobs: JobRow[] = rows.map((j) => ({
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
    deadline: j.deadline ? j.deadline.toISOString() : null,
    documents: j.documents ? (JSON.parse(j.documents) as string[]) : [],
    published: j.published,
  }));

  return <JobsTable jobs={jobs} />;
}
