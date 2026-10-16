"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** One place that makes every Motion animation respect the visitor's "reduce motion" setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
