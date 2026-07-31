import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  company: z.string().min(1),
  contact: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().optional(),
  category: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const d = schema.parse(await req.json());
    await prisma.workerRequest.create({
      data: {
        company: d.company,
        contact: d.contact,
        email: d.email,
        phone: d.phone,
        country: d.country || null,
        category: d.category || null,
        quantity: d.quantity || null,
        message: d.message || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
