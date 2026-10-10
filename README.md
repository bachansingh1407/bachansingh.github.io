# Portfolio 1.0

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

## What's in 1.0

**Public site**
- Hero home with bento "Selected work" (swipeable on phones), category chips, and a "How I work" flow diagram that ends in a "Let's talk" contact node. The diagram lays itself out from each step's "takes input from" links.
- About with a "Find me" card (email, GitHub, LinkedIn, resume). Contact with form and details side by side.
- Experience as a timeline or the same flow diagram. Technologies shown as chips.
- Projects: live-URL preview captured into a browser-style frame, screenshots, case studies.
- Stack: an interactive map with brand icons. Open a tool to read why you use it, how, and what you considered.
- Six colour themes with light, dark and system modes. Input fields have their own fill and a 3:1 border on every theme (tested).
- Optional "Ask AI" chat that answers only from published content.

**Admin**
- Draft and Publish, with a revision check so a second tab can't overwrite newer changes.
- History records every published change field by field. Open a version to see old and new text, and put back a single old value or a removed item. The last 100 versions are kept.
- Dashboard with status cards and suggestions. Each has a "?" explaining why it matters and how to do it, and a "Take me there" button to the exact item.
- One consistent row layout (grip, content, actions), keyboard and touch drag-and-drop, Undo on delete, a Public/Hidden switch.
- Icon picker (Simple Icons) with "Find icons automatically". Screenshot capture from a live URL.
- Optional "Suggest a clearer version" on text fields: shows what changed, and you choose.
- Preview, Inbox, backup and import, four admin themes plus System.

## Safety notes

- Hidden items and drafts never reach visitors or the AI. Storage failures show a "temporarily unavailable" page, never starter content.
- The Groq key stays on the server. AI chat is rate-limited, sees only a digest of public content, and is told not to guess.
- Uploads are checked by file signature, size-limited and served with safe headers. Icon paths are validated before storage.

## Known limits

- Never run through `npm install` and `next build` where it was written. Run `npm run typecheck` and `npm run build` first. Logic tests pass, and the public components were server-rendered successfully against stubs.
- Not verified here: Groq and screenshot-service calls, the Simple Icons package shape, drag-and-drop and flow lines in a real browser, and Netlify behaviour.
- Rate limits are per server instance. Add an edge limit for stronger protection.
- Category chip colours come from the category name, not a managed list. Uploaded images aren't re-encoded or garbage-collected. No analytics.
- Left for later: automated visual checks, "compare with published" inside editors, drag-to-position flow boxes.
