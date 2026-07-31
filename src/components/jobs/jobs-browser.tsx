"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Clock,
  CalendarClock,
  BriefcaseBusiness,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { type Job } from "@/lib/jobs-data";
import { cn } from "@/lib/utils";

const countryCodes: Record<string, string> = {
  "Saudi Arabia": "sa",
  Malaysia: "my",
  "United Arab Emirates": "ae",
  Qatar: "qa",
  Oman: "om",
  Kuwait: "kw",
  Bahrain: "bh",
  Jordan: "jo",
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent bg-accent text-accent-ink"
          : "border-line bg-paper-2 text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

function JobCard({ job }: { job: Job }) {
  const t = useTranslations("jobs");
  const locale = useLocale();
  const deadline = new Date(job.deadline).toLocaleDateString(
    locale === "bn" ? "bn-BD" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const code = countryCodes[job.country];

  const stats = [
    { icon: Clock, label: t("hours"), value: job.workingHours },
    { icon: BriefcaseBusiness, label: t("experience"), value: job.experience },
    { icon: CalendarClock, label: t("contract"), value: job.contract },
    {
      icon: BedDouble,
      label: t("accommodation"),
      value: job.accommodation ? t("provided") : "—",
    },
  ];

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-line bg-paper-2 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-sm">
      {/* header: flag + country + vacancies */}
      <div className="flex items-center gap-2.5">
        {code && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://flagcdn.com/40x30/${code}.png`}
            alt=""
            width={28}
            height={21}
            loading="lazy"
            className="h-[19px] w-[26px] shrink-0 rounded-[3px] object-cover ring-1 ring-line"
          />
        )}
        <span className="text-sm text-ink-soft">{job.country}</span>
        <span className="ml-auto text-xs text-ink-mute">
          {job.vacancies} {t("vacancies").toLowerCase()}
        </span>
      </div>

      {/* title + category */}
      <h3 className="font-display mt-4 text-lg font-semibold leading-snug tracking-tight">
        {job.title}
      </h3>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-accent">
        {job.category}
      </div>

      {/* key facts */}
      <dl className="mt-5 mb-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-xs text-ink-mute">{t("salary")}</dt>
          <dd className="mt-0.5 font-medium text-ink">{job.salary}</dd>
        </div>
        {stats.slice(0, 3).map((s, i) => (
          <div key={i} className="min-w-0">
            <dt className="text-xs text-ink-mute">{s.label}</dt>
            <dd className="mt-0.5 truncate text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-mute">
          <CalendarClock className="h-3.5 w-3.5" />
          {deadline}
        </span>
        <Link
          href={{ pathname: "/jobs/apply", query: { position: job.title, country: job.country } }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:gap-2"
        >
          {t("apply")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function JobsBrowser({ jobs }: { jobs: Job[] }) {
  const t = useTranslations("jobs");
  const [country, setCountry] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const jobCountries = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.country))),
    [jobs]
  );
  const jobCategories = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.category))),
    [jobs]
  );

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (!country || j.country === country) &&
          (!category || j.category === category)
      ),
    [jobs, country, category]
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">
            {t("filterCountry")}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!country} onClick={() => setCountry("")}>
              {t("all")}
            </Chip>
            {jobCountries.map((c) => (
              <Chip key={c} active={country === c} onClick={() => setCountry(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">
            {t("filterCategory")}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!category} onClick={() => setCategory("")}>
              {t("all")}
            </Chip>
            {jobCategories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-mute">
        {t("resultsCount", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-soft">{t("noResults")}</p>
      ) : (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {filtered.map((job, i) => (
            <Reveal key={job.id} delay={i % 2} as="div">
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
