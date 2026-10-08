import type { CaseStudy, Content, PageId } from "./types";

export const PAGE_IDS: PageId[] = ["start", "about", "experience", "projects", "how", "stack", "contact"];

export const EMPTY_CASE: CaseStudy = {
  context: "", contribution: "", problem: "", approach: "", decisions: "", validation: "", outcome: "",
};

export const CASE_LABELS: Record<keyof CaseStudy, string> = {
  context: "Context",
  contribution: "My contribution",
  problem: "Problem",
  approach: "Approach",
  decisions: "Decisions",
  validation: "Validation",
  outcome: "Outcome",
};

/** Starting content. Only facts from the requirements documents; everything else is left empty. */
export const DEFAULT_CONTENT: Content = {
  profile: {
    name: "Bachan Singh",
    role: "Software Developer",
    positioning: "Full-stack developer who designs systems, writes requirements, and owns technical decisions.",
    intro:
      "I'm Bachan Singh, a software developer. This portfolio is built to be read in about a minute: what I do, one real case study, and a way to reach me.",
  },
  pages: [
    { id: "start", title: "Start here", visible: true },
    { id: "about", title: "About", visible: true },
    { id: "experience", title: "Experience", visible: true },
    { id: "projects", title: "Projects", visible: true },
    { id: "how", title: "How I work", visible: true },
    { id: "stack", title: "Stack", visible: true },
    { id: "contact", title: "Contact", visible: true },
  ],
  about:
    `I'm a software developer interested in the space between requirements, systems, and working software. \n\n
     My work starts with understanding the requirement, defining the boundaries of the system, 
     identifying edge cases and failure states, and deciding how the pieces should communicate before writing the feature itself. 
     I work across Frontend, Backend, DB operations and APIs, but my focus increasingly extends beyond the individual stack.\n\n
     I'm particularly interested in AI-native development and automation: I also build experimental developer tools and products 
     to explore these ideas—from visualizing software structures to conversational interfaces and automated development workflows\n\n
     I'm aiming for roles where a developer also designs the system: writing requirements, 
     comparing options and owning technical decisions, with AI tools as part of the workflow.
  `,
  work: [
    {
      id: "software-developer",
      title: "Software Developer",
      org: "",
      dates: "",
      blurb: "Admin and product modules for internal and customer-facing interfaces.",
      items: [
        {
          title: "Phoenix 2.0 Admin Panel",
          text: "Finance modules, UI standardization, consistent tables and filters, date and time range improvements, keyboard accessibility.",
        },
        {
          title: "CPaaS Panel 2.0",
          text: "Companies and Templates modules, API and data workflows, clarifying backend dependencies.",
        },
        { title: "QA-driven fixes", text: "Fixes and refinements across these modules based on QA findings." },
      ],
      outcome: "",
      visible: true,
    },
    {
      id: "internship",
      title: "Intern",
      org: "",
      dates: "",
      blurb: "Where I learned MERN stack development: MongoDB, Express, React and Node.js.",
      items: [],
      outcome: "",
      visible: true,
    },
  ],
  projects: [
    {
      id: "promptforge",
      name: "PromptForge",
      category: "AI tooling",
      summary:
        "A workspace for organizing prompts: folders and tags, reusable templates with variables, version history and side-by-side comparison.",
      status: "Scope to confirm",
      tech: ["React", "Next.js", "TypeScript"],
      scope: [
        "Prompt library with folders and tags",
        "Reusable templates with variables",
        "Version history",
        "Side-by-side comparison of versions",
        "Export and share",
      ],
      caseStudy: { ...EMPTY_CASE },
      demoUrl: "", repoUrl: "", sourceNote: "", visible: true,
    },
    {
      id: "diagram-tool",
      name: "Technical Diagram Tool",
      category: "Developer tooling",
      summary:
        "A node-and-edge canvas for sketching architecture and flow diagrams, with starter templates and image export.",
      status: "Scope to confirm",
      tech: ["React", "React Flow", "TypeScript"],
      scope: [
        "Node-and-edge canvas",
        "Starter templates for architecture and flow diagrams",
        "Image export",
        "Shareable links",
      ],
      caseStudy: { ...EMPTY_CASE },
      demoUrl: "", repoUrl: "", sourceNote: "", visible: true,
    },
    {
      id: "dashboards",
      name: "Engineering Dashboards",
      category: "Data interfaces",
      summary:
        "Data-heavy interfaces built around sortable, filterable tables with saved views and date-range controls.",
      status: "Scope to confirm",
      tech: ["React", "TanStack Table", "TypeScript"],
      scope: ["Sortable and filterable tables", "Saved filter views", "Date-range controls", "CSV export"],
      caseStudy: { ...EMPTY_CASE },
      demoUrl: "", repoUrl: "", sourceNote: "", visible: true,
    },
    {
      id: "decision-studio",
      name: "Requirements & Decision Studio",
      category: "AI tooling",
      summary:
        "A guided tool for capturing goals, users and constraints, drafting requirements and keeping a decision log with options and rationale.",
      status: "Scope to confirm",
      tech: [],
      scope: [
        "Guided capture of goals, users and constraints",
        "Requirement drafts",
        "Decision log with options and rationale",
        "Export to a document",
      ],
      caseStudy: { ...EMPTY_CASE },
      demoUrl: "", repoUrl: "", sourceNote: "", visible: true,
    },
  ],
  how: {
    intro:
      "A repeatable way of going from a vague request to something shipped, with the reasoning written down.",
    steps: [
      { title: "Understand", text: "Clarify the goal, the users and what is still unknown before building anything. Written requirements come out of this step." },
      { title: "Design", text: "Sketch the structure and compare options. The choice and the reason go into a decision record." },
      { title: "Build", text: "Implement in small, reviewable pieces, with typed code and consistent components." },
      { title: "Validate", text: "Check the work against the requirements: manual checks, QA feedback and browser tests where they help." },
      { title: "Refine", text: "Fix what validation found, then tidy tables, filters, accessibility and edge cases." },
      { title: "Ship", text: "Release, confirm it works in the real environment and note what to watch." },
    ],
  },
  stack: [
    {
      id: "frontend", name: "Frontend", visible: true,
      items: [
        { name: "React", description: "Component-based UI", visible: true },
        { name: "Next.js", description: "Routing and server rendering", visible: true },
        { name: "TypeScript", description: "Typed application code", visible: true },
        { name: "Tailwind CSS", description: "Utility-first styling", visible: true },
        { name: "shadcn/ui", description: "Accessible component primitives", visible: true },
      ],
    },
    {
      id: "data", name: "Data and backend", visible: true,
      items: [
        { name: "PostgreSQL", description: "Relational database", visible: true },
        { name: "Prisma", description: "Typed database access", visible: true },
        { name: "MongoDB, Express, Node.js", description: "MERN stack, learned during an internship", visible: true },
      ],
    },
    {
      id: "specialized", name: "Specialized", visible: true,
      items: [
        { name: "React Flow", description: "Node-and-edge canvases", visible: true },
        { name: "TanStack Table", description: "Sortable, filterable data tables", visible: true },
        { name: "Motion", description: "Interface animation", visible: true },
        { name: "Playwright", description: "Browser testing", visible: true },
      ],
    },
  ],
  contact: { email: "", github: "", linkedin: "", resumeUrl: "" },
  updated: "2026-10-08",
};
