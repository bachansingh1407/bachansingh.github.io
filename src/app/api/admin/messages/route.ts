import { adminGuard, json } from "@/lib/api";
import { getDraftState } from "@/lib/content";
import { listMessages } from "@/lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = await adminGuard(req, false); if (g) return g;
  try {
    const { draft } = await getDraftState();
    return json({ messages: await listMessages(draft.contact.retentionDays) });
  } catch {
    return json({ error: "Could not load messages." }, 500);
  }
}
