import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { whatsappLink } from "@/lib/site-config";
import { getSettings, toSettingLocale, type Settings } from "@/lib/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("eyebrow"), description: t("intro") };
}

function ContactContent({ settings }: { settings: Settings }) {
  const t = useTranslations("contact");

  const details = [
    { icon: MapPin, label: t("address"), value: settings.address, href: undefined },
    { icon: Phone, label: t("phone"), value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: t("email"), value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: t("hours"), value: settings.hours, href: undefined },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    settings.address
  )}&output=embed`;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            {/* PRIMARY: the form */}
            <div className="rounded-3xl border border-line bg-paper-2 p-7 shadow-sm sm:p-10">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {t("formTitle")}
              </h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            {/* SUPPORTING: chat-first CTA + light contact details */}
            <aside className="space-y-4">
              {/* chat-first */}
              <div className="rounded-2xl border border-line bg-paper-2 p-6">
                <h3 className="font-medium">{t("talk")}</h3>
                <a
                  href={whatsappLink(
                    settings.whatsapp,
                    `Hello ${settings.shortName}, I would like to know more.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-medium text-white transition hover:brightness-105"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("chat")}
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-line-2 px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-black/[0.03]"
                >
                  <Phone className="h-4 w-4" /> {settings.phone}
                </a>
              </div>

              {/* light contact details */}
              <div className="rounded-2xl border border-line bg-paper-2 p-6">
                <ul className="space-y-4 text-sm">
                  {details.map((d) => {
                    const Icon = d.icon;
                    const inner = (
                      <>
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <div>
                          <div className="text-xs uppercase tracking-wide text-ink-mute">
                            {d.label}
                          </div>
                          <div className="mt-0.5 text-ink">{d.value}</div>
                        </div>
                      </>
                    );
                    return (
                      <li key={d.label} className="flex items-start gap-3">
                        {d.href ? (
                          <a href={d.href} className="flex items-start gap-3 hover:text-accent">
                            {inner}
                          </a>
                        ) : (
                          inner
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>

          {/* map — trust signal, full width */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-line">
            <iframe
              title={`${settings.shortName} office location`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full grayscale-[0.15]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings(toSettingLocale(locale));
  return <ContactContent settings={settings} />;
}
