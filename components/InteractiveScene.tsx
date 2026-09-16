"use client";

import { useEffect, useState } from "react";

const scenes = [
  { label: "problem", text: "Start with the messy bit.", tone: "violet" },
  { label: "model", text: "Turn complexity into a system.", tone: "cyan" },
  { label: "product", text: "Make the system feel simple.", tone: "lime" },
  { label: "iterate", text: "Ship, inspect, improve.", tone: "pink" },
];

export default function InteractiveScene() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((v) => (v + 1) % scenes.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const scene = scenes[active];

  return (
    <div className="scene-card">
      <div className="scene-top">
        <span className="live-dot" />
        <span>THINKING_LOOP</span>
        <span className="scene-index">0{active + 1}/04</span>
      </div>
      <div className={`scene-orbit ${scene.tone}`}>
        <span className="orbit-line one" />
        <span className="orbit-line two" />
        <span className="orbit-node node-a" />
        <span className="orbit-node node-b" />
        <span className="orbit-node node-c" />
        <div className="scene-core">
          <small>{scene.label}</small>
          <strong>{scene.text}</strong>
        </div>
      </div>
      <div className="scene-tabs">
        {scenes.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={i === active ? "active" : ""}
            aria-label={`Show ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}