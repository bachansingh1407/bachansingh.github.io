import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { deleteMessage, updateMessage } from "@/lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req, 2_000); if (isResponse(body)) return body;
  const { id } = await ctx.params;
  const b = (body ?? {}) as { read?: unknown; archived?: unknown };
  try {
    const m = await updateMessage(id, {
      read: typeof b.read === "boolean" ? b.read : undefined,
      archived: typeof b.archived === "boolean" ? b.archived : undefined,
    });
    return m ? json({ message: m }) : json({ error: "Message not found." }, 404);
  } catch { return json({ error: "Could not update the message." }, 500); }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await adminGuard(req, true); if (g) return g;
  const { id } = await ctx.params;
  try { return (await deleteMessage(id)) ? json({ ok: true }) : json({ error: "Message not found." }, 404); }
  catch { return json({ error: "Could not delete the message." }, 500); }
}
