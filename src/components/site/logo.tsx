import { Link } from "@/i18n/navigation";
import { Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const t = useTranslations("brand");
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
    >
      {/* gold plane on the brand-blue field */}
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent ring-1 ring-inset ring-gold/30">
        <Plane className="h-4 w-4 text-gold" />
      </span>
      <span
        className={cn(
          "font-display whitespace-nowrap text-[17px] font-semibold tracking-tight",
          onDark ? "text-white" : "text-ink"
        )}
      >
        {t("name")}
      </span>
    </Link>
  );
}
