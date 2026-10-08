import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("stack"), "stack") };
}

export default async function StackPage() {
  const pub = await requirePage("stack");
  return (
    <>
      <h1>{pageTitle(pub, "stack")}</h1>
      <p className="lead">Technologies grouped by purpose.</p>
      {pub.stack.map((g) => (
        <section key={g.id}>
          <h2 id={g.id}>{g.name}</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Technology</th><th>Used for</th></tr></thead>
              <tbody>
                {g.items.map((i) => (
                  <tr key={i.name}><td>{i.name}</td><td>{i.description}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
