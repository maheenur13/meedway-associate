// Server-only: reads ReachCountry. Client components should import the
// coordinate table from "@/lib/reach-map" instead, or Prisma ends up in the
// browser bundle.
import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { REACH_COORDS, type Anchor } from "@/lib/reach-map";
import type { SettingLocale } from "@/lib/settings-fields";

export type ReachLocation = {
  code: string;
  name: string;
  workers: number;
  left: number;
  top: number;
  pill: boolean;
  anchor: Anchor;
};

/**
 * The list the site shipped with, used when the table is empty or unreachable.
 * An empty map section reads as a broken page.
 */
const FALLBACK: { code: string; en: string; bn: string; workers: number; pill: boolean }[] = [
  { code: "my", en: "Malaysia", bn: "মালয়েশিয়া", workers: 4500, pill: true },
  { code: "sa", en: "Saudi Arabia", bn: "সৌদি আরব", workers: 3300, pill: true },
  { code: "ae", en: "UAE", bn: "সংযুক্ত আরব আমিরাত", workers: 2000, pill: false },
  { code: "om", en: "Oman", bn: "ওমান", workers: 1000, pill: false },
  { code: "qa", en: "Qatar", bn: "কাতার", workers: 900, pill: false },
  { code: "kw", en: "Kuwait", bn: "কুয়েত", workers: 800, pill: false },
  { code: "bh", en: "Bahrain", bn: "বাহরাইন", workers: 500, pill: false },
  { code: "jo", en: "Jordan", bn: "জর্ডান", workers: 400, pill: false },
];

function place(
  code: string,
  name: string,
  workers: number,
  pill: boolean
): ReachLocation | null {
  const coords = REACH_COORDS[code];
  // No coordinates means the pin can't be drawn — skip rather than stack
  // everything at 0,0 in the top-left corner of the map.
  if (!coords) return null;
  return { code, name, workers, pill, ...coords };
}

/**
 * Destination markets for the home page map + legend, in admin-defined order.
 *
 * Bengali falls back to the English name so filling in only the English column
 * still renders on both sites, matching how site settings behave.
 */
export const getReachLocations = cache(
  async (locale: SettingLocale = "en"): Promise<ReachLocation[]> => {
    const fallback = () =>
      FALLBACK.map((f) =>
        place(f.code, locale === "bn" ? f.bn : f.en, f.workers, f.pill)
      ).filter((x): x is ReachLocation => x !== null);

    try {
      const rows = await prisma.reachCountry.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { workers: "desc" }],
      });
      if (rows.length === 0) return fallback();

      return rows
        .map((r) =>
          place(
            r.code,
            (locale === "bn" ? r.nameBn?.trim() || r.nameEn.trim() : r.nameEn.trim()) ||
              r.nameEn,
            r.workers,
            r.pill
          )
        )
        .filter((x): x is ReachLocation => x !== null);
    } catch {
      return fallback();
    }
  }
);
