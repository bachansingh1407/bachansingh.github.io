"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import type { FlowNode } from "@/lib/flow";
import { Icon } from "./Icon";
import Link from "next/link";

const FlowDiagram = dynamic(() => import("./FlowDiagram"), { ssr: false });
const DEFAULT_ICON = { start: "flag", process: "layers", end: "rocket" } as const;

/** Plain, readable version of the steps. Shown before the diagram loads, without JavaScript, and if the diagram ever fails. */
export function FlowList({ nodes }: { nodes: FlowNode[] }) {
  return (
    <ol className="flowlist">
      {nodes.map((n, i) => (
        <li key={n.id} className={`k-${n.kind}`}>
          <header><span className="fl-n">{i + 1}</span><Icon name={n.icon || DEFAULT_ICON[n.kind]} size={16} /><h3>{n.href ? <Link href={n.href}>{n.title}</Link> : n.title}</h3></header>
          {n.text ? <p>{n.text}</p> : null}
          {n.chips.length ? <div className="xchips"><div>{n.chips.map((c) => <span key={c}>{c}</span>)}</div></div> : null}
        </li>
      ))}
    </ol>
  );
}

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** The diagram, with the plain list underneath as a safety net so the section can never come up blank. */
export function Flow({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={`flowwrap${ready && !failed ? " ready" : ""}`}>
      {!ready || failed ? <FlowList nodes={nodes} /> : null}
      {mounted && !failed ? (
        <div className="flow-layer">
          <Boundary onError={() => setFailed(true)}><FlowDiagram nodes={nodes} label={label} onReady={() => setReady(true)} /></Boundary>
        </div>
      ) : null}
    </div>
  );
}
