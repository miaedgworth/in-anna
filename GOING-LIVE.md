# Going live — step by step

A complete walkthrough from the code as it stands to a working website on a
real address. Follow it in order. Nothing here assumes you have done any of it
before.

Roughly 45 minutes, most of it waiting for things to deploy.

> **Some of this is already done.** The Neon database has been created, the
> tables built, and the placeholder content seeded — so **step 6 and step 9 are
> complete**, and you can skip them. The Vercel project `inanna-boutique`
> exists, is linked to this repository, and has its environment variables set.
>
> What is left: your real content (step 13) and the domain (step 14).

**Contents**

1. [What you need before you start](#1-what-you-need-before-you-start)
2. [Rename the branch to `main`](#2-rename-the-branch-to-main)
3. [Get a terminal](#3-get-a-terminal)
4. [Generate your two secrets](#4-generate-your-two-secrets)
5. [Create the Vercel project](#5-create-the-vercel-project)
6. [Create the database (Neon)](#6-create-the-database-neon)
7. [Create the image store (Vercel Blob)](#7-create-the-image-store-vercel-blob)
8. [Add the rest of the environment variables](#8-add-the-rest-of-the-environment-variables)
9. [Create the database tables](#9-create-the-database-tables)
10. [Deploy and sign in](#10-deploy-and-sign-in)
11. [Enquiries — no contact form](#11-enquiries--no-contact-form)
12. [Replace the placeholder photographs](#12-replace-the-placeholder-photographs)
13. [Fill in the real content](#13-fill-in-the-real-content)
14. [Connect the domain](#14-connect-the-domain)
15. [Final checks](#15-final-checks)
16. [If something goes wrong](#if-something-goes-wrong)

---

## 1. What you need before you start

Accounts — all have a free tier that is plenty for a shop website:

| Service | What it is for | Sign up at |
| ------- | -------------- | ---------- |
| GitHub | You already have this — the code lives at `miaedgworth/in-anna` | — |
| Vercel | Hosts the website | <https://vercel.com/signup> — choose **Continue with GitHub** |
| Neon | The database | You will create this *through* Vercel in step 6 |

Also have to hand:

- The two real photographs (the pink logo image and the shop interior shot).
- Access to the DNS for `inannaboutique.co.uk`, if you want the custom domain.
- A password you want to use for the admin area. Pick a long one — a phrase of
  four or five words is ideal.

---

## 2. Rename the branch to `main`

All the code is on a branch called `claude/inanna-boutique-website-marx46`, and
because it is the only branch, GitHub has already made it the repository's
**default** branch. Vercel deploys whatever the default branch is, so strictly
speaking you could skip this step.

It is worth 30 seconds, though — `main` is the name everything else assumes,
and this guide refers to it from here on.

1. Go to <https://github.com/miaedgworth/in-anna/branches>.
2. Next to `claude/inanna-boutique-website-marx46`, click the pencil ✏️
   (**Rename branch**) icon.
3. Type `main` and click **Rename branch**.

That is it — there is nothing to merge, because there is no other branch to
merge into.

> If you would rather leave the branch name alone, everything still works.
> Just read "main" as `claude/inanna-boutique-website-marx46` wherever it
> appears below.

---

## 3. Get a terminal

You need a command line **once**, to generate your admin password hash. Two
ways — pick whichever you prefer.

### Option A — GitHub Codespaces (nothing to install)

1. Go to <https://github.com/miaedgworth/in-anna>.
2. Click the green **Code** button → **Codespaces** tab → **Create codespace on
   main** (or on `claude/inanna-boutique-website-marx46`, if you skipped the
   rename).
3. Wait a minute. A code editor opens in your browser with a terminal panel at
   the bottom. Node is already installed.
4. In that terminal, run:

   ```bash
   npm install
   ```

   Leave the tab open — you will come back to it in step 4 and step 9.

> Codespaces has a free monthly allowance on personal accounts, billed by the
> hour while a codespace is running. Click **Stop codespace** from the Code
> menu when you are finished so it is not left running.

### Option B — Your own computer

1. Install Node from <https://nodejs.org> (choose the **LTS** button).
2. Install Git from <https://git-scm.com/downloads> if you do not have it.
3. Open Terminal (macOS) or PowerShell (Windows) and run:

   ```bash
   git clone https://github.com/miaedgworth/in-anna.git
   cd in-anna
   npm install
   ```

Either way, when this guide says "in your terminal", it means the one you just
set up.

---

## 4. Generate your two secrets

Two values need generating before anything else. Do both now and paste them
somewhere safe (a password manager, or a note you will delete afterwards).

### 4a. `AUTH_SECRET`

This is the key that signs your login session. In your terminal:

```bash
openssl rand -base64 32
```

You get something like `k8Jd2mQ9vN4pR7sT1wX6yB3zC5aE0fG8hI2jK4lM6nO=`.

> On Windows PowerShell, if `openssl` is not found, use this instead:
>
> ```powershell
> [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
> ```

Copy the whole line, including the `=` at the end. **This is `AUTH_SECRET`.**

### 4b. `ADMIN_PASSWORD_HASH`

This turns your password into something safe to store. In your terminal, with
your chosen password in the quotes:

```bash
npm run hash -- "the password you chose"
```

You will see two versions printed:

```
For Vercel (and any other hosting dashboard) — paste exactly:

  $2b$12$C0ypketgAyg3TeZ7OoYYk.fhXJg.lcU4Z95gzRGR.RPQ5/gWNwOVO

For a local .env file — the dollar signs must be escaped:

  ADMIN_PASSWORD_HASH="\$2b\$12\$C0ypketgAyg3TeZ7OoYYk.fhXJg.lcU4Z95gzRGR.RPQ5/gWNwOVO"
```

**Copy the first one** — the plain `$2b$12$...` line. That is what goes into
Vercel. (The second version is only for a `.env` file on your own machine,
where the `$` signs have to be escaped or they get eaten.)

Keep both this hash and your actual password. The hash cannot be turned back
into the password — if you lose the password, run this command again with a new
one and update the variable in Vercel.

---

## 5. Create the Vercel project

1. Go to <https://vercel.com/new>.
2. Under **Import Git Repository**, find `miaedgworth/in-anna` and click
   **Import**. If you do not see it, click **Adjust GitHub App Permissions**
   and grant access to that repository.
3. Vercel will detect Next.js. **Do not change any build settings.**
4. **Do not click Deploy yet** — expand **Environment Variables** and add these
   three now (there are more to come in step 8, but these three stop the first
   build from being wasted):

   | Name | Value |
   | ---- | ----- |
   | `AUTH_SECRET` | the value from step 4a |
   | `ADMIN_EMAIL` | `hello@inannaboutique.co.uk` |
   | `ADMIN_PASSWORD_HASH` | the plain `$2b$12$...` hash from step 4b |

5. Click **Deploy**.

The first build will succeed, but the site will not have a database yet — that
is expected and it is the next step. It will show the default wording with
empty New In, Brands and Gallery sections.

---

## 6. Create the database (Neon)

> ✅ **Already done.** The project `inanna-boutique` exists in the Neon account
> (London / eu-west-2, free plan), with all six tables created, the initial
> migration recorded, and the placeholder brands, gallery photograph and site
> settings seeded. `DATABASE_URL` and `DIRECT_URL` are already set in Vercel.
> Read on only if you ever need to rebuild it from scratch.

1. In your new Vercel project, open the **Storage** tab.
2. Click **Create Database** → choose **Neon** (Serverless Postgres) →
   **Continue**.
3. Accept the free plan. For the region choose the one closest to Guernsey —
   **Frankfurt** or **London / eu-west** if offered.
4. Give it a name (`inanna-db` is fine) and click **Create**.
5. When it finishes, make sure it is **connected to this project** — Vercel
   usually does this automatically and adds several environment variables.

### Check the variable names

Go to **Settings → Environment Variables** in the project. Neon adds a handful.
This site needs exactly two, and one of them almost certainly needs adding by
hand:

| This site needs | Neon usually provides it as |
| --------------- | --------------------------- |
| `DATABASE_URL` | `DATABASE_URL` — already correct, nothing to do |
| `DIRECT_URL` | `DATABASE_URL_UNPOOLED` (sometimes `POSTGRES_URL_NON_POOLING`) |

So:

1. Find `DATABASE_URL_UNPOOLED` (or `POSTGRES_URL_NON_POOLING`) and click the
   eye / **Show value** icon. Copy the whole string.
2. Click **Add Another** / **Add New**.
3. Name: `DIRECT_URL`. Value: the string you just copied. Tick **Production**,
   **Preview** and **Development**. Save.

Both strings start with `postgresql://` and end with something like
`?sslmode=require`. The difference is that the pooled one has `-pooler` in the
host name and the direct one does not.

> **Why two?** The app talks to the database through a connection pooler, which
> is faster and cheaper. Database migrations cannot run through a pooler, so
> they need the direct address.

---

## 7. Create the image store (Vercel Blob)

This is where photographs uploaded from the admin area are kept.

1. Still in the **Storage** tab, click **Create Database** →
   **Blob** → **Continue**.
2. Name it (`inanna-images`) and click **Create**.
3. Make sure it is connected to the project. Vercel adds
   `BLOB_READ_WRITE_TOKEN` automatically — you do not have to copy anything.

Check it appears under Settings → Environment Variables.

> Without this, uploads in production will refuse with a clear error rather
> than saving to a disk that gets wiped on every deploy.

---

## 8. Add the rest of the environment variables

Settings → Environment Variables. Add the ones you do not already have. For
each, tick **Production**, **Preview** and **Development**.

| Name | Value | Required? |
| ---- | ----- | --------- |
| `AUTH_SECRET` | from step 4a | added in step 5 |
| `ADMIN_EMAIL` | `hello@inannaboutique.co.uk` | added in step 5 |
| `ADMIN_PASSWORD_HASH` | plain `$2b$12$...` from step 4b | added in step 5 |
| `DATABASE_URL` | added by Neon | step 6 |
| `DIRECT_URL` | copied by hand | step 6 |
| `BLOB_READ_WRITE_TOKEN` | added by Vercel Blob | step 7 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.inannaboutique.co.uk` | **add now** |

**About `NEXT_PUBLIC_SITE_URL`:** set it to whatever address the public will
actually use. If you are not doing the custom domain yet, use the
`something.vercel.app` address Vercel gave you, and change it later in step 14.
It has to match, because it is used in the sitemap, the canonical links and the
structured data Google reads.

---

## 9. Create the database tables

> ✅ **Already done** — the tables exist and are seeded. Keep this section for
> the day you need a second database (a staging copy, say), or if you ever
> reset the current one.

The database exists but is empty. This step creates the tables.

Go back to your terminal from step 3.

### 9a. Point the terminal at your Neon database

Create a file called `.env` in the project folder. In Codespaces: right-click in
the file list → **New File** → name it `.env`. On your own machine, use any text
editor.

Paste in the following, replacing the two connection strings with the ones from
step 6 (**Settings → Environment Variables**, click the eye icon to reveal each,
copy the whole thing):

```
DATABASE_URL="paste the DATABASE_URL value here"
DIRECT_URL="paste the DIRECT_URL value here"
ADMIN_EMAIL="hello@inannaboutique.co.uk"
ADMIN_PASSWORD_HASH="paste the ESCAPED version from step 4b here"
```

Two things to be careful about:

- Keep the double quotes around each value.
- For `ADMIN_PASSWORD_HASH`, use the **second**, escaped version from step 4b —
  the one that looks like `\$2b\$12\$...`. In a `.env` file the dollar signs
  must be escaped. (If you no longer have it, just run
  `npm run hash -- "your password"` again — same password, and use the
  `ADMIN_PASSWORD_HASH="..."` line it prints.)

`.env` is already in `.gitignore`, so it will never be committed.

### 9b. Create the tables

```bash
npm run db:deploy
```

You should see:

```
The following migration(s) have been applied:
migrations/
  └─ 20260101000000_init/
    └─ migration.sql
All migrations have been successfully applied.
```

### 9c. Add the starter content (optional but recommended)

```bash
npm run seed
```

This adds your admin account to the database, six clearly-labelled placeholder
brands, the interior photograph in the gallery, and the default wording. It is
safe to run more than once — it never overwrites anything you have edited.

> You can skip the seed entirely if you would rather start from nothing. The
> site falls back to sensible default wording either way, and your login works
> from the environment variables regardless.

---

## 10. Deploy and sign in

Vercel builds a production deployment whenever something is pushed to the
production branch — which for this project is
`claude/inanna-boutique-website-marx46`. If the project Overview says
**"No Production Deployment"**, nothing has been pushed since the repository
was connected, and the fix is simply to push a commit.

1. In Vercel, go to the **Deployments** tab.
2. If a deployment is already listed, click the **⋯** menu → **Redeploy** →
   **Redeploy**. This is needed because a deployment keeps the environment
   variables it was created with, so anything added since its build is invisible
   to it. If the list is empty, push any commit to the production branch
   instead.
3. Wait for it to go green.
4. Click **Visit** — the public site should now show the six placeholder brands
   and the interior photograph in the gallery.
5. Go to `https://your-site.vercel.app/admin/login`.
6. Sign in with `hello@inannaboutique.co.uk` and the password you chose in
   step 4b.

If the login is rejected, see [If something goes wrong](#if-something-goes-wrong).

---

## 11. Enquiries — no contact form

There is no contact form on the site, by design. The Visit Us page offers an
**Email the shop** button and a tap-to-dial phone number instead, both pointing
at the details in `src/lib/business.ts`.

That means there is no email service to set up, nothing to configure, and no
way for a message to be quietly lost — an enquiry arrives in the shop inbox as
an ordinary email, from the customer's own address, so replying is just
replying.

> An earlier version had a form backed by Resend. It was removed because a form
> that cannot send is worse than no form: it tells the customer their message is
> on its way when it is not. If you ever want it back, it is in the git history —
> `git log -- src/components/site/ContactForm.tsx`.

---

## 12. Replace the placeholder photographs

`public/brand/logo.jpg` and `public/brand/interior.jpg` in the repository are
stand-ins. Swap in the real ones:

1. Go to <https://github.com/miaedgworth/in-anna/tree/HEAD/public/brand>.
2. Click `logo.jpg`, then the **⋯** menu at the top right of the file →
   **Delete file** → **Commit changes**.
3. Go back to the `public/brand` folder → **Add file** → **Upload files**.
4. Drag your real logo image in. **It must be named exactly `logo.jpg`** —
   rename it on your computer first if it is a `.png` or has a different name.
5. **Commit changes**.
6. Repeat for `interior.jpg`.

| File | Where it appears | Best shape |
| ---- | ---------------- | ---------- |
| `logo.jpg` | The preview card when the site is shared on Facebook, WhatsApp or Instagram; the icon when saved to a phone home screen | Square, 1200×1200 or larger |
| `interior.jpg` | The big photograph across the top of the home page | Landscape, at least 2000px wide |

Vercel redeploys automatically when you commit. Give it a minute, then reload
the site.

> The `inanna` wordmark in the header, footer and over the hero is **live
> text**, not an image — it is set in Cormorant Garamond with a brushed-gold
> gradient. It will not change when you swap `logo.jpg`, and that is deliberate:
> it stays sharp at every size and search engines can read it.

---

## 13. Fill in the real content

All of this is done at `https://your-site/admin`, and works fine from a phone
in the shop.

Work through it in this order — New In items can be attached to a brand, so
brands are worth doing first.

### 13a. Brands

`/admin/brands`

1. Delete the six placeholders as you replace them — each is labelled
   *"Placeholder brand — replace in admin"* so you can see which are left.
2. For each real brand: **+ Add a brand** → name, logo image (drag it in or tap
   to choose), a sentence or two of description, and the brand's website if
   they have one.
3. Leave **Show this brand on the website** ticked. Untick it later if you stop
   stocking a label but want to keep the entry.
4. Drag rows, or use the ↑ / ↓ buttons, to set the order they appear in.

A brand with no logo shows its name in the serif type instead, which looks
perfectly good — do not feel obliged to hunt down logos.

### 13b. New In

`/admin/new-in`

1. **+ Add a piece** → photograph, title, brand from the dropdown, price and a
   short note (`Sizes 8–16 in store`, `One left in 12`).
2. Tick **Feature on the home page** for the pieces you want in the strip on the
   home page. It shows four; if you feature fewer, it tops up with the most
   recent.
3. New pieces go to the top of the list automatically. Reorder as you like.

Price and note are both optional — leave them blank if you would rather not
show prices online.

### 13c. Gallery

`/admin/gallery`

1. **+ Upload photographs** → choose several at once. They upload as you pick
   them.
2. The caption box applies to the whole batch; you can edit each one afterwards
   under **Edit**.
3. Reorder by dragging or with the arrows.

### 13d. Site settings

`/admin/settings` — every piece of wording on the site that is not a product,
brand or photo caption:

- **Hero tagline** — currently *"Considered womenswear in the heart of St Peter
  Port"*. Change it to whatever you would say to someone at the door.
- **Introduction heading and paragraph** — the block under the hero.
- **Opening hours (display text)** — how the hours read in the footer.
- **Visit Us / New In / Brands / Gallery introductions** — the paragraph at the
  top of each page.
- **Instagram URL** and **Facebook URL** — paste the full address, e.g.
  `https://www.instagram.com/inannaguernsey`. The icons in the footer stay
  hidden until you fill these in.
- **Search engine description** — the sentence Google shows under the site name.
  Aim for about 150 characters.

Clearing a field puts the original wording back.

> The address, phone number and the structured opening hours that Google reads
> are in the code (`src/lib/business.ts`), not here — they are the shop's
> identity rather than copy. If the shop ever moves or changes its hours, that
> one file is what to edit.

---

## 14. Connect the domain

1. In Vercel: **Settings → Domains → Add**.
2. Type `inannaboutique.co.uk` and click **Add**.
3. Vercel will suggest also adding `www.inannaboutique.co.uk` and redirecting
   one to the other. Accept — pointing `www` at the site and redirecting the
   bare domain to it is the usual choice.
4. Vercel shows you the DNS records to create. Go to wherever the domain is
   registered (123-reg, GoDaddy, Cloudflare, Names.co…), find the DNS settings,
   and add them:

   | Type | Name | Value |
   | ---- | ---- | ----- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   **Use the exact values Vercel shows you**, not the ones above — they are
   illustrative and Vercel occasionally changes them.

5. Wait. DNS usually updates within an hour but can take up to 24. Vercel shows
   a green tick per domain when it is live, and issues the HTTPS certificate
   automatically.
6. **Then** go to Settings → Environment Variables and change
   `NEXT_PUBLIC_SITE_URL` to `https://www.inannaboutique.co.uk` (or whichever of
   the two you made primary), and redeploy.

---

## 15. Final checks

Once the domain is live, walk through this list:

- [ ] Every page loads: `/`, `/new-in`, `/brands`, `/gallery`, `/visit`.
- [ ] The hero photograph is the real one.
- [ ] The phone number in the footer dials when tapped on a phone.
- [ ] The email address opens a mail app when tapped.
- [ ] The map on the Visit Us page shows 22 Le Pollet.
- [ ] Tap **Email the shop** on the Visit Us page and check it opens a new email to hello@inannaboutique.co.uk.
- [ ] Open the site on a phone — check the menu button, and tap through a
      gallery photo to the lightbox.
- [ ] `https://www.inannaboutique.co.uk/sitemap.xml` lists all five pages with
      the right domain.
- [ ] Paste the home page address into WhatsApp or Slack — the preview card
      should show the logo and the description.
- [ ] Sign in to `/admin` on your phone and add a test New In piece, then delete
      it.

Then tell Google about the site:

1. Go to <https://search.google.com/search-console> and sign in.
2. **Add property** → **URL prefix** → your full address.
3. Verify — the easiest method is the HTML tag one; if Vercel offers a Google
   verification option, use that instead.
4. Once verified: **Sitemaps** → enter `sitemap.xml` → **Submit**.

Also claim the shop on Google Maps if you have not already
(<https://business.google.com>) — the `LocalBusiness` data on the site backs up
that listing, but the listing itself is what puts you on the map.

---

## If something goes wrong

### "That email and password do not match"

Nine times out of ten this is the bcrypt hash.

- **In Vercel:** the value must be the **plain** hash, starting `$2b$12$` with
  no backslashes. If you pasted the escaped `\$2b\$12\$` version, replace it.
- **In a local `.env` file:** it must be the **escaped** `\$2b\$12\$` version.
  Unescaped, Next.js reads `$2b` as a variable name and silently deletes most of
  the hash.
- After changing it in Vercel you **must redeploy**. A deployment keeps the
  environment variables it was created with, so editing a variable does nothing
  until the next deploy.
- Check `ADMIN_EMAIL` has no stray spaces and matches what you are typing.

The server log says so explicitly when the hash is malformed: Vercel →
Deployments → your deployment → **Runtime Logs**, look for `[auth]`.

### The site loads but New In / Brands / Gallery are empty

The database is not reachable, or the tables were never created.

- Check `DATABASE_URL` and `DIRECT_URL` are both set in Vercel.
- Check you ran `npm run db:deploy` in step 9.
- Look at Runtime Logs for `[content] database read failed`.

The site is built to keep rendering when the database is away rather than
showing an error page, which is why this looks like "empty" rather than
"broken".

### Uploading a photo fails in the admin area

- Check `BLOB_READ_WRITE_TOKEN` exists in Vercel (step 7) and that you have
  redeployed since adding it.
- Photographs are shrunk in the browser before upload, so size is rarely the
  issue, but the limit is 8MB after resizing.
- Accepted formats are JPEG, PNG, WebP and AVIF. iPhones normally hand over a
  JPEG when you pick a photo, so this rarely comes up — but if a photo is
  refused, open it in Photos, choose **Duplicate**, and upload that, or export
  it as JPEG first.

### A change I made in the admin area is not showing on the site

Give it a few seconds and reload. Pages are cached and refreshed when you save.
If it still has not appeared, do a hard reload (Ctrl/Cmd + Shift + R).

### The build failed in Vercel

Open Deployments → the failed one → **Build Logs** and read the last few lines.
The usual causes are a missing environment variable or a typo in one of the
connection strings.

There is one warning that is **not** a failure and can be ignored:

```
A Node.js API is used (CompressionStream ...) which is not supported in the Edge Runtime
```

It comes from the authentication library, on a code path this site never takes.

### I need to change my admin password

```bash
npm run hash -- "the new password"
```

Update `ADMIN_PASSWORD_HASH` in Vercel with the plain version, redeploy, and if
you seeded the database also update your local `.env` with the escaped version
and run `npm run seed` again.

---

## Where things live, for later

| I want to change… | Where |
| ----------------- | ----- |
| Any wording on the site | `/admin/settings` |
| New arrivals, brands, gallery photos | `/admin` |
| The shop's address, phone or opening hours | `src/lib/business.ts` in the code |
| The two brand photographs | `public/brand/` in the code |
| Colours or fonts | `src/app/globals.css` in the code |

Adding a new editable text field is a one-line change: add an entry to
`src/lib/setting-definitions.ts` and it appears in the admin form by itself.
