import { Icon } from "./Icon";

/** Same category always gets the same hue. Text keeps the theme's text colour so contrast never depends on the hue. */
export function hueOf(s: string): number {
  let h = 0;
  for (const ch of s.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}
export function CategoryChip({ name, floating = false }: { name: string; floating?: boolean }) {
  if (!name) return null;
  return (
    <span className={`cchip${floating ? " floating" : ""}`} style={{ ["--h" as string]: String(hueOf(name)) }}>
      <Icon name="tag" size={13} />{name}
    </span>
  );
}
