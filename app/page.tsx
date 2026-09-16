import PortfolioMascot from "../components/Mascot";
import InteractiveScene from "../components/InteractiveScene";

const projects = [
  {
    number: "01",
    title: "Career OS",
    kicker: "CAREER INTELLIGENCE",
    description:
      "A career operating system that turns evidence, applications, interview stories and skill gaps into one connected workflow.",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Auth.js", "Zod"],
    accent: "violet",
    details: ["Evidence-derived skill state", "ATS analysis", "Application tracking", "Interview analytics"],
  },
  {
    number: "02",
    title: "PathForge",
    kicker: "LEARNING SYSTEM",
    description:
      "An interactive learning roadmap where capabilities become a branching dependency graph instead of a static checklist.",
    stack: ["Next.js", "React Flow", "Zustand", "Drizzle", "PostgreSQL"],
    accent: "cyan",
    details: ["Dependency graph", "Progress state", "Recommendations", "RBAC + audit logs"],
  },
  {
    number: "03",
    title: "Digital Literacy OS",
    kicker: "DISCOVERY PIPELINE",
    description:
      "A source-driven intelligence pipeline that collects, normalizes, deduplicates, classifies and scores useful information.",
    stack: ["Python", "FastAPI", "SQLAlchemy", "APScheduler"],
    accent: "lime",
    details: ["RSS / GitHub / PyPI / arXiv", "Normalization", "Deduplication", "Scoring pipeline"],
  },
];

export default function Home() {
  return (
    <main>
      <div className="grain" />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="Home">
          <span className="brand-mark">YN</span>
          <span>product engineer</span>
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#thinking">Thinking</a>
          <a href="#lab">Lab</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-contact" href="mailto:hello@example.com">Let&apos;s talk ↗</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> AVAILABLE FOR INTERESTING PROBLEMS</div>
          <h1>
            I build <em>systems</em>
            <br />
            that feel like
            <br />
            <span className="outlined">magic.</span>
          </h1>
          <p className="hero-sub">
            Product-minded engineer exploring the space between <b>complex systems</b>,
            <b> useful products</b> and <b>delightful interfaces</b>.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore the work <span>↘</span></a>
            <a className="button ghost" href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>

        <div className="hero-visual">
          <InteractiveScene />
          <PortfolioMascot />
          <div className="floating-note note-one"><span>01</span> model the problem</div>
          <div className="floating-note note-two"><span>02</span> design the experience</div>
        </div>
      </section>

      <section className="marquee" aria-label="Skills">
        <div>PRODUCT THINKING <span>✦</span> FULL STACK <span>✦</span> SYSTEM DESIGN <span>✦</span> UI / UX <span>✦</span> AI EXPERIMENTS <span>✦</span> PRODUCT THINKING <span>✦</span></div>
      </section>

      <section className="work section" id="work">
        <div className="section-head">
          <div>
            <span className="section-no">01 — SELECTED WORK</span>
            <h2>Things I&apos;ve been<br /><i>building.</i></h2>
          </div>
          <p>Not just features. Each project is an attempt to understand a messy problem, model it and turn it into a usable product.</p>
        </div>

        <div className="project-stack">
          {projects.map((project) => (
            <article className={`project ${project.accent}`} key={project.title}>
              <div className="project-number">{project.number}</div>
              <div className="project-main">
                <span className="project-kicker">{project.kicker}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">{project.stack.map((s) => <span key={s}>{s}</span>)}</div>
              </div>
              <div className="project-diagram" aria-hidden="true">
                <div className="diagram-center">{project.title}</div>
                {project.details.map((detail, i) => (
                  <div className={`diagram-pill p${i}`} key={detail}>{detail}</div>
                ))}
                <span className="connector c1" /><span className="connector c2" /><span className="connector c3" /><span className="connector c4" />
              </div>
              <a className="project-arrow" href="#about" aria-label={`Learn more about ${project.title}`}>↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="thinking section" id="thinking">
        <div className="section-head">
          <div>
            <span className="section-no">02 — HOW I THINK</span>
            <h2>Make the<br /><i>complex</i> simple.</h2>
          </div>
          <p>The interesting part of software is rarely the syntax. It&apos;s deciding what the system should mean, how it should behave and how a human should experience it.</p>
        </div>
        <div className="principles">
          <div><b>01</b><h3>Find the real problem</h3><p>Start with the user&apos;s mental model, not the database schema.</p></div>
          <div><b>02</b><h3>Model the complexity</h3><p>States, relationships, permissions, failure modes and data flows.</p></div>
          <div><b>03</b><h3>Hide the machinery</h3><p>Good product UX makes sophisticated systems feel obvious.</p></div>
          <div><b>04</b><h3>Build → inspect → iterate</h3><p>Ship real things, observe them and improve the weakest part.</p></div>
        </div>
      </section>

      <section className="lab section" id="lab">
        <div className="lab-card">
          <div className="lab-header">
            <span className="section-no">03 — THE LAB</span>
            <span className="status"><i /> CURRENTLY EXPLORING</span>
          </div>
          <div className="lab-content">
            <div>
              <span className="lab-number">/ 004</span>
              <h2>Project intelligence.</h2>
              <p>A future experiment around understanding an entire codebase — not only its functions, but its UX, architecture, quality and missing pieces.</p>
            </div>
            <div className="lab-terminal">
              <div><span>$</span> inspect --everything</div>
              <div><span>→</span> mapping architecture...</div>
              <div><span>→</span> tracing product flows...</div>
              <div><span>→</span> finding rough edges...</div>
              <div className="terminal-cursor">▋</div>
            </div>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-left">
          <span className="section-no">04 — A LITTLE ABOUT ME</span>
          <h2>Engineer by craft.<br /><i>Product thinker</i> by instinct.</h2>
        </div>
        <div className="about-right">
          <p>I like building things where software engineering, product design and systems thinking overlap.</p>
          <p>My projects tend to start with a vague, complicated problem. The fun is turning that ambiguity into a model, then turning the model into an experience that feels surprisingly simple.</p>
          <div className="about-links">
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
            <a href="mailto:hello@example.com">Email <span>↗</span></a>
          </div>
        </div>
      </section>

      <footer>
        <span>© 2026 — Built with curiosity.</span>
        <span>Scroll less. Build more.</span>
      </footer>
    </main>
  );
}