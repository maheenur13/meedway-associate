import { prisma } from "@/lib/prisma";
import { RequestsTable, type RequestRow } from "@/components/admin/requests-table";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const list = await prisma.workerRequest.findMany({ orderBy: { createdAt: "desc" } });
  const rows: RequestRow[] = list.map((r) => ({
    id: r.id,
    company: r.company,
    contact: r.contact,
    email: r.email,
    phone: r.phone,
    country: r.country,
    category: r.category,
    quantity: r.quantity,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
  return <RequestsTable rows={rows} />;
}
