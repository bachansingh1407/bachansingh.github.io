"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { layoutFlow, type FlowNode } from "@/lib/flow";
import { Icon } from "./Icon";

const DEFAULT_ICON = { start: "flag", process: "layers", end: "rocket" } as const;
interface Line { key: string; from: string; to: string; d: string }

const STEP = 0.09;

const nodeV: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: (delay: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.5, ease: "easeOut" } }),
};
const lineV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration: 0.7, ease: "easeInOut" }, opacity: { delay, duration: 0.1 } },
  }),
};
const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({ opacity: 1, transition: { delay, duration: 0.5 } }),
};

/**
 * A connected-steps diagram. Boxes are laid out automatically from their "takes input from" links and
 * wrap into rows on narrower screens; connector lines are measured from the real boxes. When the diagram
 * scrolls into view the steps appear one by one, the connectors draw themselves, and a light beam keeps
 * travelling along each connector. The list stays in reading order for screen readers, lines are decorative.
 */
export function FlowGraph({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLElement | null>>({});
  const [per, setPer] = useState(4);
  const [lines, setLines] = useState<Line[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const marker = "ah" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const placed = useMemo(() => layoutFlow(nodes, per), [nodes, per]);
  const names = useMemo(() => new Map(nodes.map((n) => [n.id, n.title])), [nodes]);
  const edgeCount = useMemo(() => nodes.reduce((sum, n) => sum + n.from.length, 0), [nodes]);
  const lineBase = nodes.length * STEP * 0.55;

  // Arrowheads only appear once the connectors have finished drawing.
  useEffect(() => { if (reduce) setArmed(true); }, [reduce]);
  const onEnter = () => {
    if (reduce) return;
    window.setTimeout(() => setArmed(true), (lineBase + edgeCount * 0.08 + 0.8) * 1000);
  };

  // How many columns fit.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setPer(Math.max(1, Math.min(4, Math.floor(el.clientWidth / 250))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rows: each band gets as many grid rows as its tallest column.
  const rowOffset = useMemo(() => {
    const rows: Record<number, number> = {};
    placed.forEach((p) => { rows[p.band] = Math.max(rows[p.band] ?? 1, p.row + 1); });
    const off: Record<number, number> = {};
    let acc = 0;
    Object.keys(rows).map(Number).sort((a, b) => a - b).forEach((b) => { off[b] = acc; acc += rows[b]; });
    return off;
  }, [placed]);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const draw = () => {
      const c = el.getBoundingClientRect();
      const rel = (n: HTMLElement) => { const r = n.getBoundingClientRect(); return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height }; };
      const out: Line[] = [];
      for (const n of nodes) for (const f of n.from) {
        const a = els.current[f], b = els.current[n.id];
        if (!a || !b || f === n.id) continue;
        const A = rel(a), B = rel(b);
        let d: string;
        if (B.x >= A.x + A.w - 4) {
          const sx = A.x + A.w, sy = A.y + A.h / 2, ex = B.x, ey = B.y + B.h / 2, dx = Math.max(24, (ex - sx) / 2);
          d = `M${sx},${sy} C${sx + dx},${sy} ${ex - dx},${ey} ${ex},${ey}`;
        } else {
          const sx = A.x + A.w / 2, sy = A.y + A.h, ex = B.x + B.w / 2, ey = B.y, dy = Math.max(24, (ey - sy) / 2);
          d = `M${sx},${sy} C${sx},${sy + dy} ${ex},${ey - dy} ${ex},${ey}`;
        }
        out.push({ key: `${f}>${n.id}`, from: f, to: n.id, d });
      }
      setLines(out);
    };
    const raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => requestAnimationFrame(draw));
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [placed, nodes]);

  return (
    <motion.div
      className="flow"
      ref={wrap}
      role="group"
      aria-label={label}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={onEnter}
    >
      <svg className="flow-lines" aria-hidden="true">
        <defs>
          <marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker>
        </defs>
        {lines.map((l, i) => {
          const state = hover && (l.from === hover || l.to === hover) ? "hl" : hover ? "dim" : "";
          const delay = lineBase + i * 0.08;
          return (
            <g key={l.key}>
              <motion.path d={l.d} markerEnd={armed ? `url(#${marker})` : undefined} className={state} variants={lineV} custom={delay} />
              <motion.g variants={fadeV} custom={delay + 0.9}>
                <path d={l.d} pathLength={100} className={`beam ${state}`} style={{ animationDelay: `${(i % 5) * 0.35}s` }} />
              </motion.g>
            </g>
          );
        })}
      </svg>
      <ol className="flow-grid" style={{ gridTemplateColumns: `repeat(${per}, minmax(0, 1fr))` }}>
        {placed.map((n, idx) => (
          <li key={n.id} style={{ gridColumn: n.col + 1, gridRow: rowOffset[n.band] + n.row + 1 }} ref={(el: HTMLLIElement | null) => { els.current[n.id] = el; }}>
            <motion.article
              className={`fnode k-${n.kind}`}
              tabIndex={0}
              variants={nodeV}
              custom={idx * STEP}
              whileHover={reduce ? undefined : { y: -3 }}
              onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
              <header>
                <span className="ficon"><Icon name={n.icon || DEFAULT_ICON[n.kind]} size={17} /></span>
                <h3>{n.href ? <Link href={n.href}>{n.title}</Link> : n.title}</h3>
              </header>
              <div className="fbody">
                {n.text ? <p>{n.text}</p> : null}
                {n.chips.length ? (
                  <div className="fchips"><small>Used in this step</small><div>{n.chips.map((c) => <span key={c}>{c}</span>)}</div></div>
                ) : null}
                {n.from.length ? <span className="sr-only">Takes input from: {n.from.map((f) => names.get(f)).filter(Boolean).join(", ")}.</span> : null}
              </div>
            </motion.article>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}