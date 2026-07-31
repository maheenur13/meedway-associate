import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { getSiteSettings } from "@/lib/settings";
// lucide-react v1 no longer ships brand icons, so social links are text pills.
import { Mail, Phone, MapPin } from "lucide-react";

export async function Footer() {
  const t = await getTranslations();
  const settings = await getSiteSettings();
  const year = 2026;

  // A blank URL (or the "#" placeholder) hides the icon rather than linking nowhere.
  const socials = [
    { href: settings.facebook, label: "Facebook" },
    { href: settings.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href && s.href !== "#");

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
            <Logo onDark name={settings.shortName} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {settings.footerTagline}
            </p>
            <p className="mt-4 text-xs text-white/40">
              {t("footer.licence")} {settings.licence}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
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
