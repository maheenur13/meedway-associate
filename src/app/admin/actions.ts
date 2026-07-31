"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export type JobInput = {
  id?: string;
  title: string;
  category: string;
  country: string;
  vacancies: number;
  salary: string;
  workingHours: string;
  contract: string;
  experience: string;
  accommodation: boolean;
  deadline: string | null; // ISO date or null
  documents: string[];
  published: boolean;
};

function revalidateJobs() {
  revalidatePath("/admin/jobs");
  revalidatePath("/", "layout");
}

export async function upsertJob(input: JobInput) {
  const data = {
    title: input.title.trim(),
    category: input.category.trim(),
    country: input.country.trim(),
    vacancies: Number(input.vacancies) || 1,
    salary: input.salary,
    workingHours: input.workingHours,
    contract: input.contract,
    experience: input.experience,
    accommodation: input.accommodation,
    deadline: input.deadline ? new Date(input.deadline) : null,
    documents: JSON.stringify(input.documents.filter(Boolean)),
    published: input.published,
  };
  if (input.id) {
    await prisma.job.update({ where: { id: input.id }, data });
  } else {
    await prisma.job.create({ data });
  }
  revalidateJobs();
  return { ok: true };
}

export async function removeJob(id: string) {
  await prisma.job.delete({ where: { id } });
  revalidateJobs();
  return { ok: true };
}

export async function setJobPublished(id: string, published: boolean) {
  await prisma.job.update({ where: { id }, data: { published } });
  revalidateJobs();
  return { ok: true };
}

export async function updateStatus(
  kind: "application" | "request" | "message",
  id: string,
  status: string
) {
  if (kind === "application") {
    await prisma.application.update({ where: { id }, data: { status } });
    revalidatePath("/admin/applications");
  } else if (kind === "request") {
    await prisma.workerRequest.update({ where: { id }, data: { status } });
    revalidatePath("/admin/requests");
  } else {
    await prisma.contactMessage.update({ where: { id }, data: { status } });
    revalidatePath("/admin/messages");
  }
  return { ok: true };
}

export async function updateSettings(values: Record<string, string>) {
  const keys = ["name", "licence", "md", "address", "phone", "email", "whatsapp", "hours"];
  for (const key of keys) {
    const valueEn = String(values[key] ?? "");
    await prisma.siteContent.upsert({
      where: { key },
      update: { valueEn },
      create: { key, valueEn },
    });
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { ok: true };
}
