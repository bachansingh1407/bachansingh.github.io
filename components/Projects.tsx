"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon } from "./icons";

interface TiltStyle extends CSSProperties {
  "--mx"?: string;
  "--my"?: string;
}

function InteractiveCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: px, y: py });
    setTilt({
      x: (e.clientX - rect.left - rect.width / 2) * 0.04,
      y: (e.clientY - rect.top - rect.height / 2) * 0.08,
    });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const style: TiltStyle = {
    transform: `translate(${tilt.x}px, ${tilt.y}px)`,
    "--mx": `${pos.x}%`,
    "--my": `${pos.y}%`,
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      className={`group relative overflow-hidden border-[1px] border-ink dark:border-ink-dark transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0a0a0a] dark:hover:shadow-[6px_6px_0_0_#f2f2ed] ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), rgba(255,75,31,0.14), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

export default function Projects() {
  const featured = site.projects.filter((p) => p.featured);
  const rest = site.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-10 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl md:text-[26px] font-bold uppercase">
            Personal Projects
          </h2>
          <span className="font-mono text-[11px] text-sub dark:text-sub-dark uppercase tracking-wide hidden sm:block">
            {featured.length} featured / {site.projects.length} total
          </span>
        </div>

        {/* Featured projects */}
        <div className="grid gap-5 mb-10">
          {featured.map((project) => (
            <InteractiveCard key={project.name} className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent dark:text-accent-dark mb-1.5">
                    Featured
                  </div>
                  <div className="text-lg md:text-xl font-semibold uppercase">
                    {project.name}
                  </div>
                </div>
              </div>
              <p className="text-sm text-sub dark:text-sub-dark font-medium max-w-lg mb-5">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-[1px] border-ink dark:border-ink-dark px-4 py-2 font-mono text-xs transition-colors hover:bg-ink hover:text-white dark:hover:bg-ink-dark dark:hover:text-bg-dark"
                  >
                    <GithubIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    CODE
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-[3px] border-accent dark:border-accent-dark bg-accent dark:bg-accent-dark text-white px-4 py-2 font-mono text-xs transition-opacity hover:opacity-85"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
                    LIVE DEMO
                  </a>
                )}
              </div>
            </InteractiveCard>
          ))}
        </div>

        {/* Other projects — compact list */}
        {rest.length > 0 && (
          <div className="mb-8">
            <div className="font-mono text-[11px] uppercase tracking-widest text-sub dark:text-sub-dark mb-3">
              Also built
            </div>
            <div className="border-t-[1px] border-ink dark:border-ink-dark">
              {rest.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between gap-4 py-4 group"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold font-montserrat capitalize tracking-[1px]">
                      {project.name}
                    </div>
                    <p className="text-xs text-sub dark:text-sub-dark font-medium mt-0.5 max-w-md truncate">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} on GitHub`}
                        className="flex h-8 w-8 items-center justify-center border-[3px] border-ink dark:border-ink-dark transition-colors hover:bg-ink hover:text-white dark:hover:bg-ink-dark dark:hover:text-bg-dark"
                      >
                        <GithubIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} live demo`}
                        className="flex h-8 w-8 items-center justify-center border-[3px] border-ink dark:border-ink-dark transition-colors hover:bg-accent hover:border-accent hover:text-white dark:hover:bg-accent-dark dark:hover:border-accent-dark"
                      >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore all on GitHub */}
        {site.socials.github && (
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 border-[1px] border-ink dark:border-ink-dark px-6 py-4 transition-all hover:bg-ink hover:text-white dark:hover:bg-ink-dark dark:hover:text-bg-dark"
          >
            <span className="flex items-center gap-3 font-montserrat text-xs uppercase tracking-wide">
              <GithubIcon className="h-4 w-4" strokeWidth={2.5} />
              Explore all projects on GitHub
            </span>
            <ArrowUpRight
              className="h-4 w-4 -translate-x-1 transition-transform group-hover:translate-x-0"
              strokeWidth={2.5}
            />
          </a>
        )}
      </div>
    </section>
  );
}
