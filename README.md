# portfolio

A minimal personal site: keyboard navigation, rotating tagline, live "time where I am" line, and an MDX blog with syntax highlighting and RSS.

Runs on [vinext](https://github.com/cloudflare/vinext) (Next.js APIs on Vite) and deploys to Cloudflare Workers.

## Get started

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Make it yours

- **Everything personal** (name, bio, rotating roles, timezone, work, projects, links) is in `content/site.ts`.
- **Blog posts** are `.mdx` files in `posts/`. Add `draft: true` to the top section to hide one. Posts are compiled when you build, so redeploy after adding one.
- **Colors and fonts** are at the top of `app/globals.css`.
- **Keyboard shortcuts** (h / b / w / p) are in `components/nav.tsx`.

## Deploy to Cloudflare

1. Make a free Cloudflare account, then log in once from this folder: `npx wrangler login`
2. Deploy: `npm run deploy`

Your site goes live at `portfolio.<your-subdomain>.workers.dev`. To use your own domain, add it in the Cloudflare dashboard under your worker's Settings → Domains & Routes. Then set `url` in `content/site.ts` to that domain so RSS and link previews work.

## Scripts

| command | what it does |
| --- | --- |
| `npm run dev` | local dev server with hot reload |
| `npm run build` | production build for Workers |
| `npm run preview` | run the built Worker locally |
| `npm run deploy` | build and deploy to Cloudflare |
