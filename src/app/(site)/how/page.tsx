import { CodeBlock } from "@/components/CodeBlock";
import { Flow } from "@/components/Flow";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("how");
  return buildMeta(pub, { title: pageTitle(pub, "how"), description: pub.how.intro, path: "/how" });
}

export default async function HowPage() {
  const pub = await requirePage("how");
  const nodes = pub.how.steps.map((s) => ({ id: s.uid, title: s.title, text: s.text, kind: s.kind, icon: s.icon, from: s.from, chips: s.chips }));
  return (
    <>
      <p className="eyebrow">Process</p>
      <h1>{pageTitle(pub, "how")}</h1>
      {pub.how.intro ? <p className="lead">{pub.how.intro}</p> : null}
      <div className="flowframe" style={{ margin: "1.8rem 0" }}>
        <div className="flow-top"><div className="legend" aria-hidden="true"><span className="k-start"><i />Start</span><span className="k-process"><i />Step</span><span className="k-end"><i />Result</span></div><span className="flow-hint">Hover a step to trace its path</span></div>
        <Flow nodes={nodes} label="How I work, step by step" />
      </div>
      <h2>Recording a decision</h2>
      <p>Every case study has a Decisions section in this shape: the options considered, the choice made and the reason.</p>
      <CodeBlock name="decision.json" data={{ decision: "What was being decided", options: ["Option A", "Option B"], choice: "The option picked", reason: "Why, in one or two sentences" }} />
    </>
  );
}
