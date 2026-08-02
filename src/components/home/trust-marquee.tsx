import { getTranslations } from "next-intl/server";
import { BadgeCheck } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

const keys = [
  "baira",
  "licence",
  "govt",
  "ethical",
  "transparent",
  "safety",
  "support",
  "experienced",
] as const;

export async function TrustMarquee() {
  const t = await getTranslations("trust");
  const settings = await getSiteSettings();
  // Only "licence" uses {licence}; extra values are ignored for the other keys.
  const items = keys.map((k) => t(k, { licence: settings.licence }));
  // duplicate the list so the -50% translate loops seamlessly
  const loop = [...items, ...items];

  // The band is nearly opaque on purpose: at 40% the aurora blobs behind it
  // showed through and kept changing the contrast under the labels.
  return (
    <section className="border-y border-line bg-paper-2/90 py-5 backdrop-blur-sm">
      <div className="marquee-group relative overflow-hidden">
        {/* edge fades — to paper-2 so they blend into the band, not the page */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-2 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-2 to-transparent" />

        <ul className="animate-marquee flex w-max items-center gap-10">
          {loop.map((label, i) => (
            <li
              key={i}
              // Full-strength ink, not ink-soft: this text is moving, which
              // costs legibility that static body copy doesn't have to pay.
              className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-ink"
            >
              <BadgeCheck className="h-4 w-4 text-accent" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
