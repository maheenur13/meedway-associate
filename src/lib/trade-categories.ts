// Server-only: reads TradeCategory. Client components should import icon
// helpers from "@/lib/trade-icons" instead, or Prisma ends up in the browser.
import "server-only";

import { cache } from "react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TRADE_ICON } from "@/lib/trade-icons";
import type { SettingLocale } from "@/lib/settings-fields";

export type TradeCategoryItem = {
  id: string;
  /** Already resolved for the requested locale. */
  name: string;
  icon: string;
};

/**
 * The list the site shipped with, used when the table is empty or unreachable.
 * Names come from the translation files so the fallback stays bilingual.
 */
const FALLBACK: { key: string; icon: string }[] = [
  { key: "construction", icon: "HardHat" },
  { key: "factory", icon: "Factory" },
  { key: "drivers", icon: "Car" },
  { key: "cleaners", icon: "SprayCan" },
  { key: "hospitality", icon: "UtensilsCrossed" },
  { key: "electricians", icon: "Zap" },
  { key: "plumbers", icon: "Wrench" },
  { key: "welders", icon: "Flame" },
  { key: "caregivers", icon: "HeartHandshake" },
  { key: "general", icon: "Users" },
];

async function fallbackItems(locale: SettingLocale): Promise<TradeCategoryItem[]> {
  try {
    const t = await getTranslations({ locale, namespace: "categories" });
    return FALLBACK.map((f) => ({
      id: f.key,
      name: t(`items.${f.key}`),
      icon: f.icon,
    }));
  } catch {
    return [];
  }
}

/**
 * Published trade categories for the home page grid, in admin-defined order.
 *
 * Falls back to the shipped list when the table is empty or the query fails —
 * an empty "What we provide" section reads as a broken page, and the table
 * starts out empty on a fresh database.
 *
 * Bengali falls back to the English name so filling in only the English column
 * still renders on both sites, matching how site settings behave.
 */
export const getTradeCategories = cache(
  async (locale: SettingLocale = "en"): Promise<TradeCategoryItem[]> => {
    try {
      const rows = await prisma.tradeCategory.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (rows.length === 0) return fallbackItems(locale);

      return rows.map((r) => ({
        id: r.id,
        name:
          (locale === "bn" ? r.nameBn?.trim() || r.nameEn.trim() : r.nameEn.trim()) ||
          r.nameEn,
        icon: r.icon || DEFAULT_TRADE_ICON,
      }));
    } catch {
      return fallbackItems(locale);
    }
  }
);
