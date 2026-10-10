export interface FlowNode {
  id: string; title: string; text: string; kind: "start" | "process" | "end"; icon: string;
  from: string[]; chips: string[]; href?: string;
}
export interface Placed extends FlowNode { level: number; band: number; col: number; row: number }

/**
 * Auto-layout for the flow diagram: a node sits one column right of its right-most input.
 * Long chains wrap into bands of `perBand` columns. Unknown inputs are ignored and cycles can't loop forever.
 */
export function layoutFlow(nodes: FlowNode[], perBand: number): Placed[] {
  const ids = new Set(nodes.map((n) => n.id));
  const level = new Map<string, number>();
  const parents = (n: FlowNode) => n.from.filter((f) => ids.has(f) && f !== n.id);
  for (let pass = 0; pass <= nodes.length; pass++) {
    let changed = false;
    for (const n of nodes) {
      const l = parents(n).length ? 1 + Math.max(...parents(n).map((f) => level.get(f) ?? 0)) : 0;
      if (l !== (level.get(n.id) ?? -1) && l <= nodes.length) { level.set(n.id, l); changed = true; }
    }
    if (!changed) break;
  }
  const per = Math.max(1, perBand);
  const slot = new Map<number, number>();
  return nodes.map((n) => {
    const lv = level.get(n.id) ?? 0;
    const row = slot.get(lv) ?? 0;
    slot.set(lv, row + 1);
    return { ...n, level: lv, band: Math.floor(lv / per), col: lv % per, row };
  });
}
