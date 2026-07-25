import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const steps = ["one", "two", "three", "four"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="border-y border-line bg-paper-2 py-20">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step} delay={i} as="div">
              <div className="flex h-full flex-col bg-paper-2 p-6">
                <span className="font-display text-sm font-semibold text-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-medium">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t(`steps.${step}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
