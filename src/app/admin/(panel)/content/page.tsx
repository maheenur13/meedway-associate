import { getRawSettings, getSettingDefaults } from "@/lib/settings";
import { SETTING_FIELDS } from "@/lib/settings-fields";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [raw, defaultsEn, defaultsBn] = await Promise.all([
    getRawSettings(),
    getSettingDefaults("en"),
    getSettingDefaults("bn"),
  ]);

  // Placeholders show what the site falls back to when a field is left blank.
  const placeholders = Object.fromEntries(
    SETTING_FIELDS.map((f) => [f.key, { en: defaultsEn[f.key], bn: defaultsBn[f.key] }]),
  );

  return <SettingsForm initial={raw} placeholders={placeholders} />;
}
