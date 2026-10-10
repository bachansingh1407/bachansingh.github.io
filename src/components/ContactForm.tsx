"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONTACT_TOPICS } from "@/lib/defaults";
import { L } from "@/lib/limits";
import { isValidEmail } from "@/lib/validate";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const uid = useId();
  const [v, setV] = useState({ name: "", email: "", topic: CONTACT_TOPICS[0], message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [msg, setMsg] = useState("");
  const started = useRef(0);
  useEffect(() => { started.current = Date.now(); }, []);

  const check = (x = v): Errors => {
    const e: Errors = {};
    if (!x.name.trim()) e.name = "Please enter your name.";
    else if (x.name.length > L.messageName) e.name = `Keep your name under ${L.messageName} characters.`;
    if (!isValidEmail(x.email.trim())) e.email = "Please enter a valid email address.";
    if (x.message.trim().length < L.messageMin) e.message = `Please write at least ${L.messageMin} characters.`;
    else if (x.message.length > L.messageBody) e.message = `Please keep it under ${L.messageBody} characters.`;
    return e;
  };
  const shown = (k: keyof Errors) => (touched[k] || touched.all ? check()[k] ?? errors[k] : errors[k]);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ all: true });
    const errs = check();
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(`${uid}-${Object.keys(errs)[0]}`)?.focus(); return; }
    setState("sending"); setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, elapsed: Date.now() - started.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Errors };
      if (res.ok) { setState("sent"); return; }
      if (data.fields) setErrors(data.fields);
      setMsg(data.error ?? "Something went wrong. Please try again.");
      setState("failed");
    } catch {
      setMsg("Couldn't reach the server. Check your connection and try again.");
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div className="form-done" role="status">
        <b>Thanks, your message is in.</b>
        <span>I&apos;ll reply to {v.email.trim()} as soon as I can.</span>
      </div>
    );
  }

  const field = (k: "name" | "email", label: string, type: string, auto: string) => (
    <div className="ff">
      <label htmlFor={`${uid}-${k}`}>{label}</label>
      <input id={`${uid}-${k}`} type={type} autoComplete={auto} value={v[k]} onChange={set(k)} onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
        aria-invalid={!!shown(k)} aria-describedby={shown(k) ? `${uid}-${k}-e` : undefined} />
      {shown(k) ? <small id={`${uid}-${k}-e`} className="ferr">{shown(k)}</small> : null}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="cform">
      <div className="ff-grid">
        {field("name", "Your name", "text", "name")}
        {field("email", "Email", "email", "email")}
      </div>
      <div className="ff">
        <label htmlFor={`${uid}-topic`}>What is it about?</label>
        <select id={`${uid}-topic`} value={v.topic} onChange={set("topic")}>{CONTACT_TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      <div className="ff">
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea id={`${uid}-message`} rows={5} value={v.message} onChange={set("message")} onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          aria-invalid={!!shown("message")} aria-describedby={`${uid}-message-e`} />
        <div className="fmeta">
          <small id={`${uid}-message-e`} className="ferr">{shown("message") ?? ""}</small>
          <small className={v.message.length > L.messageBody ? "ferr" : ""}>{v.message.length}/{L.messageBody}</small>
        </div>
      </div>
      <div className="hp" aria-hidden="true">
        <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} /></label>
      </div>
      {state === "failed" ? <p className="ferr form-err" role="alert">{msg}</p> : null}
      <button className="btn primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
