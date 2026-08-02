"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SETTING_KEYS } from "@/lib/settings-fields";
import { TRADE_ICON_NAMES, DEFAULT_TRADE_ICON } from "@/lib/trade-icons";
import { REACH_CODES } from "@/lib/reach-map";

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

export type TradeCategoryInput = {
  id?: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  sortOrder: number;
  published: boolean;
};

function revalidateTrades() {
  revalidatePath("/admin/trades");
  revalidatePath("/", "layout");
}

export async function upsertTradeCategory(input: TradeCategoryInput) {
  const nameEn = input.nameEn.trim();
  if (!nameEn) return { ok: false, error: "An English name is required." };

  const data = {
    nameEn,
    nameBn: input.nameBn.trim() || null,
    // Reject unknown icon names here rather than letting a bad value reach the
    // public grid, where it would silently render the fallback icon.
    icon: TRADE_ICON_NAMES.includes(input.icon) ? input.icon : DEFAULT_TRADE_ICON,
    sortOrder: Number.isFinite(input.sortOrder) ? Math.trunc(input.sortOrder) : 0,
    published: input.published,
  };

  if (input.id) {
    await prisma.tradeCategory.update({ where: { id: input.id }, data });
  } else {
    await prisma.tradeCategory.create({ data });
  }
  revalidateTrades();
  return { ok: true };
}

export async function removeTradeCategory(id: string) {
  await prisma.tradeCategory.delete({ where: { id } });
  revalidateTrades();
  return { ok: true };
}

export async function setTradeCategoryPublished(id: string, published: boolean) {
  await prisma.tradeCategory.update({ where: { id }, data: { published } });
  revalidateTrades();
  return { ok: true };
}

export type ReachCountryInput = {
  id?: string;
  code: string;
  nameEn: string;
  nameBn: string;
  workers: number;
  pill: boolean;
  sortOrder: number;
  published: boolean;
};

function revalidateReach() {
  revalidatePath("/admin/reach");
  revalidatePath("/", "layout");
}

export async function upsertReachCountry(input: ReachCountryInput) {
  const nameEn = input.nameEn.trim();
  if (!nameEn) return { ok: false, error: "An English name is required." };

  const code = input.code.trim().toLowerCase();
  // Without coordinates the pin cannot be drawn, so refuse here rather than
  // let a row exist that the map silently skips.
  if (!REACH_CODES.includes(code)) {
    return { ok: false, error: `No map position is defined for "${code}".` };
  }

  const data = {
    code,
    nameEn,
    nameBn: input.nameBn.trim() || null,
    workers: Number.isFinite(input.workers) ? Math.max(0, Math.trunc(input.workers)) : 0,
    pill: input.pill,
    sortOrder: Number.isFinite(input.sortOrder) ? Math.trunc(input.sortOrder) : 0,
    published: input.published,
  };

  try {
    if (input.id) {
      await prisma.reachCountry.update({ where: { id: input.id }, data });
    } else {
      await prisma.reachCountry.create({ data });
    }
  } catch {
    // `code` is unique — the realistic failure is adding a country twice.
    return { ok: false, error: `"${code}" is already in the list.` };
  }
  revalidateReach();
  return { ok: true };
}

export async function removeReachCountry(id: string) {
  await prisma.reachCountry.delete({ where: { id } });
  revalidateReach();
  return { ok: true };
}

export async function setReachCountryPublished(id: string, published: boolean) {
  await prisma.reachCountry.update({ where: { id }, data: { published } });
  revalidateReach();
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

/**
 * Deletes an application and the CV file that came with it.
 *
 * Uploaded CVs live under public/uploads/cv, which is publicly served — so
 * removing only the database row would leave someone's CV downloadable at a
 * guessable URL. That is worse than not deleting at all, particularly since
 * applications hold name, phone, address and the CV itself.
 */
export async function removeApplication(id: string) {
  const row = await prisma.application.findUnique({
    where: { id },
    select: { cvPath: true },
  });

  await prisma.application.delete({ where: { id } });

  if (row?.cvPath) {
    const uploads = path.join(process.cwd(), "public", "uploads", "cv");
    const target = path.resolve(
      process.cwd(),
      "public",
      row.cvPath.replace(/^[/\\]+/, "")
    );
    // Only ever unlink inside the CV folder — cvPath is stored data, and a
    // crafted value must not be able to reach the rest of the filesystem.
    if (target.startsWith(uploads + path.sep)) {
      await unlink(target).catch(() => {
        // Already gone, or the deploy has an ephemeral filesystem. The row is
        // deleted either way; don't fail the action over the file.
      });
    }
  }

  revalidatePath("/admin/applications");
  return { ok: true };
}

export type SettingsInput = Record<string, { en?: string; bn?: string }>;

/**
 * Saves the Content page. Only known keys are written, and a blank value means
 * "fall back to the built-in default" (see src/lib/settings.ts).
 */
export async function updateSettings(values: SettingsInput) {
  for (const key of SETTING_KEYS) {
    const valueEn = String(values[key]?.en ?? "").trim();
    const valueBn = String(values[key]?.bn ?? "").trim();
    await prisma.siteContent.upsert({
      where: { key },
      update: { valueEn, valueBn },
      create: { key, valueEn, valueBn },
    });
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { ok: true };
}
