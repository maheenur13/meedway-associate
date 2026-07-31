// Server-only: reads SiteContent. Client components must import the field
// metadata from "@/lib/settings-fields" instead, or Prisma ends up in the browser bundle.
import "server-only";

import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import {
  SETTING_KEYS,
  toSettingLocale,
  type SettingKey,
  type SettingLocale,
  type Settings,
} from "@/lib/settings-fields";

// Re-exported so server components can get everything from one import.
export { toSettingLocale };
export type { Settings, SettingKey, SettingLocale };

/**
 * Per-locale defaults. Localized copy comes from the translation files so the
 * Bengali site keeps Bengali defaults; the rest comes from siteConfig.
 */
async function getDefaults(locale: SettingLocale): Promise<Settings> {
  let brand: { name: string; full: string; tagline: string } = {
    name: siteConfig.short,
    full: siteConfig.name,
    tagline: "",
  };
  let footerTagline = "";
  let hours = "Sun – Thu, 10am – 6pm";

  try {
    const t = await getTranslations({ locale });
    brand = {
      name: t("brand.name"),
      full: t("brand.full"),
      tagline: t("brand.tagline"),
    };
    footerTagline = t("footer.tagline");
    hours = t("contact.hoursValue");
  } catch {
    // Outside a next-intl request (or missing keys) — keep the siteConfig values.
  }

  return {
    name: brand.full,
    shortName: brand.name,
    tagline: brand.tagline,
    footerTagline,
    licence: siteConfig.licenceNo,
    md: siteConfig.managingDirector,
    address: siteConfig.address,
    phone: siteConfig.phone,
    email: siteConfig.email,
    whatsapp: siteConfig.whatsapp,
    hours,
    facebook: siteConfig.social.facebook,
    linkedin: siteConfig.social.linkedin,
    statPlaced: siteConfig.stats.placed,
    statCountries: siteConfig.stats.countries,
    statDeployed: siteConfig.stats.deployed,
  };
}

/** Defaults exposed to the admin form so it can show them as placeholders. */
export const getSettingDefaults = cache(getDefaults);

type Row = { en: string; bn: string };

const readRows = cache(async (): Promise<Record<string, Row>> => {
  try {
    const rows = await prisma.siteContent.findMany();
    return Object.fromEntries(
      rows.map((r) => [r.key, { en: r.valueEn ?? "", bn: r.valueBn ?? "" }]),
    );
  } catch {
    return {}; // DB not ready — fall back to defaults
  }
});

/** Raw stored overrides, for the admin form. Blank means "use the default". */
export const getRawSettings = cache(async (): Promise<Record<string, Row>> => {
  const rows = await readRows();
  return Object.fromEntries(
    SETTING_KEYS.map((key) => [key, rows[key] ?? { en: "", bn: "" }]),
  );
});

/**
 * Merges DB overrides (SiteContent) over the per-locale defaults.
 * Bengali falls back to the English override before the built-in default, so
 * filling in only the English column still changes both languages.
 * Cached per locale per request.
 */
export const getSettings = cache(
  async (locale: SettingLocale = "en"): Promise<Settings> => {
    const [rows, defaults] = await Promise.all([readRows(), getDefaults(locale)]);

    const pick = (key: SettingKey): string => {
      const row = rows[key];
      const stored =
        locale === "bn" ? row?.bn?.trim() || row?.en?.trim() : row?.en?.trim();
      return stored || defaults[key];
    };

    const resolved = Object.fromEntries(
      SETTING_KEYS.map((key) => [key, pick(key)]),
    ) as Settings;

    // The navbar should never render empty: fall back to the full company name.
    resolved.shortName = resolved.shortName || resolved.name;
    return resolved;
  },
);

/** Settings for the current request's locale. Use this in server components. */
export async function getSiteSettings(): Promise<Settings> {
  return getSettings(toSettingLocale(await getLocale()));
}
