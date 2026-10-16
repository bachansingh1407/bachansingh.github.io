import Link from "next/link";
import { Flow } from "@/components/Flow";
import { BrandIcon, Icon } from "@/components/Icon";
import { Marquee } from "@/components/Marquee";
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
  const tools = pub.stack.flatMap((g) => g.items);
  const initials = profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const links = [
    contact.github && { label: "GitHub", href: contact.github, icon: "code" },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin, icon: "briefcase" },
    contact.email && { label: "Email", href: `mailto:${contact.email}`, icon: "mail" },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  // "How I work" steps, ending in a "Let's talk" node so the page finishes on contact.
  const steps: FlowNode[] = has("how") ? pub.how.steps.map((s) => ({ id: s.uid, title: s.title, text: s.text, kind: s.kind, icon: s.icon, from: s.from, chips: s.chips })) : [];
  const referenced = new Set(steps.flatMap((s) => s.from));
  const sinks = steps.filter((s) => !referenced.has(s.id)).map((s) => s.id);
  const contactChips = [contact.email && "Email", contact.github && "GitHub", contact.linkedin && "LinkedIn", contact.formEnabled && "Contact form"].filter(Boolean) as string[];
  const flow: FlowNode[] = has("contact") ? [...steps, { id: "contact-node", title: "Let's talk", text: "Hiring, a project, or a question about my work.", kind: "end", icon: "mail", from: sinks, chips: contactChips, href: "/contact" }] : steps;

  const n = shown.length;
  const rest = shown.slice(1);
  const restSpan = rest.length === 1 ? "s6" : rest.length === 2 ? "s3" : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd(pub) }} />

      <section className="hero">
        <div className="hero-in">
          <div>
            <span className="eyebrow-pill rise" style={{ ["--i" as string]: 0 }}>{[profile.role, profile.location].filter(Boolean).join(" · ") || profile.name}</span>
            <h1 className="rise" style={{ ["--i" as string]: 1 }}>{profile.positioning || profile.name}</h1>
            {profile.intro ? <p className="lead rise" style={{ ["--i" as string]: 2 }}>{profile.intro}</p> : null}
            <div className="cta rise" style={{ ["--i" as string]: 3 }}>
              {has("projects") ? <Link className="btn primary" href="/projects">View my work<Icon name="arrow" size={17} /></Link> : null}
              {has("contact") ? <Link className="btn" href="/contact">Get in touch</Link> : null}
              {contact.resumeUrl ? <a className="btn ghost" href={contact.resumeUrl} target="_blank" rel="noopener noreferrer"><Icon name="download" size={16} />Resume</a> : null}
            </div>
            {links.length ? (
              <ul className="social rise" style={{ ["--i" as string]: 4 }}>
                {links.map((l) => <li key={l.label}><a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Icon name={l.icon} size={15} />{l.label}</a></li>)}
              </ul>
            ) : null}
          </div>

          <div className="hcard rise" style={{ ["--i" as string]: 3 }}>
            {tools[0] ? <span className="float-chip a"><BrandIcon icon={tools[0].icon} name={tools[0].name} size={18} />{tools[0].name}</span> : null}
            {tools[2] ? <span className="float-chip b"><BrandIcon icon={tools[2].icon} name={tools[2].name} size={18} />{tools[2].name}</span> : null}
            <div className="hcard-main">
              <div className="hcard-top">
                <div className="avatar-lg">{profile.photo ? <img src={`/media/${profile.photo}`} alt={profile.photoAlt} width={96} height={96} fetchPriority="high" /> : <span aria-hidden="true">{initials}</span>}</div>
                <div>
                  <h2>{profile.name}</h2>
                  {profile.role ? <p className="hcard-role">{profile.role}</p> : null}
                  {profile.location ? <span className="hcard-loc"><Icon name="flag" size={13} />{profile.location}</span> : null}
                </div>
              </div>
              {tools.length ? (
                <>
                  <div className="hcard-sep" />
                  <p className="hcard-label">Works with</p>
                  <div className="tags" style={{ paddingTop: 0, marginTop: 0 }}>{tools.slice(0, 6).map((t) => <span key={t.uid}>{t.name}</span>)}</div>
                </>
              ) : null}
              <div className="hstats">
                <div className="hstat"><b>{pub.projects.length}</b><span>Projects</span></div>
                <div className="hstat"><b>{tools.length}</b><span>Tools</span></div>
                <div className="hstat"><b>{pub.work.length}</b><span>Roles</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee groups={pub.stack} />

      {n ? (
        <section className="lsec">
          <Reveal>
            <div className="sec-head">
              <div><p className="sec-eyebrow">Selected work</p><h2>Projects, explained in depth</h2></div>
              {has("projects") ? <Link href="/projects" className="textlink">All projects →</Link> : null}
            </div>
          </Reveal>
          <div className="pgrid">
            <Reveal className={`cell ${n === 1 ? "s6" : "s6"}`}><ProjectCard p={shown[0]} feat /></Reveal>
            {rest.map((p, i) => <Reveal key={p.uid} delay={0.08 * (i + 1)} className={`cell ${restSpan}`}><ProjectCard p={p} /></Reveal>)}
          </div>
        </section>
      ) : null}

      {flow.length ? (
        <section className="lsec" id="how">
          <Reveal>
            <div className="sec-head">
              <div><p className="sec-eyebrow">Process</p><h2>How I work</h2><p className="sec-sub">From a vague request to something shipped, and then to a conversation.</p></div>
              {has("how") ? <Link href="/how" className="textlink">Read more →</Link> : null}
            </div>
          </Reveal>
          <Reveal>
            <div className="flowframe">
              <div className="flow-top">
                <div className="legend" aria-hidden="true"><span className="k-start"><i />Start</span><span className="k-process"><i />Step</span><span className="k-end"><i />Result</span></div>
                <span className="flow-hint">Hover a step to trace its path</span>
              </div>
              <Flow nodes={flow} label="How I work, step by step" />
            </div>
          </Reveal>
        </section>
      ) : null}

      {pub.testimonials.length ? (
        <section className="lsec">
          <Reveal><div className="sec-head"><div><p className="sec-eyebrow">Kind words</p><h2>What people say</h2></div></div></Reveal>
          <div className="tgrid">
            {pub.testimonials.map((t, i) => (
              <Reveal key={t.uid} delay={i * 0.08}><figure className="quote"><blockquote>{t.quote}</blockquote><figcaption><b>{t.name}</b>{t.role ? <span>{t.role}</span> : null}</figcaption></figure></Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
