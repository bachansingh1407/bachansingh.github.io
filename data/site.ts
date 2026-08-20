// ─────────────────────────────────────────────────────────────
// EDIT EVERYTHING HERE. This one file drives the entire site —
// hero, about, stats, projects, experience, contact, and SEO tags.
// ─────────────────────────────────────────────────────────────

export const site = {
  // Basic identity
  name: "Bachan Singh",
  firstName: "Bachan",
  role: "Full Stack Developer (MERN)",
  company: "Almuqeet Systems", // shown as "@ Company" in a couple places, optional
  location: "Chandigarh, India",

  // Used in <title> / meta description / OG / JSON-LD
  siteUrl: "https://bachansingh.netlify.app", // change to your real domain before deploying
  title: "Bachan Singh — Full Stack Developer (MERN)",
  description:
    "Full-stack developer with 1.5+ years of experience building production-grade web apps — enterprise dashboards, CRMs, and developer tooling with the MERN stack.",

  // Hero section
  hero: {
    heading: "Hi, I'm",
    headingAccent: "Bachan Singh.",
    subtext:
      "Full-stack developer with 1.5+ years building production-grade web apps.",
    availability: "AVAILABLE FOR WORK",
  },

  // About section
  about: {
    heading: "About",
    text:
      "I'm a full-stack developer who enjoys turning ambiguous problems into clean, working software. I care about writing code that's easy to reason about, APIs that make sense, and UIs that feel effortless to use. Comfortable owning a feature end-to-end — from database design to the last pixel — and I pick up new tools quickly when the problem calls for it. Always looking for the next hard problem to get better at what I do.",
  },

  // Stat strip shown under About (replaces the GitHub-chart idea)
  stats: [
    { label: "Years Experience", value: "1.5+" },
    { label: "Projects Shipped", value: "10+" },
    { label: "Companies", value: "2" },
    { label: "Tech Stack", value: "MERN" },
  ],

  // Skills / tech stack section — grouped so the grid stays scannable.
  // Add/remove freely; each group renders as its own column.
  // Order matters within a group: the first 2 items render as "core"
  // (filled) chips, the rest as outline chips — put your strongest first.
  skills: [
    {
      category: "Languages",
      items: ["JavaScript", "TypeScript", "SQL", "Python"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "REST APIs", "JWT Auth"],
    },
    {
      category: "Database",
      items: ["MongoDB", "PostgreSQL", "Prisma", "Redis"],
    },
    {
      category: "AI & Automation",
      items: [
        "LLM APIs",
        "Tool-Calling Agents",
        "Prompt Engineering",
        "LangChain",
        // "RAG / Vector Search",
      ],
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "pgAdmin", "Postman", "Vercel", "Netlify"],
    },
  ],

  // Projects section
  // Set `featured: true` for your best/major work — these get big cards.
  // Everything else shows in a compact list below.
  // Leave `demo` as "" if there's no live link — it'll just be hidden.
  projects: [
    {
      name: "Campus",
      description:
        "A browser-based desktop OS — draggable windows, a real file system with folders/trash/search backed by recursive SQL, and Steve, a tool-calling Llama 3.3 agent that can operate your workspace directly. Next.js + Express/Prisma/PostgreSQL, JWT auth with refresh-token rotation and reuse detection.",
      github: "https://github.com/bachansingh1407/remote-desktop-application",
      demo: "https://campus26.netlify.app",
      featured: true,
    },
    {
      name: "DoShare",
      description:
        "A secure file sharing and management web app — upload, share, and organize files with a responsive, intuitive interface. Shipped as a final-year project.",
      github: "https://github.com/bachansingh1407/DoShare-File-Sharing-and-managing-web-application",
      demo: "",
      featured: true,
    },
    {
      name: "HR Dashboard",
      description:
        "Full-stack HR management dashboard (MERN) with employee record CRUD, JWT-based auth, and real-time data via RESTful APIs. Built solo.",
      github: "https://github.com/bachansingh1407/HR-Dashboard-MERN-stack-project",
      demo: "",
      featured: false,
    },
    {
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce app with dynamic product listing, cart management, and order workflows, built on the MERN stack with a focus on clean API design.",
      github: "https://github.com/bachansingh1407/Ecommerce-platform-using-mern-stack",
      demo: "",
      featured: false,
    },
    {
      name: "Blogging Application",
      description:
        "A feature-rich blogging platform built with React — create, update, and delete posts with a clean single-page experience.",
      github: "https://github.com/bachansingh1407/Blogging-Application-using-React",
      demo: "",
      featured: false,
    },
  ],

  // Experience section
  experience: [
    {
      role: "Software Developer",
      company: "Almuqeet Systems",
      time: "Jun 2025 — Present",
      description:
        "Design and integrate REST APIs, turning business requirements into reusable components across an enterprise dashboard and CRM platform. Grew from owning individual features to owning complete pieces of product development across frontend and backend.",
    },
    {
      role: "Full Stack Engineer (Intern)",
      company: "Gladhand Technologies Pvt. Ltd.",
      time: "Apr 2024 — Aug 2024",
      description:
        "Built a file-sharing platform from the ground up over a five-month internship — authentication, file upload, sharing, and management workflows, working across the entire stack rather than a single layer.",
    },
  ],

  // Contact section
  contact: {
    heading: "Let's talk.",
    subtext: "Open to freelance projects and full-time roles.",
    email: "bachansingh1407@gmail.com",
  },

  // Social links — leave blank ("") to hide a link
  socials: {
    github: "https://github.com/bachansingh1407",
    linkedin: "https://www.linkedin.com/in/bachansingh/",
    twitter: "",
  },
};

export type Site = typeof site;