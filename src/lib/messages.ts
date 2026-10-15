import { randomBytes } from "crypto";
import { MAX_MESSAGES } from "./limits";
import { del, getJson, list, setJson } from "./store";
import type { Message } from "./types";

const ID = /^\d{14}-[a-f0-9]{6}$/;
export const isMessageId = (s: string) => ID.test(s);

export async function createMessage(m: Pick<Message, "name" | "email" | "topic" | "message">): Promise<"ok" | "full"> {
  const keys = await list("messages/");
  if (keys.length >= MAX_MESSAGES) return "full";
  const id = `${String(Date.now()).padStart(14, "0")}-${randomBytes(3).toString("hex")}`;
  await setJson(`messages/${id}`, { id, at: new Date().toISOString(), ...m, read: false, archived: false } satisfies Message);
  return "ok";
}

/** Newest first. Messages older than the retention period are deleted as a side effect. */
export async function listMessages(retentionDays: number): Promise<Message[]> {
  const keys = (await list("messages/")).reverse();
  const all = (await Promise.all(keys.map((k) => getJson<Message>(k)))).filter(Boolean) as Message[];
  if (!retentionDays) return all;
  const cutoff = Date.now() - retentionDays * 86400000;
  const keep: Message[] = [];
  for (const m of all) {
    if (new Date(m.at).getTime() < cutoff) await del(`messages/${m.id}`);
    else keep.push(m);
  }
  return keep;
}

export async function updateMessage(id: string, patch: { read?: boolean; archived?: boolean }): Promise<Message | null> {
  if (!isMessageId(id)) return null;
  const m = await getJson<Message>(`messages/${id}`);
  if (!m) return null;
  const next = { ...m, ...(typeof patch.read === "boolean" ? { read: patch.read } : {}), ...(typeof patch.archived === "boolean" ? { archived: patch.archived } : {}) };
  await setJson(`messages/${id}`, next);
  return next;
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (!isMessageId(id)) return false;
  await del(`messages/${id}`);
  return true;
}
