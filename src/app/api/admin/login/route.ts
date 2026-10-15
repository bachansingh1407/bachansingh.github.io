import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_SECONDS, authConfigured, checkPassword, clientIp, createSessionValue, sameOrigin } from "@/lib/auth";
import { json } from "@/lib/api";
import { clear, hit, peek } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 5, WINDOW = 15 * 60 * 1000;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!authConfigured()) return json({ error: "Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET." }, 503);

  const key = "login:" + clientIp(req);
  const wait = peek(key, MAX);
  if (wait) return json({ error: "Too many attempts.", retryAfter: wait }, 429);

  let password = "";
  try { const b = (await req.json()) as { password?: unknown }; password = typeof b.password === "string" ? b.password : ""; }
  catch { return json({ error: "Invalid request." }, 400); }

  if (!checkPassword(password)) {
    const blocked = hit(key, MAX, WINDOW);
    await new Promise((r) => setTimeout(r, 600));
    return json({ error: "Wrong password.", retryAfter: blocked || undefined }, 401);
  }
  clear(key);
  (await cookies()).set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS,
  });
  return json({ ok: true });
}
