"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

/**
 * True only once the component has mounted on the client. Using
 * useSyncExternalStore (server snapshot = false, client snapshot = true)
 * avoids the "setState inside an effect" pattern for this — it resolves
 * on first client render instead of needing an extra render pass.
 */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // Avoid hydration mismatch: theme is only known client-side.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center border-[1px] border-ink dark:border-ink-dark text-ink dark:text-ink-dark transition-colors hover:bg-ink hover:text-white dark:hover:bg-ink-dark dark:hover:text-bg-dark"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={2.5} />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
