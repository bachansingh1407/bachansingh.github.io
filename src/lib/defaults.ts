import type { CaseStudy, Content, PageId, StackItem } from "./types";

export const PAGE_IDS: PageId[] = ["start", "about", "experience", "projects", "how", "stack", "contact"];

export const EMPTY_CASE: CaseStudy = {
  context: "", contribution: "", problem: "", approach: "", decisions: "", validation: "", outcome: "",
};

export const CASE_LABELS: Record<keyof CaseStudy, string> = {
  context: "Context", contribution: "My contribution", problem: "Problem", approach: "Approach",
  decisions: "Decisions", validation: "Validation", outcome: "Outcome",
};

export const CONTACT_TOPICS = ["Hiring or a role", "A project or freelance work", "Something else"];

const si = (name: string, description: string): StackItem => ({ uid: "si-" + name.toLowerCase().replace(/\W+/g, ""), name, description, icon: null, why: "", how: "", alternatives: "", visible: true });
const proj = (id: string, name: string, category: string, summary: string, tech: string[], scope: string[]) => ({
  uid: "p-" + id, id, name, category, summary, outcomeLine: "", status: "Scope to confirm", featured: false,
  cover: "", coverAlt: "", coverCapturedAt: "", images: [], tech, scope, caseStudy: { ...EMPTY_CASE },
  demoUrl: "", repoUrl: "", sourceNote: "", visible: true,
});

