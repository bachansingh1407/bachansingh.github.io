"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-in animation. Content is visible in the server HTML and stays visible if scripts fail, the
 * visitor prefers reduced motion, or it is already on screen. It only hides itself once it is confirmed
 * to be below the fold, and a timer always shows it, so a page can never be left blank.
 */
export function Reveal({ children, delay = 0, className = "", y = 22 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [armed, setArmed] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    setArmed(true);
    const failsafe = setTimeout(() => setForced(true), 5000);
    return () => clearTimeout(failsafe);
  }, []);

  const hidden = armed && !seen && !forced;
  return (
    <motion.div ref={ref} className={className} initial={false}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: hidden ? 0 : delay, ease: [0.21, 0.47, 0.32, 0.98] }}>
      {children}
    </motion.div>
  );
}
