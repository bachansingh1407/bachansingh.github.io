import { CodeBlock } from "@/components/CodeBlock";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("how");
  return buildMeta(pub, { title: pageTitle(pub, "how"), description: pub.how.intro, path: "/how" });
}

export default async function HowPage() {
  const pub = await requirePage("how");
  return (
    <>
      <h1>{pageTitle(pub, "how")}</h1>
      {pub.how.intro ? <p className="lead">{pub.how.intro}</p> : null}
      <h2>The steps</h2>
      <ol className="steps">{pub.how.steps.map((s) => <li key={s.uid}><b>{s.title}</b>{s.text}</li>)}</ol>
      <h2>Recording a decision</h2>
      <p>Every case study has a Decisions section in this shape: the options considered, the choice made and the reason.</p>
      <CodeBlock name="decision.json" data={{ decision: "What was being decided", options: ["Option A", "Option B"], choice: "The option picked", reason: "Why, in one or two sentences" }} />
    </>
  );
}
