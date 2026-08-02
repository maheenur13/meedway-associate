"use client";

import { useLocale } from "next-intl";
import { useLinkStatus } from "next/link";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = { en: "EN", bn: "বাংলা" };

/**
 * Dot that appears only while the click is still resolving. Has to live inside
 * the <Link> — useLinkStatus reads the pending state of its nearest ancestor.
 */
function Pending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      aria-hidden
      className="ml-1.5 inline-block h-1 w-1 animate-pulse rounded-full bg-current align-middle"
    />
  );
}

/**
 * Switching locale is a full navigation, so it was only as quick as the fetch
 * for the other language — with a plain button nothing was prefetched and the
 * UI gave no sign it had registered the click. Rendering each option as a
 * <Link> lets Next prefetch the other locale while the switcher sits in the
 * viewport, so the payload is usually already there when it's clicked.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line-2 bg-paper-2 p-0.5 text-xs font-medium",
        className
      )}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        const classes = cn(
          "rounded-full px-2.5 py-1 transition-colors",
          active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
        );

        // The current locale links nowhere — it's the page you're already on.
        return active ? (
          <span key={l} aria-current="true" className={classes}>
            {labels[l] ?? l.toUpperCase()}
          </span>
        ) : (
          <Link key={l} href={pathname} locale={l} replace className={classes}>
            {labels[l] ?? l.toUpperCase()}
            <Pending />
          </Link>
        );
      })}
    </div>
  );
}
