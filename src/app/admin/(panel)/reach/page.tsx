import { prisma } from "@/lib/prisma";
import { ReachTable, type ReachRow } from "@/components/admin/reach-table";

export const dynamic = "force-dynamic";

export default async function AdminReachPage() {
  const rows = await prisma.reachCountry.findMany({
    orderBy: [{ sortOrder: "asc" }, { workers: "desc" }],
  });

  const countries: ReachRow[] = rows.map((r) => ({
    id: r.id,
    code: r.code,
    nameEn: r.nameEn,
    nameBn: r.nameBn ?? "",
    workers: r.workers,
    pill: r.pill,
    sortOrder: r.sortOrder,
    published: r.published,
  }));

  return <ReachTable rows={countries} />;
}
