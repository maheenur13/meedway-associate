"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Field, fieldClass } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "./form-success";

export function ContactForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("form");
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);

  const schema = z.object({
    name: z.string().min(1, tf("required")),
    email: z.string().min(1, tf("required")).email(tf("invalidEmail")),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1, tf("required")),
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
      const res = await fetch("/api/contact", {
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
      <Field label={t("fields.name")} required error={errors.name?.message}>
        <input className={fieldClass} placeholder="Jane Doe" {...register("name")} />
      </Field>
      <Field label={t("fields.email")} required error={errors.email?.message}>
        <input type="email" className={fieldClass} placeholder="name@company.com" {...register("email")} />
      </Field>
      <Field label={t("fields.phone")}>
        <input className={fieldClass} placeholder="+880 …" {...register("phone")} />
      </Field>
      <Field label={t("fields.subject")}>
        <input className={fieldClass} {...register("subject")} />
      </Field>
      <Field label={t("fields.message")} required error={errors.message?.message} className="sm:col-span-2">
        <textarea rows={5} className={fieldClass} {...register("message")} />
      </Field>
      <div className="sm:col-span-2">
        {failed && <p className="mb-3 text-sm text-danger">{t("error")}</p>}
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? tf("sending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
