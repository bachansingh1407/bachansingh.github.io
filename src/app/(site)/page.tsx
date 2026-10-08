import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { requirePage } from "@/lib/content";

export default async function StartPage() {
  const pub = await requirePage("start");
  const has = (id: string) => pub.pages.some((p) => p.id === id);
  const { profile, contact } = pub;
  const firstProject = pub.projects[0];

  const links = [
    contact.email && { label: "Email", href: `mailto:${contact.email}` },
    contact.github && { label: "GitHub", href: contact.github },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin },
    contact.resumeUrl && { label: "Resume", href: contact.resumeUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  const glance: Record<string, unknown> = {
    name: profile.name,
    role: profile.role,
    ...(pub.work.length ? { work: pub.work.flatMap((w) => w.items.map((i) => i.title)).slice(0, 4) } : {}),
    ...(pub.projects.length ? { projects: pub.projects.map((p) => p.name) } : {}),
    contact: links.length ? links.map((l) => l.label) : "coming soon",
  };

  return (
    <>
      <h1>{profile.positioning || profile.name}</h1>
      {profile.intro ? <p className="lead">{profile.intro}</p> : null}

      <h2>Quick path</h2>
      <div className="fast">
        {firstProject && has("projects") ? (
          <Link href={`/projects/${firstProject.id}`}>
            <b>Read a case study</b>
            <span>{pub.projects.length} {pub.projects.length === 1 ? "project" : "projects"}, written as problem, approach, decisions and validation.</span>
          </Link>
        ) : null}
        {has("experience") ? (
          <Link href="/experience"><b>See my work</b><span>Product and admin modules, described without confidential details.</span></Link>
        ) : null}
        {has("how") ? (
          <Link href="/how"><b>How I work</b><span>Requirements, design, decisions and validation.</span></Link>
        ) : null}
        {has("contact") ? (
          <Link href="/contact"><b>Get in touch</b><span>{links.length ? links.map((l) => l.label).join(", ") : "Contact details coming soon."}</span></Link>
        ) : null}
      </div>

      <h2>At a glance</h2>
      <CodeBlock name="profile.json" data={glance} />
    </>
  );
}
