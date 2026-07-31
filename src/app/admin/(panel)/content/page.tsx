import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const s = await getSettings();
  return (
    <SettingsForm
      initial={{
        name: s.name,
        licence: s.licence,
        md: s.md,
        address: s.address,
        phone: s.phone,
        email: s.email,
        whatsapp: s.whatsapp,
        hours: s.hours,
      }}
    />
  );
}
