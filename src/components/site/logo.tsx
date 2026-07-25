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
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-[7px]",
          onDark ? "bg-white text-ink" : "bg-ink text-paper"
        )}
      >
        <Plane className="h-4 w-4" />
      </span>
      <span
        className={cn(
          "font-display text-[17px] font-semibold tracking-tight",
          onDark ? "text-white" : "text-ink"
        )}
      >
        {t("name")}
      </span>
    </Link>
  );
}
