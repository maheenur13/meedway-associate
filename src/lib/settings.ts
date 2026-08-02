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
 * How many distinct countries have published openings right now.
 *
 * Deduped in JS rather than with Prisma's `distinct` so that admin-entered
 * values differing only by case or padding ("Qatar" / "qatar ") count once.
 *
 * Returns 0 when the DB is unreachable or nothing is published, which the
 * caller treats as "no answer" and falls back to the configured figure —
 * a hero reading "0 countries served" would be worse than a stale number.
 */
const countJobCountries = cache(async (): Promise<number> => {
  try {
    const rows = await prisma.job.findMany({
      where: { published: true },
      select: { country: true },
    });
    return new Set(rows.map((r) => r.country?.trim().toLowerCase()).filter(Boolean)).size;
  } catch {
    return 0;
  }
});

/**
 * Total vacancies advertised across published jobs.
 *
 * Returns 0 on failure or when nothing is published, which the caller reads as
 * "no answer" and replaces with the configured fallback — same reasoning as
 * countJobCountries.
 */
const sumJobVacancies = cache(async (): Promise<number> => {
  try {
    const rows = await prisma.job.findMany({
      where: { published: true },
      select: { vacancies: true },
    });
    return rows.reduce((total, r) => total + (r.vacancies || 0), 0);
  } catch {
    return 0;
  }
});

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

  const [liveCountries, liveVacancies] = await Promise.all([
    countJobCountries(),
    sumJobVacancies(),
  ]);

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
    // Counted from live listings; siteConfig is only the fallback. An
    // admin-entered override still beats this, same as every other field.
    statCountries: liveCountries > 0 ? String(liveCountries) : siteConfig.stats.countries,
    statVacancies: liveVacancies > 0 ? String(liveVacancies) : siteConfig.stats.vacancies,
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

    /** The admin-entered override for a key, or "" when not set. */
    const stored = (key: SettingKey): string => {
      const row = rows[key];
      return (locale === "bn" ? row?.bn?.trim() || row?.en?.trim() : row?.en?.trim()) ?? "";
    };

    const resolved = Object.fromEntries(
      SETTING_KEYS.map((key) => [key, stored(key) || defaults[key]]),
    ) as Settings;

    // "Leave blank to use the company name": an admin-entered company name has to
    // beat the built-in short default, otherwise editing only the company name
    // leaves the navbar showing the old shipped value.
    resolved.shortName = stored("shortName") || stored("name") || defaults.shortName;
    return resolved;
  },
);

/** Settings for the current request's locale. Use this in server components. */
export async function getSiteSettings(): Promise<Settings> {
  return getSettings(toSettingLocale(await getLocale()));
}
