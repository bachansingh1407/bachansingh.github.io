import type { Message } from "./types";

/** Optional email alert through Resend. Silent no-op unless RESEND_API_KEY, NOTIFY_EMAIL and NOTIFY_FROM are set. */
export async function notifyNewMessage(m: Pick<Message, "name" | "email" | "topic" | "message">): Promise<void> {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL, from = process.env.NOTIFY_FROM;
  if (!key || !to || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: m.email,
        subject: `Portfolio message: ${m.topic}`.slice(0, 120),
        text: `From: ${m.name} <${m.email}>\nTopic: ${m.topic}\n\n${m.message}`,
      }),
    });
  } catch (e) {
    console.error("Notification failed", e);
  }
}
