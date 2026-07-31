import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/components/admin/dashboard-view";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [jobs, applications, requests, messages, recentApps] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
    prisma.workerRequest.count(),
    prisma.contactMessage.count(),
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <DashboardView
      counts={{ jobs, applications, requests, messages }}
      recent={recentApps.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        position: a.position,
        country: a.country,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}
