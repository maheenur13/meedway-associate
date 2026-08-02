import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { HQ } from "@/lib/reach-map";
import type { ReachLocation } from "@/lib/reach";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type Anchor = "left" | "right" | "top" | "bottom";
type Loc = {
  name: string;
  code: string; // ISO alpha-2 for the flag
  workers: number;
  left: number;
  top: number;
  pill?: boolean; // labelled pill on the map (only well-separated ones)
  anchor?: Anchor;
  hq?: boolean;
};

const pillPos: Record<Anchor, string> = {
  right: "left-3 top-0 -translate-y-1/2",
  left: "left-0 top-0 -translate-y-1/2 -translate-x-[calc(100%+0.75rem)]",
  top: "left-0 top-0 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)]",
  bottom: "left-0 top-3 -translate-x-1/2",
};

function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/32x24/${code}.png`}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      className={`h-[15px] w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-white/15 ${className ?? ""}`}
    />
  );
}

/** `items` comes from the DB (admin → Global reach), already localized. */
export async function WorldReach({ items }: { items: ReachLocation[] }) {
  const t = await getTranslations("reach");
  const settings = await getSiteSettings();
  const legend: Loc[] = items;
  // The head office pin is not a destination market and carries no worker
  // count, so it stays in code rather than being a deletable CMS row.
  const locations: Loc[] = [
    ...legend,
    { name: t("hqCountry"), code: HQ.code, workers: 0, left: HQ.left, top: HQ.top, pill: true, anchor: HQ.anchor, hq: true },
  ];

  return (
    <section className="relative overflow-hidden bg-panel py-20 text-panel-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              {t("eyebrow")}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,3.5vw,2.6rem)] font-semibold leading-[1.1] tracking-tight text-panel-ink">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-panel-ink/65">
              {t("subtitle", { company: settings.shortName })}
            </p>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="relative mx-auto mt-14 max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/world-dotted.svg"
              alt={`World map showing ${settings.shortName} deployment countries`}
              className="pointer-events-none w-full select-none opacity-90"
            />

            {locations.map((loc) => (
              <div
                key={loc.name}
                className="absolute"
                style={{ left: `${loc.left}%`, top: `${loc.top}%` }}
              >
                <span className="absolute left-0 top-0 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-panel">
                  <span
                    className={`absolute inset-0 rounded-full ${loc.hq ? "bg-gold/60" : "bg-accent/60"} animate-ping`}
                  />
                  {loc.hq && (
                    <span className="absolute inset-0 rounded-full bg-gold ring-2 ring-panel" />
                  )}
                </span>

                {loc.pill && (
                  <div className={`absolute hidden sm:block ${pillPos[loc.anchor ?? "right"]}`}>
                    <div className="group flex items-center gap-2 whitespace-nowrap rounded-xl bg-panel-2/85 px-2.5 py-1.5 shadow-lg shadow-black/30 ring-1 ring-white/10 backdrop-blur transition-colors hover:ring-gold/40">
                      <Flag code={loc.code} />
                      <div className="leading-tight">
                        <div className="text-[11px] font-semibold text-panel-ink">
                          {loc.name}
                        </div>
                        {loc.hq ? (
                          <div className="text-[10px] text-gold">{t("hq")}</div>
                        ) : (
                          <div className="text-[11px] font-medium text-gold">
                            {loc.workers.toLocaleString()}{" "}
                            <span className="text-[10px] font-normal text-panel-ink/50">
                              {t("workers")}
                            </span>
                          </div>
                        )}
                      </div>
                      {!loc.hq && (
                        <span className="ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* full legend — every destination + count */}
        <Reveal delay={2}>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {legend.map((loc) => (
              <li
                key={loc.name}
                className="flex items-center gap-3 rounded-xl bg-panel-2/70 px-3.5 py-3 ring-1 ring-white/10"
              >
                <Flag code={loc.code} className="h-[18px] w-6" />
                <div className="leading-tight">
                  <div className="text-sm font-medium text-panel-ink">{loc.name}</div>
                  <div className="text-xs">
                    <span className="font-semibold text-gold">
                      {loc.workers.toLocaleString()}
                    </span>{" "}
                    <span className="text-panel-ink/50">{t("workers")}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
