import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
  name,
}: {
  className?: string;
  onDark?: boolean;
  /** Company name from the CMS (`getSettings().shortName`). */
  name?: string;
}) {
  const t = useTranslations("brand");
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
    >
      {/* white plane + dotted contrail on a blue gradient badge */}
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="meed-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#meed-mark)" />
        <path
          d="M5.5 24.5q5.5-1.5 9.5-7"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="0.1 3.2"
        />
        <g
          transform="translate(4.2 4)"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </g>
      </svg>
      <span
        className={cn(
          "font-display whitespace-nowrap text-[17px] font-semibold tracking-tight",
          onDark ? "text-white" : "text-ink"
        )}
      >
        {name || t("name")}
      </span>
    </Link>
  );
}
