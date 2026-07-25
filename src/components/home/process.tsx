import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const steps = ["one", "two", "three", "four"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="border-y border-line bg-paper-2/50 py-20 backdrop-blur-sm">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step} delay={i} as="div">
              <div className="group relative">
                {/* connector to the next node — drawn relative to this node so it
                    always aligns; only on the 4-across desktop layout */}
                {i < steps.length - 1 && (
                  <span className="absolute left-5 top-5 hidden h-px w-[calc(100%+1.5rem)] bg-gradient-to-r from-accent/45 to-accent/15 lg:block" />
                )}

                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-paper-2 font-display text-sm font-semibold text-accent shadow-sm transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                  0{i + 1}
                </div>
                <h3 className="mt-5 text-lg font-medium">
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
