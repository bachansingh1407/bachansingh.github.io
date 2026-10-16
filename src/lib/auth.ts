import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "portfolio_session";
export const PREVIEW_COOKIE = "pf_preview";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

function secret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}
export function authConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && secret() !== null;
}
function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "").update(payload).digest("base64url");
}
export function createSessionValue(): string {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}
export function verifySessionValue(value: string | undefined): boolean {
  if (!value || !secret()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
export async function isAuthed(): Promise<boolean> {
  return verifySessionValue((await cookies()).get(SESSION_COOKIE)?.value);
}
/** Preview needs both the flag and a valid admin session, so visitors can never trigger it. */
export async function isPreview(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(PREVIEW_COOKIE)?.value === "1" && verifySessionValue(jar.get(SESSION_COOKIE)?.value);
}
export function checkPassword(input: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  return timingSafeEqual(createHash("sha256").update(input).digest(), createHash("sha256").update(real).digest());
}
/** CSRF guard for state-changing requests: Origin, when present, must match the Host. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.get("host"); } catch { return false; }
}
export function clientIp(req: Request): string {
  return req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}
