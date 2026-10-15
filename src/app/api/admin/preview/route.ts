import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Turns the draft preview on or off for the signed-in owner, then redirects to a site path. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!(await isAuthed())) return NextResponse.redirect(new URL("/admin", req.url));
  const next = url.searchParams.get("next") ?? "/";
  const safe = /^\/(?!\/)[^\s]*$/.test(next) ? next : "/";
  const res = NextResponse.redirect(new URL(safe, req.url));
  if (url.searchParams.get("on") === "1") {
    res.cookies.set(PREVIEW_COOKIE, "1", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 4 });
  } else {
    res.cookies.set(PREVIEW_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  }
  res.headers.set("Cache-Control", "no-store");
  return res;
}
