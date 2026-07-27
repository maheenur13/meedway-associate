import { useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";

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

export function TrustMarquee() {
  const t = useTranslations("trust");
  const items = keys.map((k) => t(k));
  // duplicate the list so the -50% translate loops seamlessly
  const loop = [...items, ...items];

  return (
    <section className="border-y border-line bg-paper-2/40 py-5 backdrop-blur-sm">
      <div className="marquee-group relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />

        <ul className="animate-marquee flex w-max items-center gap-10">
          {loop.map((label, i) => (
            <li
              key={i}
              className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-ink-soft"
            >
              <BadgeCheck className="h-4 w-4 text-gold" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
