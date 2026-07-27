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
    placed: "5,000+", // TODO: confirm real figures
    countries: "8",
    deployed: "98%",
  },
  social: {
    facebook: "#",
    linkedin: "#",
  },
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
