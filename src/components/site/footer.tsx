import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { getSettings } from "@/lib/settings";
import { Mail, Phone, MapPin } from "lucide-react";

export async function Footer() {
  const t = await getTranslations();
  const settings = await getSettings();
  const year = 2026;

  const explore = [
    { href: "/jobs", key: "nav.jobs" },
    { href: "/services", key: "nav.services" },
    { href: "/request-workers", key: "nav.employers" },
  ] as const;
  const company = [
    { href: "/about", key: "nav.about" },
    { href: "/contact", key: "nav.contact" },
  ] as const;

  return (
    <footer className="mt-24 border-t border-line bg-panel text-panel-ink">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 text-xs text-white/40">
              {t("footer.licence")} {settings.licence}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50">{t("footer.explore")}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50">{t("footer.company")}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50">{t("footer.contact")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} {settings.name}. {t("footer.rights")}
          </p>
          <p>
            {t("footer.licence")} {settings.licence}
          </p>
        </div>
      </Container>
    </footer>
  );
}
