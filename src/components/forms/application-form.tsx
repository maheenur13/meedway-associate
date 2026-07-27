"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Field, fieldClass } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "./form-success";
import { siteConfig } from "@/lib/site-config";

const MAX_CV = 5 * 1024 * 1024; // 5 MB

export function ApplicationForm() {
  const t = useTranslations("apply");
  const tf = useTranslations("form");
  const params = useSearchParams();
  const cvRef = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const schema = z.object({
    fullName: z.string().min(1, tf("required")),
    phone: z.string().min(1, tf("required")),
    whatsapp: z.string().optional(),
    email: z.string().min(1, tf("required")).email(tf("invalidEmail")),
    position: z.string().min(1, tf("required")),
    country: z.string().optional(),
    experience: z.string().optional(),
    address: z.string().optional(),
    message: z.string().optional(),
  });
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: params.get("position") ?? "",
      country: params.get("country") ?? "",
    },
  });

  async function onSubmit(values: Values) {
    setFailed(false);
    setCvError(null);
    const file = cvRef.current?.files?.[0];
    if (file && file.size > MAX_CV) {
      setCvError(t("cvHint"));
      return;
    }
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (file) fd.append("cv", file);
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setFailed(true);
    }
  }

  if (done) return <FormSuccess message={t("success")} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <Field label={t("fields.fullName")} required error={errors.fullName?.message}>
        <input className={fieldClass} {...register("fullName")} />
      </Field>
      <Field label={t("fields.email")} required error={errors.email?.message}>
        <input type="email" className={fieldClass} {...register("email")} />
      </Field>
      <Field label={t("fields.phone")} required error={errors.phone?.message}>
        <input className={fieldClass} {...register("phone")} />
      </Field>
      <Field label={t("fields.whatsapp")}>
        <input className={fieldClass} {...register("whatsapp")} />
      </Field>
      <Field label={t("fields.position")} required error={errors.position?.message}>
        <input className={fieldClass} {...register("position")} />
      </Field>
      <Field label={t("fields.country")}>
        <select className={fieldClass} defaultValue={params.get("country") ?? ""} {...register("country")}>
          <option value="">{tf("selectOption")}</option>
          {siteConfig.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t("fields.experience")}>
        <input className={fieldClass} {...register("experience")} />
      </Field>
      <Field label={t("fields.address")}>
        <input className={fieldClass} {...register("address")} />
      </Field>
      <Field label={t("fields.cv")} error={cvError ?? undefined} className="sm:col-span-2">
        <input
          ref={cvRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft file:mr-4 file:rounded-md file:border-0 file:bg-accent-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent hover:file:brightness-95"
        />
        <span className="text-xs text-ink-mute">{t("cvHint")}</span>
      </Field>
      <Field label={t("fields.message")} className="sm:col-span-2">
        <textarea rows={4} className={fieldClass} {...register("message")} />
      </Field>
      <div className="sm:col-span-2">
        {failed && <p className="mb-3 text-sm text-danger">{t("error")}</p>}
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? tf("sending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
