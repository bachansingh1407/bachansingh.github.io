# Bachan Singh — Portfolio

Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS. Includes an AI assistant that answers questions about my projects, skills, and experience.

**Live site:** [bachansingh.netlify.app](https://bachansingh.netlify.app/)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** React 19, next-themes (light/dark mode), lucide-react (icons)
- **AI Assistant:** Custom chat API route (`app/api/chat/route.ts`) powering an in-page assistant that answers visitor questions about my work

## Features

- Responsive, single-page portfolio — Hero, About, Skills, Experience, Projects, and Contact sections
- Light/dark theme toggle
- Floating navigation
- AI-powered "Ask about Bachan" assistant with Markdown-formatted replies
- SEO-ready: dynamic sitemap, robots.txt, and Open Graph image generation
- Fully driven by a single content file (`data/site.ts`) — update your info once and it flows through the whole site

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/bachansingh1407/<repo-name>.git
cd <repo-name>
npm install
```

Create a `.env` file in the root and add any required environment variables (see `.env.example` if present, or check `app/api/chat/route.ts` for the variables it expects).

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the project
```

## Project Structure

```
├── app/                # Next.js App Router pages, layout, API routes, SEO files
│   └── api/chat/       # AI assistant API route
├── components/         # UI components (Hero, About, Skills, Projects, etc.)
├── data/site.ts        # Single source of truth for all site content
├── public/             # Static assets
└── ...
```

## Customization

All personal content — name, bio, skills, projects, experience, and contact info — lives in [`data/site.ts`](./data/site.ts). Edit that file to reuse this template for your own portfolio.

## Featured Projects

- **Campus** — Browser-based desktop OS with draggable windows, a real file system backed by recursive SQL, and an AI agent (Steve) that can operate the workspace
- **DoShare** — Secure file-sharing and management web app (final-year project)
- **HR Dashboard** — MERN-stack employee record CRUD app with JWT auth and real-time data
- **E-commerce Platform** — Full-stack app with dynamic product listings and order workflows
- **Blogging Application** — React app for creating, updating, and deleting posts

## Connect

- **GitHub:** [github.com/bachansingh1407](https://github.com/bachansingh1407)
- **LinkedIn:** [linkedin.com/in/bachansingh](https://www.linkedin.com/in/bachansingh/)
- **Email:** bachansingh1407@gmail.com

## License

This project is open source. Feel free to fork it and adapt it for your own portfolio.
