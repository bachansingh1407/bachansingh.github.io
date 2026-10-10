import { ICONS } from "@/lib/icons";
import type { StackIcon } from "@/lib/types";

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const d = ICONS[name] ?? ICONS.layers;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Brand glyph from Simple Icons (path data is validated before it is ever stored). Falls back to the first letter. */
export function BrandIcon({ icon, name, size = 26 }: { icon: StackIcon | null; name: string; size?: number }) {
  if (icon) return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={icon.title || name}><path d={icon.path} /></svg>;
  return <span className="letter-icon" style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden="true">{name.trim()[0]?.toUpperCase() ?? "?"}</span>;
}
