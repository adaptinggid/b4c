# Bitcoin for Creatives (B4C)

A real, deployable web platform for **Bitcoin for Creatives**, an initiative by **BitEdu Network**. Built with
Next.js (App Router), TypeScript, PostgreSQL (via Prisma), and NextAuth — matching the technical requirements in
the B4C Website Master Information & Requirements Document.

Learn → Create → Collaborate.

---

## What's included

- **Real accounts** — email + password auth (NextAuth, credentials provider, hashed with bcrypt)
- **Creator profiles** — bio, category, skills, Lightning address, social links, participant badge, collaboration status
- **Project publishing** — full submission form, enters `PENDING` review before going public
- **Discover / Collaborate** — search, category filter, sort by newest/XP, "open to collaboration" filter, toggle between Works and Creators
- **XP system** — signed-in users can award 10/25/50 XP to a published project once each; totals roll up to creators
- **Lightning support** — non-custodial: creators provide their own address, shown with copy-to-clipboard and a QR code
- **Admin dashboard** — approve/reject/archive projects, approve creator profiles, grant/revoke the B4C participant badge, remove abusive XP transactions
- **Image uploads** — via Vercel Blob when configured, with a "paste a URL instead" fallback so it works with zero extra setup
- **The same editorial orange/cream/near-black design system** as the interactive prototype

## What's intentionally out of scope for the MVP (per the requirements doc)

- No custodial Lightning wallet / payment processing — support happens directly, wallet-to-wallet
- No bootcamp scheduling, speaker management, or attendance tracking — "Join B4C" simply links to the external
  registration link
- No messaging, follower system, or social feed

---

## 1. Local setup

Requirements: Node.js 20+, npm, and a Postgres database (local, or a free hosted one — see step 2).

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL and AUTH_SECRET in .env at minimum
npx prisma migrate dev --name init
npm run db:seed        # creates your first admin user, from ADMIN_EMAIL / ADMIN_PASSWORD in .env
npm run dev
```

Visit `http://localhost:3000`. Sign up a normal account from the UI to create a creator profile, or sign in with
the admin credentials from `.env` to reach `/admin`.

> **Note on `postinstall`:** this project's `prisma generate` step downloads a small engine binary directly from
> Prisma's CDN. That requires normal outbound internet access — it will work on your machine, in CI, and on
> Vercel automatically. (It's the one thing that could *not* be verified inside the sandboxed environment this
> project was originally built in, which restricts outbound network access to package registries only — see
> "Known limitations" below.)

## 2. Get a free production Postgres database

Any of these work well with Vercel:

- **[Neon](https://neon.tech)** — generous free tier, serverless Postgres, easiest Vercel integration
- **[Supabase](https://supabase.com)** — free tier, also gives you a dashboard for your data
- **[Railway](https://railway.app)** — simple, usage-based free tier

Create a project, copy the connection string (make sure it includes `?sslmode=require`), and use it as
`DATABASE_URL`.

## 3. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel login
vercel
```

Or connect the GitHub repo directly at vercel.com/new — either works.

In the Vercel project settings, add these **Environment Variables**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Postgres connection string from step 2 |
| `AUTH_SECRET` | Output of `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Optional — see step 4 |

Then redeploy. Vercel runs `npm install` (which runs `prisma generate`) and `npm run build` automatically.

**Run the first migration against your production database** (one-time, from your machine):

```bash
DATABASE_URL="your-production-connection-string" npx prisma migrate deploy
DATABASE_URL="your-production-connection-string" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="..." npm run db:seed
```

Your site is now live with a working database and an admin account.

## 4. Turn on image uploads (optional)

Without this, creators and projects can still have images — people paste an image URL instead of uploading a
file. To enable real uploads:

1. In your Vercel project → Storage → Create Database → Blob.
2. Vercel adds `BLOB_READ_WRITE_TOKEN` to your project automatically.
3. Redeploy.

## 5. Promoting more admins later

There's no UI for this on purpose (admin escalation shouldn't be self-service). Either:

- Re-run `npm run db:seed` with a different `ADMIN_EMAIL` after that person has created a normal account, or
- Update the role directly: `UPDATE "User" SET role = 'ADMIN' WHERE email = 'someone@example.com';`

---

## Project structure

```
prisma/schema.prisma        Database schema (User, CreatorProfile, Project, XPTransaction)
prisma/seed.ts               Creates the first admin user
src/lib/auth.ts              NextAuth (credentials + JWT sessions)
src/lib/prisma.ts            Prisma client singleton
src/lib/data.ts              Shared queries (projects/creators with XP totals attached)
src/app/                     Pages (App Router) + API routes under src/app/api/
src/components/              Shared UI: Nav, Footer, cards, Lightning box
```

## Known limitations / honest notes

- **This was built and verified inside a sandboxed environment with restricted outbound network access.**
  `npm install`, TypeScript, and the app code were all verified there — but `prisma generate`'s engine-binary
  download (from `binaries.prisma.sh`) was blocked by that sandbox's allowlist, so a full `next build` could not
  be run end-to-end before delivery. This is standard, well-trodden Prisma/NextAuth code, and `npm install` on
  any machine or CI with normal internet access will complete it automatically — but run `npm run build` once
  yourself after `npm install` to confirm before you rely on it for a launch.
- **Admin passcode note:** the interactive HTML prototype from earlier in this conversation used a hardcoded
  client-side passcode. This real app replaces that with actual accounts and a `role` column — there is no
  passcode anymore.
- **XP abuse prevention** is currently "one XP award per signed-in user per project, ever" (a unique database
  constraint) — simpler than a time-window rule, and matches the doc's goal of preventing repeated voting.
- **Legal copy** (Terms, Privacy Policy, content-ownership wording) is not included — the requirements doc marks
  these `[TO BE PROVIDED / LEGALLY REVIEWED]`, and they should come from BitEdu, not be invented here.
- **Brand assets** — the BitEdu/B4C logo is approximated as an inline SVG mark since I don't have the actual
  logo file as a usable asset; drop the real files into `src/components/Mark.tsx` or `public/` when you have them.
