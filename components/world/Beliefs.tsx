import { portfolio as P } from "@/data/portfolio";
export default function Beliefs() {
  return (
    <section className="room" aria-labelledby="hbel">
      <h2 id="hbel">Things I believe about code</h2>
      <p className="hand">ten panels, zero motivational posters →</p>
      <ol className="panels">{P.beliefs.map((b, i) => (
        <li key={b.quote} className={`panel ${i % 2 ? "pg" : "pp"} s${i % 5}`}>
          <span className="sticker tagline">{b.tag}</span>
          <blockquote>{b.quote}</blockquote>
          <span className="tail" aria-hidden="true" />
        </li>))}
      </ol>
    </section>
  );
}
