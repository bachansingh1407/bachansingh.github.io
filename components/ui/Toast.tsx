"use client";
import { useEffect, useState } from "react";
export default function Toast() {
  const [m, setM] = useState("");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const h = (e: Event) => { setM((e as CustomEvent<string>).detail); clearTimeout(t); t = setTimeout(() => setM(""), 2400); };
    window.addEventListener("toast", h);
    return () => { window.removeEventListener("toast", h); clearTimeout(t); };
  }, []);
  return <div id="toast" role="status" className={m ? "show" : ""}>{m}</div>;
}
