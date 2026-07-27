import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fields = Object.fromEntries(
      [...form.entries()].filter(([, v]) => typeof v === "string")
    );
    const cv = form.get("cv");
    const cvName = cv instanceof File && cv.size > 0 ? cv.name : null;

    if (!fields.fullName || !fields.phone) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // TODO: upload `cv` to Cloudinary, then persist to DB (Application) with the URL.
    console.log("[application] new application:", { ...fields, cvName });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
