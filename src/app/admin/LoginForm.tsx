"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminThemeSwitch } from "./AdminThemeSwitch";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setInterval(() => setWait((w) => Math.max(0, w - 1)), 1000);
    return () => clearInterval(t);
  }, [wait]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || wait > 0) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (res.ok) { router.refresh(); return; }
      const data = (await res.json().catch(() => ({}))) as { error?: string; retryAfter?: number };
      setError(data.error ?? "Sign-in failed.");
      if (data.retryAfter) setWait(data.retryAfter);
      setPassword("");
    } catch { setError("Could not reach the server. Check your connection."); }
    finally { setBusy(false); }
  }

  const mins = Math.floor(wait / 60), secs = String(wait % 60).padStart(2, "0");
  return (
    <main className="adm-login">
      <div style={{ position: "fixed", top: "1rem", right: "1rem" }}><AdminThemeSwitch /></div>
      <div className="adm-login-card">
        <svg width="34" height="34" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="12" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="4 3.2" /><circle cx="15" cy="15" r="4.2" fill="var(--accent)" /></svg>
        <h1>Portfolio admin</h1>
        <p>Sign in to edit and publish your site.</p>
        <form onSubmit={submit} noValidate>
          <div className="adm-field">
            <label htmlFor="pw">Password</label>
            <div className="pw">
              <input id="pw" type={show ? "text" : "password"} autoComplete="current-password" autoFocus value={password} aria-invalid={error ? true : undefined}
                aria-describedby={error ? "pw-e" : undefined} style={{ paddingRight: "4.5rem" }}
                onChange={(e) => setPassword(e.target.value)} onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
            </div>
            {caps ? <small>Caps Lock is on.</small> : null}
            {error ? <small id="pw-e" className="err" role="alert">{error}{wait > 0 ? ` Try again in ${mins}:${secs}.` : ""}</small> : null}
          </div>
          <button className="adm-btn primary" style={{ width: "100%" }} disabled={busy || wait > 0 || !password}>
            {busy ? "Signing in…" : wait > 0 ? `Locked for ${mins}:${secs}` : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
