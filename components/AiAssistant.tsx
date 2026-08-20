"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { site } from "@/data/site";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Minimal inline-Markdown renderer for assistant replies.
// Handles **bold**, *italic*, `code`, and line breaks — no extra dependency needed.
function renderInlineMarkdown(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const tokens: ReactNode[] = [];
    // Matches **bold**, *italic*, or `code`
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = pattern.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(line.slice(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**")) {
        tokens.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith("`")) {
        tokens.push(
          <code key={key++} className="rounded bg-ink/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-ink-dark/10">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        tokens.push(<em key={key++}>{token.slice(1, -1)}</em>);
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < line.length) {
      tokens.push(line.slice(lastIndex));
    }

    return (
      <span key={lineIdx}>
        {tokens}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

const STARTERS = [
  "What has Bachan built?",
  "What's his tech stack?",
  "Is he open to freelance work?",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (!res.ok || !data.reply) {
        setError(data?.error || "Couldn't get a response. Try again.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Toggle button — bottom-right, always available */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open portfolio assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center border-[1px] border-ink bg-bg text-ink shadow-[4px_4px_0_0_#0a0a0a] transition-transform hover:-translate-y-0.5 dark:border-ink-dark dark:bg-bg-dark dark:text-ink-dark dark:shadow-[4px_4px_0_0_#f2f2ed]"
      >
        {open ? <X size={18} /> : <Sparkles size={18} className="text-accent dark:text-accent-dark" />}
      </button>

      {/* Right-side panel */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-dvh w-full max-w-sm flex-col border-l-[1px] border-ink bg-bg text-ink transition-transform duration-300 ease-out dark:border-ink-dark dark:bg-bg-dark dark:text-ink-dark ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-[1px] border-ink px-5 py-4 dark:border-ink-dark">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent dark:text-accent-dark">
              Ask about {site.firstName}
            </div>
            {/* <div className="text-sm font-bold">Portfolio assistant</div> */}
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="text-sub hover:text-ink dark:text-sub-dark dark:hover:text-ink-dark"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div>
              <p className="mb-4 text-sm text-sub dark:text-sub-dark font-montserrat">
                Ask me anything about {site.firstName}&apos;s projects, skills, or experience.
              </p>
              <div className="flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="border-[1px] border-ink px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-ink hover:text-bg dark:border-ink-dark dark:hover:bg-ink-dark dark:hover:text-bg-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap font-montserrat text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end border-[1px] border-ink bg-ink px-3 py-2 text-bg dark:border-ink-dark dark:bg-ink-dark dark:text-bg-dark"
                    : "self-start px-1 text-ink dark:text-ink-dark"
                }`}
              >
                {m.role === "assistant" ? renderInlineMarkdown(m.content) : m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start px-1 font-mono text-xs text-sub dark:text-sub-dark">
                Thinking…
              </div>
            )}
          </div>

          {error && (
            <p className="mt-3 font-mono text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t-[1px] border-ink px-4 py-3 dark:border-ink-dark"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 bg-transparent font-montserrat text-sm outline-none placeholder:text-sub dark:placeholder:text-sub-dark"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex h-8 w-8 items-center justify-center border-[1px] border-ink text-ink transition-colors hover:bg-ink hover:text-bg disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink dark:border-ink-dark dark:text-ink-dark dark:hover:bg-ink-dark dark:hover:text-bg-dark"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* Backdrop on small screens so the panel reads as a modal, not a stuck sidebar */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/20 backdrop-blur-[1px] sm:hidden"
        />
      )}
    </>
  );
}