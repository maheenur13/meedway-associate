import { prisma } from "@/lib/prisma";
import { TradesTable, type TradeRow } from "@/components/admin/trades-table";

export const dynamic = "force-dynamic";

export default async function AdminTradesPage() {
  const rows = await prisma.tradeCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const trades: TradeRow[] = rows.map((t) => ({
    id: t.id,
    nameEn: t.nameEn,
    nameBn: t.nameBn ?? "",
    icon: t.icon,
    sortOrder: t.sortOrder,
    published: t.published,
  }));

  return <TradesTable trades={trades} />;
}
