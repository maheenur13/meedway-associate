/**
 * Company details for Meed Associates Ltd.
 * Real, publicly-known values are filled in; items marked TODO still need confirmation.
 * These will eventually be driven from the DB/CMS (CompanyProfile).
 */
export const siteConfig = {
  name: "Meed Associate Ltd.",
  short: "Meed Associate",
  logoMark: "MA",
  yearEstablished: null as number | null, // TODO: confirm year of establishment
  licenceNo: "RL-2927",
  baira: true,
  managingDirector: "Shafiqul Haider Bhuiyan",
  email: "info@meedassociates.com", // TODO: confirm official email
  phone: "+880 0000 000000", // TODO: confirm phone
  whatsapp: "8800000000000", // TODO: confirm — digits only, intl format for wa.me
  address:
    "H-95, 4th Floor, Bir Uttam Ziaur Rahman Road (Kakoli), Banani, Dhaka-1213",
  // Primary markets first; Meed Associates recruits mainly for Malaysia & Saudi Arabia.
  countries: [
    "Malaysia",
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Oman",
    "Bahrain",
    "Jordan",
  ],
  stats: {
    placed: "5,000+", // TODO: confirm with the client — not derivable from the DB
    // Fallbacks only. Both of these are counted from published jobs at render
    // time (see lib/settings.ts) and are used solely when the DB is
    // unreachable or nothing is published yet.
    countries: "8",
    vacancies: "200+",
  },
  social: {
    facebook: "#",
    linkedin: "#",
  },
} as const;

/**
 * Builds a wa.me link. Pass the number from `getSettings()` so the CMS value wins;
 * falls back to the siteConfig default when it is blank.
 */
export function whatsappLink(number?: string, message?: string) {
  const digits = (number || siteConfig.whatsapp).replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
