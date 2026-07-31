import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const settings = await getSettings();

  return (
    <AdminShell email={session.user?.email} brandName={settings.shortName}>
      {children}
    </AdminShell>
  );
}
