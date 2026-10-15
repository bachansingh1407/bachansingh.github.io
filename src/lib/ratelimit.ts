const buckets = new Map<string, { n: number; reset: number }>();

/** Best-effort, per server instance. Returns seconds to wait when blocked, otherwise 0. */
export function hit(key: string, max: number, windowMs: number, now = Date.now()): number {
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return 0;
  }
  if (b.n >= max) return Math.ceil((b.reset - now) / 1000);
  b.n += 1;
  return 0;
}
export function peek(key: string, max: number, now = Date.now()): number {
  const b = buckets.get(key);
  return b && b.reset > now && b.n >= max ? Math.ceil((b.reset - now) / 1000) : 0;
}
export function clear(key: string) { buckets.delete(key); }
