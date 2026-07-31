import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export type Settings = {
  name: string;
  licence: string;
  md: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
};

// The editable keys shown in the admin Content page.
export const SETTING_KEYS = [
  "name",
  "licence",
  "md",
  "address",
  "phone",
  "email",
  "whatsapp",
  "hours",
] as const;

/** Merges DB overrides (SiteContent) over the siteConfig defaults. Cached per request. */
export const getSettings = cache(async (): Promise<Settings> => {
  let db: Record<string, string> = {};
  try {
    const rows = await prisma.siteContent.findMany();
    db = Object.fromEntries(rows.map((r) => [r.key, r.valueEn ?? ""]));
  } catch {
    // DB not ready — fall back to defaults
  }
  return {
    name: db.name || siteConfig.name,
    licence: db.licence || siteConfig.licenceNo,
    md: db.md || siteConfig.managingDirector,
    address: db.address || siteConfig.address,
    phone: db.phone || siteConfig.phone,
    email: db.email || siteConfig.email,
    whatsapp: db.whatsapp || siteConfig.whatsapp,
    hours: db.hours || "Sun – Thu, 10am – 6pm",
  };
});
