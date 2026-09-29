import { portfolio as P } from "@/data/portfolio";
export default function DeveloperSaveFile() {
  return (
    <section id="experience" className="room" aria-labelledby="he">
      <h2 id="he">Developer Save File</h2>
      <div className="box">
        <p><b>Level:</b> {P.level}</p><p><b>Experience</b></p>
        <div className="bar" role="img" aria-label="Three to five years of experience"><div /></div>
        <p style={{ margin: ".3rem 0 1rem" }}>1.5+ years</p>
        <p><b>Quests completed</b></p>
        <ul className="quests">{P.quests.map((q) => <li key={q}>{q}</li>)}</ul>
      </div>
      {P.chapters.map((c) => (<details key={c.title} className="ch box"><summary>{c.title}</summary><p>{c.body}</p></details>))}
    </section>
  );
}
