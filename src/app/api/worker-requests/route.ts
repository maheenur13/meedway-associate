import { NextResponse } from "next/server";
import { z } from "zod";

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
    const data = schema.parse(await req.json());
    // TODO: persist to DB (WorkerRequest) and notify the team.
    console.log("[worker-request] new request:", data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
