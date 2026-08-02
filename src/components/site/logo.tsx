import Image from "next/image";
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
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
    >
      {/*
        The four-figure swirl cropped out of the full company seal
        (public/photos/logo.png). The seal's arched wordmark and licence line
        turn to mush below ~120px, and the wordmark beside this would repeat
        the name anyway — so small surfaces get the mark on its own.
        Decorative: the company name is right next to it in real text.
      */}
      <Image
        src="/photos/logo-mark.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        priority
      />
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
