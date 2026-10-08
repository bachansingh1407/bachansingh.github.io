# Portfolio (Next.js)

Docs-style developer portfolio with a private admin. Public pages: Start here, About, Experience, Projects (with case-study pages), How I work, Stack, Contact.

## Run locally

```bash
npm install
cp .env.example .env.local     # then edit the values
npm run dev                    # http://localhost:3000, admin at /admin
npm run typecheck              # optional
```

Content is saved to `.data/content.json` locally. Delete that file to reset to the starting content in `src/lib/defaults.ts`.

## Deploy on Netlify

1. Push the project to a Git repository and import it in Netlify (Next.js is detected automatically).
2. Add environment variables: `ADMIN_PASSWORD`, `SESSION_SECRET` (32+ random characters), `SITE_URL` (your public URL).
3. Deploy. On Netlify, edits are stored in **Netlify Blobs**, so they survive redeploys. No database needed.
4. After the first deploy, check: admin login works, an edit persists after a redeploy, a hidden page returns the not-found page.

Back up regularly with **Admin → Overview → Export content**.

## How it works

- `src/lib/defaults.ts` holds the starting content (facts from the requirements documents only).
- `src/lib/content.ts` filters hidden items on the server, so hidden content is never sent to visitors. Hiding Projects hides project pages too, and pages with nothing to show hide themselves.
- `src/lib/normalize.ts` cleans everything saved from the admin (unique slugs, safe URLs only).
- Admin is at `/admin`: password sign-in, signed httpOnly session cookie, form editing for every section, a publish-readiness check, and JSON export/import.
- `/admin` and `/api` are excluded in `robots.txt` and the admin is `noindex`.

## Known limits

- Login rate limiting is per server instance. Add an edge rate limit (or an identity provider) before relying on it.
- Public pages render on request (so admin edits show immediately). Add caching later if traffic grows.
- Not included yet: contact form (needs a mail service), analytics, version history, preview of hidden content.
