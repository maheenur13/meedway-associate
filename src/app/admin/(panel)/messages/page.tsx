import { prisma } from "@/lib/prisma";
import { MessagesView, type MessageRow } from "@/components/admin/messages-view";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const list = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const rows: MessageRow[] = list.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    subject: m.subject,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  }));
  return <MessagesView rows={rows} />;
}
