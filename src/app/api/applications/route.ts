import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const get = (k: string) => {
      const v = form.get(k);
      return typeof v === "string" && v.trim() ? v.trim() : null;
    };

    const fullName = get("fullName");
    const email = get("email");
    const phone = get("phone");
    if (!fullName || !email || !phone) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Save CV locally in dev. TODO: upload to Cloudinary in production.
    let cvName: string | null = null;
    let cvPath: string | null = null;
    const cv = form.get("cv");
    if (cv instanceof File && cv.size > 0) {
      const dir = path.join(process.cwd(), "public", "uploads", "cv");
      await mkdir(dir, { recursive: true });
      const safe = cv.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${randomUUID()}-${safe}`;
      const buffer = Buffer.from(await cv.arrayBuffer());
      await writeFile(path.join(dir, filename), buffer);
      cvName = cv.name;
      cvPath = `/uploads/cv/${filename}`;
    }

    await prisma.application.create({
      data: {
        fullName,
        email,
        phone,
        whatsapp: get("whatsapp"),
        position: get("position"),
        country: get("country"),
        experience: get("experience"),
        address: get("address"),
        message: get("message"),
        cvName,
        cvPath,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
