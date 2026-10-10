"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useFocusTrap } from "./useFocusTrap";

interface Msg { role: "user" | "assistant"; content: string }

/** "Ask about my work": answers come from the published site content only, through the server (the key never reaches the browser). */
export function AskWidget({ name, questions }: { name: string; questions: string[] }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const panel = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));
  const end = useRef<HTMLDivElement>(null);
  const tid = useId();

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy, open]);

  async function send(q: string) {
    const content = q.trim().slice(0, 400);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = (await res.json().catch(() => ({}))) as { answer?: string; error?: string };
      if (!res.ok || !data.answer) throw new Error(data.error ?? "Something went wrong.");
      setMsgs([...next, { role: "assistant", content: data.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <button className="ask-fab" onClick={() => setOpen(true)} aria-haspopup="dialog"><Icon name="sparkles" size={18} /><span>Ask AI</span></button>
      {open ? (
        <div className="ask-wrap" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="ask" ref={panel} role="dialog" aria-modal="true" aria-labelledby={tid}>
            <header>
              <div><h2 id={tid}>Ask about {name.split(" ")[0]}&apos;s work</h2><small>AI answers from this site&apos;s content. It can make mistakes.</small></div>
              <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
            </header>
            <div className="ask-log" aria-live="polite">
              {msgs.length === 0 ? (
                <div className="ask-empty">
                  <p>Try one of these:</p>
                  <div className="chips">{questions.map((q) => <button key={q} className="chipbtn" onClick={() => send(q)}>{q}</button>)}</div>
                </div>
              ) : msgs.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.content}</div>)}
              {busy ? <div className="bubble assistant typing" aria-label="Thinking"><i /><i /><i /></div> : null}
              {error ? <p className="ferr" role="alert">{error}</p> : null}
              <div ref={end} />
            </div>
            <form className="ask-form" onSubmit={(e) => { e.preventDefault(); void send(text); }}>
              <label className="sr-only" htmlFor={`${tid}-q`}>Your question</label>
              <input id={`${tid}-q`} value={text} maxLength={400} placeholder="Ask a question…" autoComplete="off" onChange={(e) => setText(e.target.value)} />
              <button className="btn primary sm" disabled={busy || !text.trim()}>Send</button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
