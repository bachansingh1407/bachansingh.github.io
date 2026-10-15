import type { Mode } from "./types";

export interface Colors {
  bg: string; surface: string; border: string; text: string; muted: string;
  accent: string; accentSoft: string; code: string; on: string;
}
export interface Palette { id: string; name: string; light: Colors; dark: Colors }
export interface AdminTheme { id: string; name: string; mode: "light" | "dark"; colors: Colors }

export const PALETTES: Palette[] = [
  { id: "indigo", name: "Indigo",
    light: { bg: "#ffffff", surface: "#f6f7fb", border: "#e3e6ee", text: "#1c2230", muted: "#5d6579", accent: "#2f5bea", accentSoft: "#eaefff", code: "#f3f4f8", on: "#ffffff" },
    dark: { bg: "#0f1218", surface: "#161a22", border: "#2a3040", text: "#e6e9ef", muted: "#9099ac", accent: "#8aa4ff", accentSoft: "#1b2440", code: "#171b24", on: "#0b0f1a" } },
  { id: "forest", name: "Forest",
    light: { bg: "#ffffff", surface: "#f4f8f5", border: "#e0e8e2", text: "#18241d", muted: "#566a5e", accent: "#1f7a4d", accentSoft: "#e3f3ea", code: "#f1f6f2", on: "#ffffff" },
    dark: { bg: "#0e1512", surface: "#141d19", border: "#26352e", text: "#e4ede8", muted: "#8fa398", accent: "#4fc98a", accentSoft: "#12291e", code: "#131c18", on: "#07140d" } },
  { id: "ocean", name: "Ocean",
    light: { bg: "#ffffff", surface: "#f3f8fb", border: "#dfe8ee", text: "#14232d", muted: "#566b78", accent: "#0b6fa4", accentSoft: "#e1f0f8", code: "#f0f5f8", on: "#ffffff" },
    dark: { bg: "#0c141a", surface: "#121c24", border: "#233440", text: "#e3edf3", muted: "#8ea4b2", accent: "#5cc0f0", accentSoft: "#11283a", code: "#111a21", on: "#06131b" } },
  { id: "amber", name: "Amber",
    light: { bg: "#fffdf9", surface: "#fbf7f0", border: "#eadfce", text: "#2a2114", muted: "#6b5f4d", accent: "#9c5600", accentSoft: "#fdecd2", code: "#f7f1e6", on: "#ffffff" },
    dark: { bg: "#15110a", surface: "#1d1810", border: "#3a2f1d", text: "#f1e8d8", muted: "#b0a08a", accent: "#f0b050", accentSoft: "#2c2210", code: "#1b160e", on: "#1a1004" } },
  { id: "rose", name: "Rose",
    light: { bg: "#ffffff", surface: "#fbf4f6", border: "#f0dfe5", text: "#2a1820", muted: "#6d5560", accent: "#c0275a", accentSoft: "#fde6ee", code: "#f8eff2", on: "#ffffff" },
    dark: { bg: "#170f13", surface: "#1f151a", border: "#3d2630", text: "#f4e6eb", muted: "#b79aa6", accent: "#ff8fb0", accentSoft: "#3a1827", code: "#1d1318", on: "#1f0710" } },
  { id: "slate", name: "Slate",
    light: { bg: "#ffffff", surface: "#f4f5f7", border: "#e2e5ea", text: "#1b1f27", muted: "#5b6270", accent: "#3d4a63", accentSoft: "#e7eaf0", code: "#f1f2f5", on: "#ffffff" },
    dark: { bg: "#111317", surface: "#181b21", border: "#2c313b", text: "#e7e9ee", muted: "#9aa1ae", accent: "#aab6d0", accentSoft: "#232a38", code: "#171a20", on: "#0d1118" } },
];

export const ADMIN_THEMES: AdminTheme[] = [
  { id: "daylight", name: "Daylight", mode: "light", colors: { bg: "#f7f8fb", surface: "#ffffff", border: "#e1e5ee", text: "#1a2030", muted: "#5a6376", accent: "#2f5bea", accentSoft: "#e8eeff", code: "#eef0f6", on: "#ffffff" } },
  { id: "paper", name: "Paper", mode: "light", colors: { bg: "#faf6ef", surface: "#fffdf8", border: "#e6dccb", text: "#2b241a", muted: "#6a5e4b", accent: "#8a4b12", accentSoft: "#f3e3cc", code: "#f3ecde", on: "#ffffff" } },
  { id: "midnight", name: "Midnight", mode: "dark", colors: { bg: "#0b1020", surface: "#121a30", border: "#222d4a", text: "#e5eaf7", muted: "#93a0bf", accent: "#7d9bff", accentSoft: "#1a2548", code: "#0f1730", on: "#08102a" } },
  { id: "graphite", name: "Graphite", mode: "dark", colors: { bg: "#141414", surface: "#1c1c1d", border: "#333335", text: "#ececed", muted: "#a0a0a6", accent: "#9ec1ff", accentSoft: "#25303f", code: "#1a1a1b", on: "#0c1220" } },
];

