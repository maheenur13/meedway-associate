"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = { en: "EN", bn: "বাংলা" };

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname, params: params as any }, { locale: next });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line-2 bg-paper-2 p-0.5 text-xs font-medium",
        className
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            l === locale ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          )}
          aria-current={l === locale}
        >
          {labels[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
