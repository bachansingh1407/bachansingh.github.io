import { NextRequest, NextResponse } from "next/server";
import { site } from "@/data/site";

export const runtime = "edge";

// Rebuilt on every request from data/site.ts, so the assistant is always
// in sync with the rest of the portfolio — one file to edit, everywhere.
function buildSystemPrompt() {
  const projects = site.projects
    .map((p) => `- ${p.name}: ${p.description}`)
    .join("\n");
  const experience = site.experience
    .map((e) => `- ${e.role} at ${e.company} (${e.time}): ${e.description}`)
    .join("\n");
  const skills = site.skills
    .map((g) => `- ${g.category}: ${g.items.join(", ")}`)
    .join("\n");

  return `You are the portfolio assistant for ${site.name}, a ${site.role} based in ${site.location}.
Answer questions a visitor might ask about ${site.firstName} — background, skills, projects, experience, and how to get in touch.
Speak ABOUT ${site.firstName} in third person, like a helpful assistant on their site, e.g. "${site.firstName} built..." or "${site.firstName}'s experience includes...".
Be concise: 2-4 sentences per answer unless the visitor asks for detail. No markdown headers, keep it plain text with occasional line breaks.
If asked something unrelated to ${site.firstName}, their work, or hiring/collaborating with them, politely say that's outside what you can help with here and steer back to the portfolio.

ABOUT
${site.about.text}

SKILLS
${skills}

PROJECTS
${projects}

EXPERIENCE
${experience}

CONTACT
Email: ${site.contact.email}
GitHub: ${site.socials.github}
LinkedIn: ${site.socials.linkedin}`;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GROQ_API_KEY." },
      { status: 500 }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // Keep the request small and cheap — only send the last few turns.
  const recent = messages.slice(-8);

  // llama-3.3-70b-versatile was retired by Groq on 2026-08-16 (free/dev
  // tiers). openai/gpt-oss-120b is Groq's recommended replacement.
  const primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const fallbackModel = "openai/gpt-oss-20b";

  async function callGroq(model: string) {
    return fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...recent],
        temperature: 0.4,
        max_tokens: 400,
      }),
    });
  }

  try {
    let groqRes = await callGroq(primaryModel);

    // If the configured model has been deprecated/decommissioned on Groq's
    // side, retry once with a known-good fallback instead of failing the
    // whole request.
    if (!groqRes.ok && (groqRes.status === 400 || groqRes.status === 404)) {
      const errBody = await groqRes.clone().text();
      if (/decommission|deprecat|does not exist/i.test(errBody) && primaryModel !== fallbackModel) {
        console.warn(`Groq model "${primaryModel}" unavailable, retrying with "${fallbackModel}"`);
        groqRes = await callGroq(fallbackModel);
      }
    }

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errText);
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      return NextResponse.json(
        { error: "The assistant returned an empty response. Try rephrasing." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the assistant." },
      { status: 500 }
    );
  }
}