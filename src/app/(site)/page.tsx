import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { FlowGraph } from "@/components/FlowGraph";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import type { FlowNode } from "@/lib/flow";
import { buildMeta, personJsonLd } from "@/lib/seo";
import { getPub, requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await getPub();
  return buildMeta(pub, { description: pub.profile.positioning, path: "/" });
}

export default async function HomePage() {
  const pub = await requirePage("start");
  const { profile, contact } = pub;
  const has = (id: string) => pub.pages.some((p) => p.id === id);
  const featured = pub.projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : pub.projects).slice(0, 4);
  const links = [
    contact.github && { label: "GitHub", href: contact.github },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin },
    contact.email && { label: "Email", href: `mailto:${contact.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  // "How I work" steps, ending in a final "Let's talk" node so the page finishes on contact.
  const steps: FlowNode[] = has("how") ? pub.how.steps.map((s) => ({ id: s.uid, title: s.title, text: s.text, kind: s.kind, icon: s.icon, from: s.from, chips: s.chips })) : [];
  const referenced = new Set(steps.flatMap((s) => s.from));
  const sinks = steps.filter((s) => !referenced.has(s.id)).map((s) => s.id);
  const contactChips = [contact.email && "Email", contact.github && "GitHub", contact.linkedin && "LinkedIn", contact.formEnabled && "Contact form"].filter(Boolean) as string[];
  const flow: FlowNode[] = has("contact") ? [...steps, { id: "contact-node", title: "Let's talk", text: "Hiring, a project, or a question about my work.", kind: "end", icon: "mail", from: sinks, chips: contactChips, href: "/contact" }] : steps;

  const glance: Record<string, unknown> = {
    name: profile.name, role: profile.role,
    ...(pub.projects.length ? { projects: pub.projects.map((p) => p.name) } : {}),
    ...(pub.work.length ? { work: pub.work.flatMap((w) => w.items.map((i) => i.title)).slice(0, 4) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd(pub) }} />

      <section className="hero">
        <div className="hero-in">
          <div className="hero-copy">
            <p className="eyebrow">{[profile.role, profile.location].filter(Boolean).join(" · ")}</p>
            <h1>{profile.positioning || profile.name}</h1>
            {profile.intro ? <p className="lead">{profile.intro}</p> : null}
            <div className="cta">
              {has("projects") ? <Link className="btn primary" href="/projects">View my work</Link> : null}
              {has("contact") ? <Link className="btn" href="/contact">Get in touch</Link> : null}
              {contact.resumeUrl ? <a className="btn ghost" href={contact.resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a> : null}
            </div>
            {links.length ? <ul className="social">{links.map((l) => <li key={l.label}><a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.label}</a></li>)}</ul> : null}
          </div>
          <div className="hero-art">
            {profile.photo ? (
              <img src={`/media/${profile.photo}`} alt={profile.photoAlt} width={480} height={480} fetchPriority="high" />
            ) : (
              <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" className="orbit">
                <circle cx="120" cy="120" r="104" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 8" opacity=".55" />
                <circle cx="120" cy="120" r="72" stroke="var(--accent)" strokeWidth="2" opacity=".35" />
                <circle cx="120" cy="120" r="38" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" />
                <circle cx="120" cy="120" r="12" fill="var(--accent)" />
                <circle cx="224" cy="120" r="7" fill="var(--accent)" />
                <circle cx="48" cy="68" r="5" fill="var(--accent)" opacity=".7" />
              </svg>
            )}
          </div>
        </div>
      </section>

      {shown.length ? (
        <section className="lsec">
          <Reveal>
            <div className="lsec-head"><h2>Selected work</h2>{has("projects") ? <Link href="/projects" className="textlink">All projects</Link> : null}</div>
          </Reveal>
          <div className={`bento n${shown.length}`}>
            {shown.map((p, i) => <Reveal key={p.uid} delay={i * 80} className={`bento-i i${i}`}><ProjectCard p={p} big={i === 0 && shown.length > 1} /></Reveal>)}
          </div>
        </section>
      ) : null}

      {flow.length ? (
        <section className="lsec">
          <Reveal>
            <div className="lsec-head"><h2>How I work</h2>{has("how") ? <Link href="/how" className="textlink">Read more</Link> : null}</div>
            <p className="lsec-sub">From a vague request to something shipped, and then to a conversation.</p>
          </Reveal>
          <Reveal><FlowGraph nodes={flow} label="How I work, step by step" /></Reveal>
        </section>
      ) : null}

      {pub.testimonials.length ? (
        <section className="lsec">
          <Reveal><div className="lsec-head"><h2>What people say</h2></div></Reveal>
          <div className="tgrid">
            {pub.testimonials.map((t, i) => (
              <Reveal key={t.uid} delay={i * 80}>
                <figure className="quote"><blockquote>{t.quote}</blockquote><figcaption><b>{t.name}</b>{t.role ? <span>{t.role}</span> : null}</figcaption></figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="lsec">
        <details className="glance"><summary>View as profile.json</summary><CodeBlock name="profile.json" data={glance} /></details>
      </section>
    </>
  );
}
