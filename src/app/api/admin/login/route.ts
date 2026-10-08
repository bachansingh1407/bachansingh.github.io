import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE, SESSION_SECONDS, authConfigured, checkPassword, createSessionValue, sameOrigin,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort limiter: per server instance only. For stronger protection add an edge rate limit.
const attempts = new Map<string, { n: number; reset: number }>();
const MAX = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!authConfigured()) {
    return NextResponse.json({ error: "Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET." }, { status: 503 });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.reset > now && rec.n >= MAX) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    const cur = rec && rec.reset > now ? rec : { n: 0, reset: now + WINDOW_MS };
    cur.n += 1;
    attempts.set(ip, cur);
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  attempts.delete(ip);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return NextResponse.json({ ok: true });
}
