export type Project = {
  name: string;
  stack: string[];
  problem: string;
  built: string;
  architecture: string;
  contribution: string;
  github: string;
  live: string;
};

export const portfolio = {
  name: "Bachan Singh",
  role: "Software Developer",
  level: "Full-stack software developer",
  tagline: "1.5+ years of turning ideas into working software.",

  email: "bachansingh1407@gmail.com",
  github: "https://github.com/bachansingh1407",
  linkedin: "https://www.linkedin.com/in/bachansingh/",
  resume: "#",

  frontend: [
    {
      name: "React",
      machine: "Component machine",
      tip: "Building reusable interfaces, components, and interactive experiences.",
    },
    {
      name: "Next.js",
      machine: "Speed tunnel",
      tip: "Building fast, scalable web applications with routing and server-side capabilities.",
    },
    {
      name: "TypeScript",
      machine: "Type checker robot",
      tip: "Writing safer, more maintainable code with static typing.",
    },
    {
      name: "JavaScript",
      machine: "Power generator",
      tip: "Creating dynamic, interactive, and functional web experiences.",
    },
    {
      name: "HTML & CSS",
      machine: "Blueprint station",
      tip: "Creating semantic, responsive, and accessible interfaces.",
    },
    {
      name: "Tailwind CSS",
      machine: "Styling toolbox",
      tip: "Building consistent and responsive interfaces efficiently.",
    },
  ],

  backend: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "Authentication",
    "Authorization",
    "API architecture",
  ],

  databases: [
    {
      name: "MongoDB",
      desc: "A flexible document-oriented database",
      egg: "db.happiness.find({}) → 0 documents",
    },
    {
      name: "PostgreSQL",
      desc: "A powerful relational database",
      egg: "SELECT * FROM happiness;",
    },
    {
      name: "MySQL",
      desc: "A structured relational database",
      egg: "SELECT * FROM happiness;",
    },
    {
      name: "Redis",
      desc: "A fast in-memory data store",
      egg: "GET happiness → (cache hit)",
    },
  ],

  concepts: [
    "Schema design",
    "Query optimization",
    "Data modeling",
    "Indexing",
    "Caching",
    "Database relationships",
  ],

  engineering: [
    "Git",
    "GitHub",
    "Docker",
    "CI/CD",
    "Testing",
    "API integration",
    "Performance optimization",
    "System design fundamentals",
  ],

  projects: [
    {
      name: "SaaS Management Platform",
      stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      problem:
        "A web platform focused on managing users, roles, accounts, and business operations.",
      built:
        "A full-stack management interface with dashboards, user management, role-based access, and REST APIs.",
      architecture:
        "React and TypeScript frontend, Node.js API layer, and PostgreSQL database.",
      contribution:
        "Developed frontend interfaces, backend APIs, authentication and authorization flows, and database integrations.",
      github: "https://github.com/bachansingh1407",
      live: "#",
    },

    {
      name: "E-Commerce Platform",
      stack: ["Next.js", "Node.js", "MongoDB", "Redis"],
      problem:
        "An e-commerce application requiring a fast product browsing and purchasing experience.",
      built:
        "Product catalog, product details, cart functionality, order flow, and optimized product data access.",
      architecture:
        "Next.js frontend, Node.js backend services, MongoDB for application data, and Redis for caching.",
      contribution:
        "Worked across the frontend and backend, integrated APIs, implemented application features, and focused on performance.",
      github: "https://github.com/bachansingh1407",
      live: "#",
    },

    {
      name: "Developer Collaboration Tool",
      stack: ["React", "Node.js", "PostgreSQL"],
      problem:
        "A collaboration application designed to help development teams organize shared work and communication.",
      built:
        "Workspaces, task management, comments, and activity-based collaboration features.",
      architecture:
        "React frontend connected to a Node.js REST API with PostgreSQL for persistent data.",
      contribution:
        "Implemented reusable React components, REST APIs, database operations, and collaborative application features.",
      github: "https://github.com/bachansingh1407",
      live: "#",
    },

    {
      name: "Analytics Dashboard",
      stack: ["Next.js", "TypeScript", "PostgreSQL"],
      problem:
        "A dashboard designed to make application and business metrics easier to understand.",
      built:
        "Responsive dashboards with filtering, data visualization, metric cards, and structured reporting.",
      architecture:
        "Next.js application with TypeScript, API integration, and PostgreSQL-backed data.",
      contribution:
        "Built responsive dashboard interfaces, integrated backend data, created reusable components, and optimized data rendering.",
      github: "https://github.com/bachansingh1407",
      live: "#",
    },

    {
      name: "API Management Platform",
      stack: ["Node.js", "Express.js", "PostgreSQL"],
      problem:
        "A backend platform for managing API access, authentication, usage, and request limits.",
      built:
        "API key management, authentication, request handling, rate limiting, and usage tracking.",
      architecture:
        "Node.js and Express.js API layer with PostgreSQL for users, API keys, and usage data.",
      contribution:
        "Designed and implemented REST endpoints, authentication flows, database queries, and API management functionality.",
      github: "https://github.com/bachansingh1407",
      live: "#",
    },
  ].map(
    (project): Project => ({
      ...project,
    })
  ),

  quests: [
    "Production applications",
    "REST APIs",
    "Database architecture",
    "Responsive interfaces",
    "Authentication systems",
    "Authorization",
    "Performance optimization",
    "API integration",
    "Team collaboration",
    "Clean and maintainable code",
  ],

  chapters: [
    {
      title: "Chapter 1: Learning to build",
      body:
        "Started building web applications and developed a strong foundation in JavaScript, React, HTML, CSS, and modern frontend development.",
    },
    {
      title: "Chapter 2: Building full-stack applications",
      body:
        "Expanded into backend development with Node.js and Express.js, working with REST APIs, authentication, databases, and application architecture.",
    },
    {
      title: "Chapter 3: Thinking beyond the frontend",
      body:
        "Focused on database design, API architecture, caching, performance optimization, testing, deployment, and building maintainable full-stack applications.",
    },
  ],

  beliefs: [
    {
      quote: "Simple code beats clever code.",
      tag: "on complexity",
    },
    {
      quote: "Good UI is invisible when it works.",
      tag: "on interfaces",
    },
    {
      quote: "Databases deserve as much attention as the interface.",
      tag: "on data",
    },
    {
      quote: "Performance is a feature.",
      tag: "on speed",
    },
    {
      quote: "Readable code is a team feature.",
      tag: "on teams",
    },
    {
      quote: "Delete code before you add code.",
      tag: "on scope",
    },
    {
      quote: "A good error message is documentation.",
      tag: "on failure",
    },
    {
      quote: "Ship small, ship often.",
      tag: "on delivery",
    },
    {
      quote: "Write the test you will thank yourself for.",
      tag: "on testing",
    },
    {
      quote: "If it does not fit on a napkin, redesign it.",
      tag: "on design",
    },
  ],
};