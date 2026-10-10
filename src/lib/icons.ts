/** Small built-in UI icon set (24x24, stroke). Used by the admin and by the flow diagram. */
export const ICONS: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  pencil: "M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3",
  hammer: "M14 4l6 6-3 3-6-6zM12 8L4 16l4 4 8-8",
  check: "M5 12l5 5L20 7",
  refresh: "M20 11a8 8 0 0 0-14-4M4 5v4h4M4 13a8 8 0 0 0 14 4M20 19v-4h-4",
  rocket: "M5 19c0-3 1-4 3-5M14 4c4 0 6 2 6 6-2 4-5 7-9 8l-5-5c1-4 4-7 8-9zM14 10h.01",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  flag: "M5 21V4M5 5h13l-2 4 2 4H5",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14",
  database: "M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0zM4 12c0 2 16 2 16 0M4 6c0 2 16 2 16 0",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8",
  shield: "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  folder: "M3 6h6l2 2h10v11H3z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-1-1-2h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z",
  inbox: "M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeoff: "M3 3l18 18M10 6a9 9 0 0 1 12 6c-1 2-2 3-4 4M6 7c-2 1-3 3-4 5 2 4 6 7 10 7 1 0 2 0 3-1",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01",
  palette: "M12 3a9 9 0 0 0 0 18c2 0 2-1 2-2s1-2 2-2h2a3 3 0 0 0 3-3c0-6-4-11-9-11zM8 11h.01M12 8h.01M16 11h.01",
  link: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
  sparkles: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 3v4M17 5h4",
  chat: "M4 5h16v11H9l-5 4z",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6",
  dots: "M12 5h.01M12 12h.01M12 19h.01",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01",
  arrow: "M5 12h14M13 6l6 6-6 6",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  history: "M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 8v5l3 2",
  upload: "M12 16V5M7 9l5-5 5 5M5 20h14",
};
export const ICON_NAMES = Object.keys(ICONS);
/** Icons offered for flow steps in the admin. */
export const STEP_ICONS = ["search", "bulb", "pencil", "hammer", "code", "check", "flask", "refresh", "rocket", "layers", "database", "shield", "flag", "user", "briefcase", "chat", "mail"] as const;

/** Brand icon paths are stored in content, so only plain SVG path commands are accepted. */
export function isSafeSvgPath(p: unknown): p is string {
  return typeof p === "string" && p.length > 0 && p.length <= 2000 && /^[MmLlHhVvCcSsQqTtAaZz0-9eE\s.,+-]+$/.test(p);
}
