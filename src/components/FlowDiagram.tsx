"use client";

import "@xyflow/react/dist/style.css";
import { Background, BackgroundVariant, Handle, MarkerType, Position, ReactFlow, type NodeProps, type NodeTypes } from "@xyflow/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildFlow, type FlowNode, type StepData } from "@/lib/flow";
import { Icon } from "./Icon";

const DEFAULT_ICON = { start: "flag", process: "layers", end: "rocket" } as const;

/** One box in the diagram. The small rings are the connection points, like in a node editor. */
function StepNode(props: NodeProps) {
  const d = props.data as unknown as StepData;
  const chips = d.chips.slice(0, 3), more = d.chips.length - chips.length;
  return (
    <div className={`xnode k-${d.kind}`}>
      <Handle id="tl" type="target" position={Position.Left} isConnectable={false} style={{ top: 25 }} />
      <Handle id="tr" type="target" position={Position.Right} isConnectable={false} style={{ top: 25 }} />
      <Handle id="tt" type="target" position={Position.Top} isConnectable={false} />
      <Handle id="sl" type="source" position={Position.Left} isConnectable={false} style={{ top: 25 }} />
      <Handle id="sr" type="source" position={Position.Right} isConnectable={false} style={{ top: 25 }} />
      <Handle id="sb" type="source" position={Position.Bottom} isConnectable={false} />
      <header><Icon name={d.icon || DEFAULT_ICON[d.kind]} size={17} /><h3>{d.href ? <Link href={d.href} className="nodrag">{d.title}</Link> : d.title}</h3></header>
      <div className="xbody">
        {d.text ? <p>{d.text}</p> : null}
        {chips.length ? <div className="xchips"><small>Used in this step</small><div>{chips.map((c) => <span key={c}>{c}</span>)}{more > 0 ? <span>+{more}</span> : null}</div></div> : null}
      </div>
    </div>
  );
}
const nodeTypes = { step: StepNode } as unknown as NodeTypes;

/**
 * "How I work" diagram built with React Flow. Boxes are placed automatically from each step's inputs,
 * long chains wrap in a snake pattern, and the canvas is scaled to fit its container. It is read-only
 * and never captures page scrolling. Hovering a box highlights the lines connected to it.
 */
export default function FlowDiagram({ nodes, label, onReady }: { nodes: FlowNode[]; label: string; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || 1000);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    onReady?.();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const g = useMemo(() => buildFlow(nodes, width), [nodes, width]);
  const edges = useMemo(() => g.edges.map((e) => ({
    ...e,
    className: hover ? (e.source === hover || e.target === hover ? "hl" : "dim") : "",
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
  })), [g.edges, hover]);

  return (
    <div className="xflow" ref={wrap} style={{ height: Math.ceil(g.height * g.zoom) + 24 }} role="group" aria-label={label}>
      <ReactFlow
        key={`${g.per}-${g.zoom.toFixed(3)}-${nodes.length}`}
        nodes={g.nodes} edges={edges} nodeTypes={nodeTypes}
        defaultViewport={{ x: g.offsetX, y: 12, zoom: g.zoom }} minZoom={g.zoom} maxZoom={g.zoom}
        nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false}
        panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false} panOnScroll={false} preventScrolling={false}
        onNodeMouseEnter={(_: unknown, n: { id: string }) => setHover(n.id)} onNodeMouseLeave={() => setHover(null)}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
      </ReactFlow>
    </div>
  );
}
