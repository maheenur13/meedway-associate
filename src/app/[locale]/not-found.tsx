import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="py-28">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <span className="font-display text-[clamp(4rem,14vw,8rem)] font-semibold leading-none tracking-tighter-2 text-accent">
            404
          </span>
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-ink-soft">{t("body")}</p>
          <div className="mt-8 flex justify-center">
            <Button href="/" variant="dark" size="lg">
              <ArrowLeft className="h-4 w-4" /> {t("cta")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
