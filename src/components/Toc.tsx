"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Item { id: string; text: string; sub: boolean }

export function Toc() {
  const pathname = usePathname();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>("#article h2, #article h3"));
    const next = hs.map((h, i) => {
      if (!h.id) h.id = `section-${i}`;
      return { id: h.id, text: h.textContent ?? "", sub: h.tagName === "H3" };
    });
    setItems(next.length > 1 ? next : []);
  }, [pathname]);

  useEffect(() => {
    if (!items.length) return;
    const onScroll = () => {
      let cur = items[0].id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 150) cur = it.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (!items.length) return <aside className="toc" aria-hidden="true" />;
  return (
    <aside className="toc" aria-label="On this page">
      <h4>On this page</h4>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={`${it.sub ? "sub" : ""}${active === it.id ? " on" : ""}`}>
          {it.text}
        </a>
      ))}
    </aside>
  );
}
