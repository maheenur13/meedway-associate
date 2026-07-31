import { prisma } from "@/lib/prisma";
import { ApplicationsTable, type AppRow } from "@/components/admin/applications-table";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const apps = await prisma.application.findMany({ orderBy: { createdAt: "desc" } });
  const rows: AppRow[] = apps.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    email: a.email,
    phone: a.phone,
    position: a.position,
    country: a.country,
    cvPath: a.cvPath,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  }));
  return <ApplicationsTable rows={rows} />;
}