export const DEFAULT_PALETTE = "indigo";
export const MODES: Mode[] = ["system", "light", "dark"];
export const ADMIN_THEME_IDS = [...ADMIN_THEMES.map((t) => t.id), "system"];

export const isPalette = (id: unknown): id is string => PALETTES.some((p) => p.id === id);
export const isMode = (m: unknown): m is Mode => MODES.includes(m as Mode);

/* ---- contrast helpers (WCAG) ---- */
function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a: string, b: string): number {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function mix(a: string, b: string, t: number): string {
  const n = (h: string) => { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
  const x = n(a), y = n(b);
  return "#" + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, "0")).join("");
}
/** Input fill and border derived from the theme: the border always clears 3:1 against page, cards and the field itself. */
export function fieldColors(c: Colors, mode: "light" | "dark"): { field: string; border: string } {
  return { field: mix(c.text, c.surface, mode === "light" ? 0.035 : 0.07), border: mix(c.text, c.bg, 0.55) };
}

/** Pairs that must reach WCAG: 4.5:1 for text, 3:1 for input borders. */
export function contrastChecks(c: Colors, mode: "light" | "dark"): { label: string; ratio: number; min: number }[] {
  const f = fieldColors(c, mode);
  const t = (label: string, ratio: number, min = 4.5) => ({ label, ratio, min });
  return [
    t("Input border on background", contrast(f.border, c.bg), 3),
    t("Input border on cards", contrast(f.border, c.surface), 3),
    t("Input border on the field", contrast(f.border, f.field), 3),
    t("Text in inputs", contrast(c.text, f.field)),
    t("Placeholder text in inputs", contrast(c.muted, f.field)),
    t("Text on background", contrast(c.text, c.bg)),
    t("Text on cards", contrast(c.text, c.surface)),
    t("Muted text on background", contrast(c.muted, c.bg)),
    t("Muted text on cards", contrast(c.muted, c.surface)),
    t("Muted text on code blocks", contrast(c.muted, c.code)),
    t("Links on background", contrast(c.accent, c.bg)),
    t("Accent on soft tint", contrast(c.accent, c.accentSoft)),
    t("Button text on accent", contrast(c.on, c.accent)),
  ];
}

/* ---- CSS generation ---- */
const FIXED = {
  light: { warnBg: "#fff7e6", warnBorder: "#f2d28b", warnText: "#7a5200", danger: "#b3261e", codeStr: "#12724e", codeInline: "#6a2fd0", ok: "#17693f" },
  dark: { warnBg: "#2a2210", warnBorder: "#5a4716", warnText: "#e8c36a", danger: "#ff8a7d", codeStr: "#4fd1a1", codeInline: "#b794ff", ok: "#5fd39a" },
};

function vars(c: Colors, mode: "light" | "dark"): string {
  const f = FIXED[mode];
  const fc = fieldColors(c, mode);
  return `--field:${fc.field};--field-border:${fc.border};--bg:${c.bg};--surface:${c.surface};--side:${c.bg};--border:${c.border};--text:${c.text};--muted:${c.muted};--accent:${c.accent};--accent-soft:${c.accentSoft};--code-bg:${c.code};--on-accent:${c.on};--code-key:${c.text};--code-str:${f.codeStr};--code-inline:${f.codeInline};--warn-bg:${f.warnBg};--warn-border:${f.warnBorder};--warn-text:${f.warnText};--danger:${f.danger};--ok:${f.ok};color-scheme:${mode};`;
}

/** All public palettes and admin themes as one stylesheet. Values come from the constants above only. */
export function themeCss(): string {
  let css = "";
  for (const p of PALETTES) {
    css += `:root[data-palette="${p.id}"]{${vars(p.light, "light")}}`;
    css += `@media (prefers-color-scheme:dark){:root[data-palette="${p.id}"][data-mode="system"]{${vars(p.dark, "dark")}}}`;
    css += `:root[data-palette="${p.id}"][data-mode="dark"]{${vars(p.dark, "dark")}}`;
  }
  for (const t of ADMIN_THEMES) {
    css += `.adm-scope[data-admin-theme="${t.id}"]{${vars(t.colors, t.mode)}}`;
  }
  const day = ADMIN_THEMES[0], night = ADMIN_THEMES[2];
  css += `.adm-scope[data-admin-theme="system"]{${vars(day.colors, "light")}}`;
  css += `@media (prefers-color-scheme:dark){.adm-scope[data-admin-theme="system"]{${vars(night.colors, "dark")}}}`;
  return css;
}
