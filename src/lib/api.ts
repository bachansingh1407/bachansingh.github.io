import { NextResponse } from "next/server";
import { isAuthed, sameOrigin } from "./auth";

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Auth + CSRF guard for admin routes. Returns a response to send, or null when the request may proceed. */
export async function adminGuard(req: Request, write: boolean): Promise<NextResponse | null> {
  if (!(await isAuthed())) return json({ error: "Your session expired. Reload the page and sign in again." }, 401);
  if (write && !sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  return null;
}
export async function readJsonBody(req: Request, maxBytes = 1_000_000): Promise<unknown | NextResponse> {
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415);
  const text = await req.text();
  if (text.length > maxBytes) return json({ error: "That is too large to save." }, 413);
  try { return JSON.parse(text); } catch { return json({ error: "Invalid JSON." }, 400); }
}
export const isResponse = (v: unknown): v is NextResponse => v instanceof NextResponse;