/** First-run content. Only facts from the requirements documents; everything else stays empty. */
export const DEFAULT_CONTENT: Content = {
  schema: 2, rev: 0, updated: "2026-10-09", publishedAt: "",
  profile: {
    name: "Bachan Singh",
    role: "Software Developer",
    positioning: "Full-stack developer who designs systems, writes requirements, and owns technical decisions.",
    intro: "I build admin and product interfaces and the API and data flows behind them. This portfolio shows how I work, with case studies that explain the decisions, not just the result.",
    photo: "", photoAlt: "", location: "",
  },
  pages: [
    { id: "start", title: "Home", visible: true },
    { id: "about", title: "About", visible: true },
    { id: "experience", title: "Experience", visible: true },
    { id: "projects", title: "Projects", visible: true },
    { id: "how", title: "How I work", visible: true },
    { id: "stack", title: "Stack", visible: true },
    { id: "contact", title: "Contact", visible: true },
  ],
  about:
    "I build admin and product interfaces: finance modules, company and template management, and the API and data flows behind them.\n\nI started with the MERN stack during an internship and now work mostly with React, TypeScript and Next.js. Most of my day-to-day work sits between a requirement and a working screen: clarifying what is being asked, deciding how to build it, and checking it before it ships.\n\nI'm aiming for roles where a developer also designs the system: writing requirements, comparing options and owning technical decisions, with AI tools as part of the workflow.",
  work: [
    {
      uid: "w-dev", id: "software-developer", title: "Software Developer", org: "", dates: "",
      blurb: "Admin and product modules for internal and customer-facing interfaces.",
      tech: ["React", "TypeScript"],
      items: [
        { uid: "wi-phoenix", title: "Phoenix 2.0 Admin Panel", text: "Finance modules, UI standardization, consistent tables and filters, date and time range improvements, keyboard accessibility." },
        { uid: "wi-cpaas", title: "CPaaS Panel 2.0", text: "Companies and Templates modules, API and data workflows, clarifying backend dependencies." },
        { uid: "wi-qa", title: "QA-driven fixes", text: "Fixes and refinements across these modules based on QA findings." },
      ],
      outcome: "", visible: true,
    },
    {
      uid: "w-intern", id: "internship", title: "Intern", org: "", dates: "",
      blurb: "Where I learned MERN stack development: MongoDB, Express, React and Node.js.",
      tech: ["MongoDB", "Express", "React", "Node.js"], items: [], outcome: "", visible: true,
    },
  ],
  projects: [
    proj("promptforge", "PromptForge", "AI tooling",
      "A workspace for organizing prompts: folders and tags, reusable templates with variables, version history and side-by-side comparison.",
      ["React", "Next.js", "TypeScript"],
      ["Prompt library with folders and tags", "Reusable templates with variables", "Version history", "Side-by-side comparison of versions", "Export and share"]),
    proj("diagram-tool", "Technical Diagram Tool", "Developer tooling",
      "A node-and-edge canvas for sketching architecture and flow diagrams, with starter templates and image export.",
      ["React", "React Flow", "TypeScript"],
      ["Node-and-edge canvas", "Starter templates for architecture and flow diagrams", "Image export", "Shareable links"]),
    proj("dashboards", "Engineering Dashboards", "Data interfaces",
      "Data-heavy interfaces built around sortable, filterable tables with saved views and date-range controls.",
      ["React", "TanStack Table", "TypeScript"],
      ["Sortable and filterable tables", "Saved filter views", "Date-range controls", "CSV export"]),
    proj("decision-studio", "Requirements & Decision Studio", "AI tooling",
      "A guided tool for capturing goals, users and constraints, drafting requirements and keeping a decision log with options and rationale.",
      [],
      ["Guided capture of goals, users and constraints", "Requirement drafts", "Decision log with options and rationale", "Export to a document"]),
  ],
  testimonials: [],
  how: {
    intro: "A repeatable way of going from a vague request to something shipped, with the reasoning written down.",
    steps: [
      { uid: "s-understand", title: "Understand", kind: "start", icon: "search", from: [], chips: ["Requirements"], text: "Clarify the goal, the users and what is still unknown before building anything. Written requirements come out of this step." },
      { uid: "s-design", title: "Design", kind: "process", icon: "pencil", from: ["s-understand"], chips: ["Decision record"], text: "Sketch the structure and compare options. The choice and the reason go into a decision record." },
      { uid: "s-build", title: "Build", kind: "process", icon: "hammer", from: ["s-design"], chips: [], text: "Implement in small, reviewable pieces, with typed code and consistent components." },
      { uid: "s-validate", title: "Validate", kind: "process", icon: "check", from: ["s-build"], chips: ["QA feedback"], text: "Check the work against the requirements: manual checks, QA feedback and browser tests where they help." },
      { uid: "s-refine", title: "Refine", kind: "process", icon: "refresh", from: ["s-validate"], chips: [], text: "Fix what validation found, then tidy tables, filters, accessibility and edge cases." },
      { uid: "s-ship", title: "Ship", kind: "end", icon: "rocket", from: ["s-refine"], chips: [], text: "Release, confirm it works in the real environment and note what to watch." },
    ],
  },
  stack: [
    { uid: "g-frontend", id: "frontend", name: "Frontend", visible: true, items: [
      si("React", "Component-based UI"), si("Next.js", "Routing and server rendering"), si("TypeScript", "Typed application code"),
      si("Tailwind CSS", "Utility-first styling"), si("shadcn/ui", "Accessible component primitives")] },
    { uid: "g-data", id: "data", name: "Data and backend", visible: true, items: [
      si("PostgreSQL", "Relational database"), si("Prisma", "Typed database access"),
      si("MongoDB, Express, Node.js", "MERN stack, learned during an internship")] },
    { uid: "g-specialized", id: "specialized", name: "Specialized", visible: true, items: [
      si("React Flow", "Node-and-edge canvases"), si("TanStack Table", "Sortable, filterable data tables"),
      si("Motion", "Interface animation"), si("Playwright", "Browser testing")] },
  ],
  contact: { email: "", github: "", linkedin: "", resumeUrl: "", formEnabled: true, retentionDays: 365, showOnAbout: true },
  site: {
    palettes: ["indigo", "forest", "ocean", "amber", "rose", "slate"], defaultPalette: "indigo", defaultMode: "system",
    ai: { enabled: false, questions: ["What has Bachan built?", "What is his tech stack?", "How can I get in touch?"] },
  },
};
