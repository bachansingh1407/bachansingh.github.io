import { adminGuard, json } from "@/lib/api";
import { isSafeSvgPath } from "@/lib/icons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Icon { slug: string; title: string; path: string }
let cache: Icon[] | null = null;

async function all(): Promise<Icon[]> {
  if (cache) return cache;
  const mod = (await import("simple-icons")) as Record<string, unknown>;
  cache = Object.values(mod).filter((v): v is Icon => {
    const i = v as Partial<Icon> | null;
    return !!i && typeof i === "object" && typeof i.slug === "string" && typeof i.title === "string" && isSafeSvgPath(i.path);
  }).map((i) => ({ slug: i.slug, title: i.title, path: i.path }));
  return cache;
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** ?q=react searches icons. ?match=Node.js returns the single best exact match, for the "find icons automatically" button. */
export async function GET(req: Request) {
  const g = await adminGuard(req, false); if (g) return g;
  const url = new URL(req.url);
  try {
    const icons = await all();
    const match = url.searchParams.get("match");
    if (match !== null) {
      const n = norm(match);
      const hit = n ? icons.find((i) => norm(i.title) === n || i.slug === n) : undefined;
      return json({ icon: hit ?? null });
    }
    const q = norm(url.searchParams.get("q") ?? "");
    const found = q ? icons.filter((i) => norm(i.title).includes(q) || i.slug.includes(q)).slice(0, 24) : [];
    return json({ icons: found });
  } catch (e) {
    console.error("Icon search failed", e);
    return json({ error: "Icon search is unavailable right now." }, 503);
  }
}
