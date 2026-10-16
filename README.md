# Portfolio 1.1

A developer portfolio with a hero home page, a docs-style layout for inner pages, an admin with draft/publish and field-level history, and optional Groq-powered AI features.

## Run locally

```bash
npm install
cp .env.example .env.local      # set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                     # site: http://localhost:3000   admin: /admin
npm run typecheck && npm run build
npm test                        # logic tests
```

Local data lives in `.data/`. Delete it to reset to the starter content in `src/lib/defaults.ts`.

## Deploy on Netlify

1. Push to Git and import the repo in Netlify.
2. Set `ADMIN_PASSWORD`, `SESSION_SECRET` (32+ random characters), `SITE_URL`. Add `GROQ_API_KEY` to switch on the AI features.
3. Content, images, messages and history are stored in Netlify Blobs automatically.
4. After the first deploy check: sign-in works, a published edit survives a redeploy, a hidden page returns not-found, a test message reaches the Inbox, `/api/health` returns `{"ok":true}`.

Netlify stops functions after about 10 seconds, so screenshot capture and AI calls use a 9 second limit there. If a capture times out, retry or upload an image.

## What's new in 1.1 (UI/UX redesign)

Two npm libraries from your own stack: **React Flow** (`@xyflow/react`) draws the "How I work" diagram, and **Motion** (`motion`) handles animation.

**Layout rule**
- Home, Projects and Contact use a full-width top navigation (these pages sell and convert).
- About, Experience, How I work, Stack and project pages use the docs-style sidebar (these pages are read).
- Every page shares one container width, so headings, cards and the footer line up.

**Home**
- Hero with a profile card (photo or initials, role, location, the tools you work with, and counts of projects, tools and roles taken from your content), a slow tools marquee, and a featured-first project grid. Project cards without an image get a coloured pattern instead of a blank block.
- "How I work" is a React Flow diagram: boxes arranged from each step's "takes input from" links, wrapping in a snake pattern, with animated connectors, hover to trace a path, and a final "Let's talk" box. It scales to the container and never captures page scrolling. A plain readable list shows first, without JavaScript, and if the diagram fails.
- Footer with pages and your contact links.

**Contact:** split layout (details and tips on the left, form card on the right) that fits one screen, animated success state. **Projects:** category filter with animated reflow. **Stack:** icon tiles with an animated detail panel.

**Animations (Motion):** scroll reveals, card hover, mobile menu, filters, chat panel, form success and error, admin dialogs, toasts and popovers, reading-progress bar. All respect "reduce motion". Content is visible by default, so a page can never come up blank.

**Admin**
- Dashboard leads with status and a clear action, then the top three suggestions (important first), then everything else grouped and collapsed.
- Project editor is split into Overview, Case study and Media & links tabs, with a sticky header.
- Titled section cards, avatar list rows, aligned fields, animated dialogs.
- Fixed: a CSS class clash that put a 180 px blank gap above the editor fields.

## From 1.0 (still included)

Draft and Publish with a revision check, field-by-field History with restore, suggestions with "?" help, icon picker, screenshot capture, Groq "Ask AI" and writing help, inbox, backup and import, six public themes with light/dark/system, four admin themes.

## Safety notes

- Hidden items and drafts never reach visitors or the AI. Storage failures show a "temporarily unavailable" page, never starter content.
- The Groq key stays on the server. AI chat is rate-limited, sees only a digest of public content, and is told not to guess.
- Uploads are checked by file signature, size-limited and served with safe headers. Icon paths are validated before storage.

## Known limits

- Never run through `npm install` and `next build` where it was written. Run `npm run typecheck` and `npm run build` first.
- Verified here: logic tests (including the diagram geometry), a type-check against stand-ins, and all 18 public and admin screens server-rendered and screenshotted in a real browser. React Flow and Motion were stubbed in those renders, so the live diagram and the animations have not been seen.
- Not verified: Groq and screenshot-service calls, the Simple Icons package shape, drag-and-drop, and Netlify behaviour.
- React Flow's small "React Flow" attribution is left visible, as its licence asks unless you subscribe to remove it.
- Rate limits are per server instance. Add an edge limit for stronger protection.
- Category chip colours come from the category name, not a managed list. Uploaded images aren't re-encoded or garbage-collected. No analytics.
- Left for later: automated screenshot checks in CI, "compare with published" inside editors, drag-to-position flow boxes.
