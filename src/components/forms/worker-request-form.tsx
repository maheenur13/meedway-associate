"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Field, fieldClass } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "./form-success";
import { siteConfig } from "@/lib/site-config";

const categories = [
  "Construction",
  "Factory",
  "Drivers",
  "Cleaners",
  "Hotel & restaurant",
  "Electricians",
  "Plumbers",
  "Welders",
  "Caregivers",
  "General workers",
];

export function WorkerRequestForm() {
  const t = useTranslations("requestWorkers");
  const tf = useTranslations("form");
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);

  const schema = z.object({
    company: z.string().min(1, tf("required")),
    contact: z.string().min(1, tf("required")),
    email: z.string().min(1, tf("required")).email(tf("invalidEmail")),
    phone: z.string().min(1, tf("required")),
    country: z.string().optional(),
    category: z.string().optional(),
    quantity: z.string().optional(),
    message: z.string().optional(),
  });
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setFailed(false);
    try {
      const res = await fetch("/api/worker-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setFailed(true);
    }
  }

  if (done) return <FormSuccess message={t("success")} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <Field label={t("fields.company")} required error={errors.company?.message}>
        <input className={fieldClass} {...register("company")} />
      </Field>
      <Field label={t("fields.contact")} required error={errors.contact?.message}>
        <input className={fieldClass} {...register("contact")} />
      </Field>
      <Field label={t("fields.email")} required error={errors.email?.message}>
        <input type="email" className={fieldClass} {...register("email")} />
      </Field>
      <Field label={t("fields.phone")} required error={errors.phone?.message}>
        <input className={fieldClass} {...register("phone")} />
      </Field>
      <Field label={t("fields.country")}>
        <select className={fieldClass} defaultValue="" {...register("country")}>
          <option value="" disabled>
            {tf("selectOption")}
          </option>
          {siteConfig.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t("fields.category")}>
        <select className={fieldClass} defaultValue="" {...register("category")}>
          <option value="" disabled>
            {tf("selectOption")}
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t("fields.quantity")}>
        <input type="number" min={1} className={fieldClass} {...register("quantity")} />
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
