import { RichText } from "@/components/RichText";
import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("experience"), "experience") };
}

export default async function ExperiencePage() {
  const pub = await requirePage("experience");
  return (
    <>
      <h1>{pageTitle(pub, "experience")}</h1>
      <p className="lead">Selected engineering work, described generally.</p>
      {pub.work.map((w) => (
        <section key={w.id}>
          <h2 id={w.id}>{w.title}</h2>
          {w.org || w.dates ? (
            <div className="meta">
              {w.org ? <span className="pill">{w.org}</span> : null}
              {w.dates ? <span className="pill">{w.dates}</span> : null}
            </div>
          ) : null}
          {w.blurb ? <p>{w.blurb}</p> : null}
          {w.items.length ? (
            <div className="rows">
              {w.items.map((it, i) => (
                <div className="row-static" key={i}>
                  {it.title ? <b>{it.title}</b> : null}
                  {it.text ? <span>{it.text}</span> : null}
                </div>
              ))}
            </div>
          ) : null}
          {w.outcome ? <RichText text={w.outcome} /> : null}
        </section>
      ))}
    </>
  );
}
