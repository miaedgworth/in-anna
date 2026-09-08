# Inanna Boutique

The website for **Inanna**, an independent women's fashion boutique at
22 Le Pollet, St Peter Port, Guernsey.

A public site the owner never has to touch code to update, and a small admin
area at `/admin` for adding new arrivals, brands and photographs from a phone
in the shop.

- **Stack** — Next.js 15 (App Router, TypeScript), Tailwind CSS v4,
  Postgres on Neon via Prisma, NextAuth (Auth.js v5), Vercel Blob for uploads.
- **Lighthouse (mobile, production build)** — performance 96–98,
  accessibility 100, best practices 100, SEO 100 across all five public pages.

---

## Pages

| Route      | What it is |
| ---------- | ---------- |
| `/`        | Hero, introduction, the first four Gallery photographs, brand logo row, Visit Us block with map |
| `/new-in`  | Every new arrival, newest first |
| `/brands`  | Every visible brand, with description and website link |
| `/gallery` | Masonry photo grid with a keyboard-navigable lightbox. Not in the nav — reached from the home page |
| `/visit`   | Address, opening hours, Google Map, email and phone |
| `/admin`   | Dashboard — New In, Brands, Gallery, Site settings |

`robots.txt`, `sitemap.xml`, per-page Open Graph tags and `LocalBusiness`
(`ClothingStore`) JSON-LD with the address, phone, hours and geo are generated
automatically.

> **Setting this up for the first time?** Follow
> [GOING-LIVE.md](./GOING-LIVE.md) — a click-by-click walkthrough from an empty
> Vercel account to a live site on the real domain. The rest of this file is
> the shorter reference version.

---

## Running it locally

You need Node 20+ and a Postgres database (a free Neon branch is easiest).

```bash
npm install
cp .env.example .env      # then fill it in — see below
npm run db:deploy         # creates the tables
npm run seed              # admin account, placeholder brands, interior photo
npm run dev               # http://localhost:3000
```

Sign in at <http://localhost:3000/admin/login> with `ADMIN_EMAIL` and the
password you hashed.

### The admin password

```bash
npm run hash -- "your-password"
```

This prints the bcrypt hash twice. Use the **plain** form in the Vercel
dashboard, and the **escaped** form (`\$2b\$12\$…`) in a local `.env` file —
Next.js expands `$VAR` references in `.env`, and an unescaped hash is silently
truncated. If you get "that email and password do not match" locally, this is
almost always why; the server log says so explicitly.

---

## Environment variables

Every variable, with what happens if it is missing, is in
[`.env.example`](./.env.example). In short:

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DATABASE_URL` | yes | Neon **pooled** connection string |
| `DIRECT_URL` | yes | Neon **direct** connection string, used by migrations |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | yes | The one admin account |
| `ADMIN_PASSWORD_HASH` | yes | From `npm run hash` |
| `BLOB_READ_WRITE_TOKEN` | production | Vercel Blob. Empty in dev → uploads are written to `/public/uploads` |
| `NEXT_PUBLIC_SITE_URL` | production | Canonical URL, used in metadata, sitemap and JSON-LD |

---

## Deploying to Vercel

1. Push this repository to GitHub and import it in Vercel. The framework is
   detected automatically; no build settings need changing.
2. **Create the database.** In Vercel's Storage tab, add a Neon Postgres
   database (or connect an existing Neon project) and copy the pooled and
   direct connection strings.
3. **Create the blob store.** Storage → Blob. Vercel adds
   `BLOB_READ_WRITE_TOKEN` to the project for you.
4. **Add the remaining environment variables** from the table above to
   Production (and Preview, if you use it). Paste the bcrypt hash *unescaped*
   here.
5. **Create the tables and seed**, once, from your machine with the Neon
   connection strings in your local `.env`:

   ```bash
   npm run db:deploy
   npm run seed
   ```

6. Deploy. Then sign in at `https://your-domain/admin/login` and replace the
   placeholder content.

Adding a custom domain: Vercel → Settings → Domains, then set
`NEXT_PUBLIC_SITE_URL` to the same address so canonical URLs, the sitemap and
the structured data all agree.

---

## How content is managed

Nothing an owner would plausibly want to change is hardcoded.

- **New In**, **Brands** and **Gallery** are database tables, edited at
  `/admin`. Rows can be dragged to reorder on a desktop, or moved with the
  ↑ / ↓ buttons on a phone.
- **Site copy** — tagline, introduction, opening-hours text, the intro
  paragraph on each page, social links and the search-engine description —
  lives in the `SiteSetting` table and is edited at `/admin/settings`. Clearing
  a field restores the default wording.
- **Photographs** are resized in the browser to at most 2000px on the longest
  side before upload, so pictures taken on a phone upload quickly. Every image
  has an alt-text field.
- The shop's **address, phone number and structured opening hours** are in
  `src/lib/business.ts`. They are the shop's identity and feed the JSON-LD, so
  they live in code rather than in the database.

To add a new editable text field, add an entry to
`src/lib/setting-definitions.ts` — it appears in the admin form automatically.

---

## Project layout

```
prisma/schema.prisma          Brand, NewInItem, GalleryImage, SiteSetting, AdminUser
prisma/migrations/            Initial migration (npm run db:deploy)
scripts/seed.ts               npm run seed
scripts/hash-password.ts      npm run hash
src/app/(site)/               Public pages
src/app/admin/                Login, dashboard, the three editors, settings
src/app/admin/actions.ts      All create / update / delete / reorder server actions
src/app/api/upload/           Image upload endpoint (Vercel Blob, or /public/uploads in dev)
src/components/site/          Public UI — header, footer, cards, lightbox, visit details
src/components/admin/         Admin UI — forms, image fields, sortable list
src/lib/business.ts           Address, phone, hours, geo
src/lib/setting-definitions.ts Editable site copy and its defaults
src/middleware.ts             Protects every /admin route
public/brand/                 logo.jpg, interior.jpg
```

## Brand assets — replace before launch

`public/brand/logo.jpg` and `public/brand/interior.jpg` in this repository are
**stand-ins**, generated to match the shop's colours so the layouts could be
built and reviewed. The repository was empty when the site was created, so the
real files were not available.

Overwrite both with the real photographs, keeping the same filenames and
roughly the same shapes, and nothing else needs to change:

| File | Used for | Suggested size |
| ---- | -------- | -------------- |
| `public/brand/logo.jpg` | Open Graph / social sharing image, Apple touch icon | square, 1200×1200 or larger |
| `public/brand/interior.jpg` | Home page hero, and the first gallery photograph | landscape, 2000px wide or larger |

The wordmark in the header, footer and hero is **live text**, not an image — it
is set in Cormorant Garamond with a brushed-gold gradient, so it stays sharp at
any size and is readable by search engines. It does not depend on `logo.jpg`.

## Notes

- `npm run build` prints one warning from Auth.js
  (`CompressionStream … not supported in the Edge Runtime`). It comes from a
  code path the middleware never takes and is safe to ignore.
- The public pages are statically generated and revalidated every five minutes;
  saving anything in the admin area revalidates the affected pages immediately.
- Next.js keeps its data cache in `.next/cache` between builds. If a local
  build seems to show stale content, delete `.next` and build again.
