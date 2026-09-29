# Folkestone Rotary website

Modern, mobile-first, accessible community-charity site for Folkestone Rotary.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn-style UI · Framer Motion · Lucide · Supabase (database, auth, storage) · Vercel-ready.

**The site runs without any credentials** (using clearly-marked sample content), so you can review the design straight away. Forms, login and the admin CMS switch on once Supabase is connected.

## Run locally

```bash
npm install
cp .env.example .env.local     # optional at first – fill in as you go
npm run dev                    # http://localhost:3000
```

Checks: `npm run lint` · `npm run typecheck` · `npm test` · `npm run build`

## Connect Supabase (needed for forms, login, CMS)

1. Create a project at supabase.com.
2. SQL editor → run `supabase/migrations/0001_schema.sql`, then (optional sample content) `supabase/seed.sql`.
   This creates all tables (profiles, events, event_categories, news, news_categories, impact_stories, sponsors, membership_enquiries, funding_applications, funding_documents, contact_enquiries, newsletter_subscribers, donations, pages, media, galleries, gallery_images, plus stats, content_items, meetings, member_documents), row-level security, and storage buckets (`media`, `documents` public; `funding-documents` private).
3. Project Settings → API: copy the URL, anon key and service-role key into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). The service-role key is server-only – never prefix it with `NEXT_PUBLIC_`.
4. Authentication → URL configuration: set Site URL to your domain (and `http://localhost:3000` for dev).

### Create the first admin
1. Supabase → Authentication → Users → **Add user** (email + password).
2. SQL editor:
   ```sql
   update profiles set role = 'admin', is_active = true where email = 'you@example.com';
   ```
3. Sign in at `/login`, then open `/admin`. Invite everyone else from **Admin → Users** (they get an email, set a password, then an admin ticks **Active** and picks a role).

Roles: **Admin** (everything) · **Editor** (all content, enquiries) · **Events Manager** (events) · **News Editor** (news) · **Funding Reviewer** (funding applications) · **Member** (members area only). Permissions are enforced in the app *and* by database row-level security.

## Donations
Donations are **not** taken on this site. The Donate buttons send visitors straight to an external donation page. Set `NEXT_PUBLIC_DONATE_URL` (and optionally `NEXT_PUBLIC_DONATE_MONTHLY_URL`) in your environment. Until it is set, Donate goes to `/donate`, which explains that online giving is being set up and links to the contact form.

## Email (Resend)
Set `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender) and `ADMIN_NOTIFICATION_EMAIL`. Without a key, emails are logged to the console. Templates live in `lib/email/templates.ts` (contact, membership, funding, event registration, newsletter, donation thank-you, admin notification). To use another provider, implement `EmailProvider` in `lib/email/provider.ts`.

## Editing content (no code needed)
Sign in and open **/admin**:

| To change… | Go to |
|---|---|
| Events, news, impact stories, sponsors, galleries | the matching section → **Add** / **Edit** |
| Homepage numbers | **Homepage statistics** |
| FAQs, testimonials, timeline, leadership, annual-report PDFs | **FAQs, testimonials & reports** |
| Photos and PDFs | any image field lets you upload, preview, **crop**, and remove; **Media library** lists everything |
| Enquiries / applications | **Contact enquiries**, **Membership enquiries**, **Funding applications** (set status: Received, Under Review, Approved, Declined, More Information Required) |
| Members-area documents and meetings | **Member documents**, **Meetings** |

Every item has a status: **Draft** (hidden), **Published**, **Scheduled** (goes live at a chosen time), **Archived** (hidden). Use **Preview** on the list to see exactly what visitors will see before publishing. Change the alt text for every image so the site stays accessible.

Club-wide details (meeting time/venue, phone, email, social links) are in `lib/site.ts` — each is marked `placeholder` until confirmed.
Legal pages (`app/privacy`, `cookies`, `accessibility`, `terms`) are drafts to be reviewed before launch.

## Analytics & cookies
Set `NEXT_PUBLIC_GA4_ID` or `NEXT_PUBLIC_GTM_ID`. Scripts load **only after the visitor accepts** in the cookie banner (Accept All / Reject Non-Essential / Manage Preferences). Tracked events: event buttons, donate clicks, membership enquiries, funding applications, newsletter signups (`lib/analytics.ts`). Add `NEXT_PUBLIC_GSC_VERIFICATION` for Google Search Console.

## Spam protection
All forms use a honeypot, a minimum-fill-time check, per-IP rate limiting and (optionally) Cloudflare Turnstile via `TURNSTILE_SECRET_KEY`. Note the rate limiter is in-memory per server instance – put Turnstile on for stronger protection.

## Deploy to Vercel
1. Push this repo to GitHub, then Vercel → **Add New Project** → import it (framework: Next.js, defaults are fine).
2. Add the environment variables from `.env.example` (Production and Preview).
3. Deploy, then add your domain and set `NEXT_PUBLIC_SITE_URL` to it (used for canonical URLs, sitemap and social cards). Submit `/sitemap.xml` in Google Search Console.

## Project layout
`app/` routes · `components/` UI (`ui/` = shadcn-style primitives) · `lib/content.ts` data access (Supabase, falling back to `lib/seed.ts`) · `lib/forms/` validation, spam, storage · `lib/admin/resources.ts` CMS field definitions (add a field here to add it to the admin) · `supabase/` migrations & seed · `tests/` Vitest.
