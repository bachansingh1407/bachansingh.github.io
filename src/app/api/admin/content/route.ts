import { NextResponse } from "next/server";
import { isAuthed, sameOrigin } from "@/lib/auth";
import { getContentStrict } from "@/lib/content";
import { normalizeContent } from "@/lib/normalize";
import { writeRaw } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_000_000;

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ content: await getContentStrict() });
  } catch {
    return NextResponse.json({ error: "Could not read stored content." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "Content is too large." }, { status: 413 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = normalizeContent(parsed);
  content.updated = new Date().toISOString().slice(0, 10);
  try {
    await writeRaw(content);
  } catch (e) {
    console.error("Save failed", e);
    return NextResponse.json({ error: "Could not save. Check the content storage setup." }, { status: 500 });
  }
  return NextResponse.json({ content });
}
