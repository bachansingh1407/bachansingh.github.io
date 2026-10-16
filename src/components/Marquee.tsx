import type { StackGroup } from "@/lib/types";
import { BrandIcon } from "./Icon";

/** Slow scrolling strip of the tools you use. Pauses on hover; becomes a static wrapped list when motion is reduced. */
export function Marquee({ groups }: { groups: StackGroup[] }) {
  const items = groups.flatMap((g) => g.items);
  if (items.length < 4) return null;
  const row = (hidden: boolean) => items.map((i) => (
    <span className="mq-item" key={`${hidden}-${i.uid}`} aria-hidden={hidden || undefined}><BrandIcon icon={i.icon} name={i.name} size={22} />{i.name}</span>
  ));
  return (
    <div className="marquee" aria-label="Tools I work with" role="group">
      <div className="marquee-track">{row(false)}{row(true)}</div>
    </div>
  );
}
