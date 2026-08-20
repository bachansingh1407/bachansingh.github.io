"use client";

import { useState } from "react";
import { Mail, X, Check, Copy, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(site.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const socials = [
    { label: "GitHub", href: site.socials.github, icon: GithubIcon },
    { label: "LinkedIn", href: site.socials.linkedin, icon: LinkedinIcon },
    { label: "X / Twitter", href: site.socials.twitter, icon: X },
  ].filter((s) => s.href);

  return (
    <footer id="contact" className="py-16 md:py-20 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-4xl md:text-[38px] font-bold uppercase mb-4">
          {site.contact.heading}
        </h2>
        <p className="text-sub dark:text-sub-dark font-medium mb-8 max-w-md">
          {site.contact.subtext}
        </p>

        {/* Email — primary interactive card */}
        <button
          onClick={copyEmail}
          className="group relative w-full flex items-center justify-between gap-4 border-[1px] border-ink dark:border-ink-dark px-6 py-5 mb-4 text-left transition-all hover:bg-ink hover:text-white dark:hover:bg-ink-dark dark:hover:text-bg-dark hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#ff4b1f]"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Mail className="h-6 w-6 shrink-0 text-accent dark:text-accent-dark" strokeWidth={2.5} />
            <div className="min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-wide text-sub dark:text-sub-dark group-hover:text-white/60">
                Email
              </div>
              <div className="text-sm md:text-base truncate">
                {site.contact.email}
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-accent dark:text-accent-dark" />
                COPIED
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                COPY
              </>
            )}
          </span>
        </button>

        {/* Social links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 border-[1px] border-ink dark:border-ink-dark px-5 py-4 transition-all hover:bg-accent hover:border-accent hover:text-white dark:hover:bg-accent-dark dark:hover:border-accent-dark hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0a0a0a] dark:hover:shadow-[6px_6px_0_0_#f2f2ed]"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                <span className="font-mono text-xs uppercase tracking-wide">
                  {label}
                </span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                strokeWidth={2.5}
              />
            </a>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t-[1px] border-ink dark:border-ink-dark font-mono text-[11px] text-sub dark:text-sub-dark">
          © {new Date().getFullYear()} {site.name}.
        </div>
      </div>
    </footer>
  );
}
