"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar at the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}
