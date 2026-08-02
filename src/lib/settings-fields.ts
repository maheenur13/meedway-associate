/**
 * Shape and field metadata for the editable site content.
 *
 * Deliberately free of server-only imports (no Prisma, no next-intl/server) so
 * the admin form — a client component — can import it. The resolvers that read
 * the database live in `settings.ts`.
 */

export type SettingLocale = "en" | "bn";

export function toSettingLocale(locale: string): SettingLocale {
  return locale === "bn" ? "bn" : "en";
}

export type Settings = {
  /** Legal / full company name — footer copyright, page metadata. */
  name: string;
  /** Compact name used by the logo in the navbar. Falls back to `name`. */
  shortName: string;
  tagline: string;
  footerTagline: string;
  licence: string;
  md: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  facebook: string;
  linkedin: string;
  statPlaced: string;
  statCountries: string;
  statVacancies: string;
};

export type SettingKey = keyof Settings;

export type FieldGroup = "brand" | "contact" | "social" | "stats";

export type FieldDef = {
  key: SettingKey;
  label: string;
  group: FieldGroup;
  /** Localized fields get both an English and a Bengali input in the admin. */
  localized: boolean;
  hint?: string;
  multiline?: boolean;
};

/**
 * Single source of truth: drives the DB keys, the admin form, and the resolver.
 * Add a field here and it appears in the admin Content page automatically.
 */
export const SETTING_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Company name",
    group: "brand",
    localized: true,
    hint: "Full legal name — footer copyright and browser tab titles.",
  },
  {
    key: "shortName",
    label: "Short name (navbar logo)",
    group: "brand",
    localized: true,
    hint: "Leave blank to use the company name.",
  },
  {
    key: "tagline",
    label: "Brand tagline",
    group: "brand",
    localized: true,
    hint: "Appended to the site title, e.g. “Company — Overseas Recruitment”.",
  },
  {
    key: "footerTagline",
    label: "Footer blurb",
    group: "brand",
    localized: true,
    multiline: true,
    hint: "Also used as the site description for search engines.",
  },
  { key: "licence", label: "Recruiting licence no.", group: "brand", localized: false },
  { key: "md", label: "Managing Director", group: "brand", localized: true },
  {
    key: "address",
    label: "Office address",
    group: "contact",
    localized: true,
    multiline: true,
    hint: "Also used for the Google map on the Contact page.",
  },
  { key: "phone", label: "Phone", group: "contact", localized: false },
  { key: "email", label: "Email", group: "contact", localized: false },
  {
    key: "whatsapp",
    label: "WhatsApp number",
    group: "contact",
    localized: false,
    hint: "Digits only, with country code — e.g. 8801700000000.",
  },
  { key: "hours", label: "Office hours", group: "contact", localized: true },
  { key: "facebook", label: "Facebook URL", group: "social", localized: false },
  { key: "linkedin", label: "LinkedIn URL", group: "social", localized: false },
  {
    key: "statPlaced",
    label: "Workers placed",
    group: "stats",
    localized: false,
    hint: "Number with an optional suffix — e.g. 5,000+",
  },
  {
    key: "statCountries",
    label: "Countries served",
    group: "stats",
    localized: false,
    hint: "Leave blank to count countries with published jobs automatically.",
  },
  {
    key: "statVacancies",
    label: "Open vacancies",
    group: "stats",
    localized: false,
    hint: "Leave blank to total the vacancies on published jobs automatically.",
  },
];

export const SETTING_KEYS = SETTING_FIELDS.map((f) => f.key);

export const GROUP_LABELS: Record<FieldGroup, { title: string; subtitle: string }> = {
  brand: {
    title: "Brand",
    subtitle: "Name and identity shown in the navbar, footer and browser tab titles.",
  },
  contact: {
    title: "Contact",
    subtitle: "Address, phone, email and WhatsApp used across the site.",
  },
  social: {
    title: "Social links",
    subtitle: "Shown in the footer. Leave blank to hide a link.",
  },
  stats: {
    title: "Homepage numbers",
    subtitle: "The three animated counters in the hero.",
  },
};

/**
 * Splits an admin-entered stat into a number and a suffix for the animated
 * counter: "5,000+" -> { value: 5000, suffix: "+" }. Returns null when there is
 * no leading number, so callers can fall back to their own default.
 */
export function splitStat(raw: string): { value: number; suffix: string } | null {
  const match = raw.trim().match(/^([\d,.\s]*\d)(.*)$/);
  if (!match) return null;
  const value = Number(match[1].replace(/[,\s]/g, ""));
  if (!Number.isFinite(value)) return null;
  return { value, suffix: match[2].trim() };
}
