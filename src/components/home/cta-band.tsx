import { getTranslations } from "next-intl/server";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { whatsappLink } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/settings";

// Rendered on several pages, so it reads the CMS itself instead of taking props.
export async function CtaBand() {
  const t = await getTranslations("cta");
  const settings = await getSiteSettings();

  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-panel px-6 py-14 text-center sm:px-16 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-[110px]"
            />
            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-[clamp(1.7rem,4vw,2.7rem)] font-semibold leading-tight tracking-tight text-white">
                {t("title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/60">{t("body")}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="/request-workers" variant="primary" size="lg">
                  {t("employers")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/jobs" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  {t("seekers")}
                </Button>
                <a
                  href={whatsappLink(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-[11px] px-5 text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
