export interface FlowNode {
  id: string; title: string; text: string; kind: "start" | "process" | "end"; icon: string;
  from: string[]; chips: string[]; href?: string;
}
export interface Placed extends FlowNode { level: number; band: number; col: number; row: number }

/**
 * Auto-layout: a node sits one column right of its right-most input. Long chains wrap into bands of
 * `perBand` columns. With `snake`, every other band runs right-to-left so the hand-over between bands is a
 * short drop instead of a long diagonal. Unknown inputs are ignored and cycles can't loop forever.
 */
export function layoutFlow(nodes: FlowNode[], perBand: number, snake = false): Placed[] {
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
    const band = Math.floor(lv / per);
    const c = lv % per;
    return { ...n, level: lv, band, col: snake && band % 2 === 1 ? per - 1 - c : c, row };
  });
}

/* ---- geometry for the React Flow canvas ---- */
export const NODE_W = 252;
export const NODE_H = 188;
export const GAP_X = 44;
export const GAP_Y = 56;

export interface StepData { title: string; text: string; kind: FlowNode["kind"]; icon: string; chips: string[]; href?: string }
export interface BuiltNode { id: string; type: "step"; position: { x: number; y: number }; width: number; height: number; draggable: false; selectable: false; data: StepData }
export interface BuiltEdge { id: string; source: string; target: string; sourceHandle: string; targetHandle: string; animated: boolean; type: "default" }
export interface BuiltFlow { nodes: BuiltNode[]; edges: BuiltEdge[]; width: number; height: number; zoom: number; offsetX: number; per: number }

/** Which side of each box a connector leaves and enters, so lines always take the short, tidy route. */
export function route(a: { x: number; y: number }, b: { x: number; y: number }): { sourceHandle: string; targetHandle: string } {
  const dx = b.x - a.x;
  if (Math.abs(dx) > 8) return dx > 0 ? { sourceHandle: "sr", targetHandle: "tl" } : { sourceHandle: "sl", targetHandle: "tr" };
  return { sourceHandle: "sb", targetHandle: "tt" };
}

export function buildFlow(nodes: FlowNode[], containerWidth: number): BuiltFlow {
  const W = Math.max(240, containerWidth);
  const per = Math.max(1, Math.min(4, Math.floor((W + GAP_X) / (NODE_W + GAP_X))));
  const placed = layoutFlow(nodes, per, true);
  const bandRows: Record<number, number> = {};
  placed.forEach((p) => { bandRows[p.band] = Math.max(bandRows[p.band] ?? 1, p.row + 1); });
  const offset: Record<number, number> = {};
  let acc = 0;
  Object.keys(bandRows).map(Number).sort((a, b) => a - b).forEach((b) => { offset[b] = acc; acc += bandRows[b]; });
  const totalRows = Math.max(1, acc);
  const levels = placed.length ? Math.max(...placed.map((p) => p.level)) + 1 : 1;
  const cols = Math.min(per, levels);
  const width = cols * NODE_W + (cols - 1) * GAP_X;
  const height = totalRows * NODE_H + (totalRows - 1) * GAP_Y;
  const zoom = Math.min(1, W / width);

  const pos = new Map<string, { x: number; y: number }>();
  const built: BuiltNode[] = placed.map((p) => {
    const position = { x: p.col * (NODE_W + GAP_X), y: (offset[p.band] + p.row) * (NODE_H + GAP_Y) };
    pos.set(p.id, position);
    return { id: p.id, type: "step", position, width: NODE_W, height: NODE_H, draggable: false, selectable: false, data: { title: p.title, text: p.text, kind: p.kind, icon: p.icon, chips: p.chips, href: p.href } };
  });
  const ids = new Set(nodes.map((n) => n.id));
  const edges: BuiltEdge[] = [];
  for (const n of nodes) for (const f of n.from) {
    if (f === n.id || !ids.has(f)) continue;
    edges.push({ id: `${f}>${n.id}`, source: f, target: n.id, ...route(pos.get(f)!, pos.get(n.id)!), animated: true, type: "default" });
  }
  return { nodes: built, edges, width, height, zoom, offsetX: Math.max(0, (W - width * zoom) / 2), per };
}
