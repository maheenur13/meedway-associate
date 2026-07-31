import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Inter, Sora, Noto_Sans_Bengali } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsappButton } from "@/components/site/whatsapp-button";
import { AuroraBackground } from "@/components/site/aurora-background";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { ThemeSync } from "@/components/site/theme-sync";
import { getSettings, toSettingLocale } from "@/lib/settings";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const s = await getSettings(toSettingLocale(locale));
  return {
    title: {
      default: `${s.name} — ${s.tagline}`,
      template: `%s — ${s.name}`,
    },
    description: s.footerTagline,
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Navbar and the floating WhatsApp button are client components, so the
  // CMS values are resolved here and handed down as props.
  const settings = await getSettings(toSettingLocale(locale));

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${bengali.variable} h-full`}
    >
      <head>
        <script
          // Set the theme before paint to avoid a flash of the wrong theme.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <NextIntlClientProvider>
          <ThemeSync />
          <AuroraBackground />
          <ScrollProgress />
          <Navbar brandName={settings.shortName} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsappButton number={settings.whatsapp} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
