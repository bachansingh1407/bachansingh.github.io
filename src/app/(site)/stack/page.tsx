import { StackMap } from "@/components/StackMap";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("stack");
  return buildMeta(pub, { title: pageTitle(pub, "stack"), description: "The tools I use and why.", path: "/stack" });
}

export default async function StackPage() {
  const pub = await requirePage("stack");
  const hasNotes = pub.stack.some((g) => g.items.some((i) => i.why || i.how || i.alternatives));
  return (
    <>
      <h1>{pageTitle(pub, "stack")}</h1>
      <p className="lead">{hasNotes ? "The tools I use, and why. Open a tool to read how I use it." : "The tools I use, grouped by layer."}</p>
      <StackMap groups={pub.stack} />
    </>
  );
}
