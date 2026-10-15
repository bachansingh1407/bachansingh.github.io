"use client";

import { useEffect, useRef, useState } from "react";
import { PALETTES } from "@/lib/themes";
import type { Mode } from "@/lib/types";

const MODES: { id: Mode; label: string }[] = [{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }, { id: "system", label: "System" }];

export function ThemePicker({ palettes, defaultPalette, defaultMode }: { palettes: string[]; defaultPalette: string; defaultMode: Mode }) {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(defaultPalette);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = document.documentElement.dataset;
    if (d.palette) setPalette(d.palette);
    if (d.mode) setMode(d.mode as Mode);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function apply(p: string, m: Mode) {
    setPalette(p); setMode(m);
    document.documentElement.dataset.palette = p;
    document.documentElement.dataset.mode = m;
    document.cookie = `pf_theme=${p}.${m}; path=/; max-age=31536000; samesite=lax`;
  }

  const list = PALETTES.filter((p) => palettes.includes(p.id));
  const current = list.find((p) => p.id === palette) ?? list[0];

  return (
    <div className="themepick" ref={box}>
      <button className="icon-btn" aria-label="Change theme" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="swatch" style={{ background: current?.light.accent }} />
      </button>
      {open ? (
        <div className="themepop" role="dialog" aria-label="Theme">
          <div className="seg" role="radiogroup" aria-label="Appearance">
            {MODES.map((m) => (
              <button key={m.id} role="radio" aria-checked={mode === m.id} className={mode === m.id ? "on" : ""} onClick={() => apply(palette, m.id)}>{m.label}</button>
            ))}
          </div>
          {list.length > 1 ? (
            <div className="swatches" role="group" aria-label="Colour theme">
              {list.map((p) => (
                <button key={p.id} className={p.id === palette ? "on" : ""} aria-label={p.name} aria-pressed={p.id === palette} title={p.name}
                  onClick={() => apply(p.id, mode)} style={{ background: p.light.accent }} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
