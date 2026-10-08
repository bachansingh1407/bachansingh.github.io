import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getContentStrict } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getContentStrict();
  return new NextResponse(JSON.stringify(content, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-content-${content.updated}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
