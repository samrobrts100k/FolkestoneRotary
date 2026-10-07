# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, weighted equally. No one audience is allowed to crowd out the others.

- **Potential members:** local people curious about Rotary who want to know who the club is, what a meeting is like, and how to visit as a guest with no obligation.
- **Supporters:** individuals and local businesses who donate, sponsor, or come to fundraising events (Race Night, Wine & Wisdom, Folkestone Half Marathon, Golf Day).
- **Funding applicants:** local charities, schools and community projects applying for Rotary grants, who need clear criteria and a straightforward application.

Behind these is a fourth group: **club volunteers** (admins, editors, events managers, news editors, funding reviewers) who keep the site current through `/admin` without a developer.

Visitors are mostly from Folkestone and the surrounding area, of every age, and many will be on phones.

## Product Purpose

The public website of Folkestone Rotary, a volunteer service club. It shows what the club does for the town, brings in new members, raises money, and gives local groups a route to Rotary funding.

Success in the first year means all of these, with equal weight:

- more membership enquiries and guest visits;
- more event tickets sold and more donations;
- more, and better-prepared, funding applications;
- volunteers able to keep news, events and figures up to date on their own.

## Positioning

A local club made of local people. The money raised stays in Folkestone and goes to named local causes. The site should feel like neighbours doing good work in a specific place: the seafront, the Leas, local schools and charities. It should not read as an anonymous national charity.

## Operating Context

- Lunch meetings on the 2nd and 4th Monday of each month, 12:15 to 12:45, at The Burlington Hotel (details in `lib/site.ts`; dates worked out in `lib/meetings.ts`). Visitors can attend as guests.
- Annual fundraising calendar of events, with tickets or race entry.
- Community funding rounds. Applications move through Received → Under Review → Approved / Declined / More Information Required.
- Content is managed in the admin CMS. Every item is Draft, Published, Scheduled or Archived, with preview before publishing.
- Part of Rotary International, one of the world's largest service organisations.

## Capabilities and Constraints

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, Supabase (database, auth, storage), deployed on Vercel.
- The site runs without credentials using clearly marked sample content (`is_sample`).
- **Donations are not taken on the site.** Donate buttons link to an external donation page (`NEXT_PUBLIC_DONATE_URL`), or to `/donate` until that is set.
- Forms: contact, membership enquiry, funding application (with private document upload), event registration, newsletter. All are spam-protected.
- Roles: Admin, Editor, Events Manager, News Editor, Funding Reviewer, Member. Members have a private area for documents and meetings.
- Analytics load only after cookie consent.
- `design-demos/` holds standalone HTML design explorations (demos A–E) for the homepage direction. They are not part of the app.
- Undecided: the hotel postcode, phone number, social links, and the final donation provider.

## Brand Commitments

- Name: **Folkestone Rotary**. Tagline in use: "Making a Difference in Folkestone".
- The club has an official logo and Rotary brand guidelines. Use those files once supplied. Do not invent a substitute mark.
- Voice: warm, plain, local and modest. Short sentences. "We're local people who…" rather than institutional language.

## Evidence on Hand

- **Coming from the club:** real event photos, real figures (amounts raised, organisations supported, volunteer hours), real stories and testimonials, and the logo / brand files. Event video may follow but is not confirmed.
- **Currently in the repo:** sample content only (`lib/seed.ts`, `supabase/seed.sql`), including sample figures (£48,500+, 40+, 1,200+), the sample Baby Basics quote, and sample news. These must stay visibly labelled as samples until replaced.
- `public/downloads/sponsorship-pack.pdf` is a placeholder.
- Do not fabricate testimonials, figures, partner logos or press. Where real material is missing, keep the labelled sample or leave an honest placeholder.

## Product Principles

1. **Three doors, equal weight.** Joining, supporting and applying for funding should each be findable within seconds from the homepage.
2. **Local and specific.** Name real places, causes and people (once supplied) over generic charity language.
3. **Honest about what's real.** Sample content stays labelled. Figures come from the admin, never from copy.
4. **Volunteers can run it.** Every piece of public content should be editable in `/admin` by a non-technical club member.
5. **Everyone in town can use it.** Mobile-first, accessible, fast on modest phones and connections.

## Accessibility & Inclusion

The target is WCAG 2.2 AA, as stated in the site's accessibility statement. Support keyboard navigation, visible focus, reduced motion and screen readers, and require alt text on every uploaded image. The audience includes older visitors, so text size, contrast and touch targets should be generous.
