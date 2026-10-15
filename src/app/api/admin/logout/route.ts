import { cookies } from "next/headers";
import { PREVIEW_COOKIE, SESSION_COOKIE, sameOrigin } from "@/lib/auth";
import { json } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  jar.set(PREVIEW_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return json({ ok: true });
}
