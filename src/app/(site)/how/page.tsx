import { CodeBlock } from "@/components/CodeBlock";
import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("how"), "how") };
}

export default async function HowPage() {
  const pub = await requirePage("how");
  return (
    <>
      <h1>{pageTitle(pub, "how")}</h1>
      {pub.how.intro ? <p className="lead">{pub.how.intro}</p> : null}
      <h2>The steps</h2>
      <ol className="steps">
        {pub.how.steps.map((s, i) => (
          <li key={i}><b>{s.title}</b>{s.text}</li>
        ))}
      </ol>
      <h2>Recording a decision</h2>
      <p>Every case study has a Decisions section in this shape: the options considered, the choice made and the reason.</p>
      <CodeBlock
        name="decision.json"
        data={{
          decision: "What was being decided",
          options: ["Option A", "Option B"],
          choice: "The option picked",
          reason: "Why, in one or two sentences",
        }}
      />
    </>
  );
}
