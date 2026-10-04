import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/sections";
import { Reveal } from "@/components/motion";
import { Check } from "lucide-react";
import { site } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { Sponsor } from "@/lib/types";

/** Gold invitation panel: the lowest-commitment way in is visiting a meeting as a guest. */
export function JoinCta() {
  const venue = site.meeting.venue.replace(/^meeting venue/i, "Venue");
  return (
    <section className="pb-14 sm:pb-20">
      <div className="container">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[1.75rem] bg-gold px-7 py-9 text-navy sm:px-10 md:grid-cols-[1.3fr_1fr] md:gap-10 lg:rounded-panel lg:px-14 lg:py-12">
            <h2 className="m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.1]">Come to a meeting as our guest</h2>
            <div>
              <p className="mb-5 mt-0">{site.meeting.when}. {venue}. No obligation.</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href="/join#guest" className="bg-navy text-white shadow-none hover:bg-rotary-dark focus-visible:outline-navy">Ask to visit</ButtonLink>
                <Link href="/join" className="font-bold text-navy underline focus-visible:outline-navy">Become a member</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SponsorCta() {
  const perks = ["Sponsor events", "Support community projects", "Promote your business", "Build local relationships"];
  return (
    <Section tone="grey">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">Put your business at the heart of Folkestone</h2>
          <p className="mt-3 text-lg text-slate-700">Local businesses are vital to what we do. Sponsor with us and help the community while getting your name in front of local people.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact?subject=Sponsorship" size="lg">Become a Sponsor</ButtonLink>
            <ButtonLink href={site.sponsorshipPackUrl} variant="outline" size="lg">Download Sponsorship Pack</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {perks.map((p) => <li key={p} className="flex items-center gap-3 rounded-card bg-white p-4 font-semibold shadow-soft"><Check aria-hidden className="h-5 w-5 shrink-0 text-rotary" />{p}</li>)}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

export function NewsletterSection() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-card bg-rotary-light p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl">Get our news in your inbox</h2>
        <p className="mb-6 mt-2 text-slate-700">Events, projects and ways to get involved — a few emails a year.</p>
        <NewsletterForm />
      </div>
    </Section>
  );
}

/** Logo strip; falls back to names when a sponsor has no logo. */
export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;
  return (
    <Section className="py-10 sm:py-12">
      <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-slate-blue">Thanks to our sponsors &amp; partners</h2>
      <ul className="flex snap-x gap-4 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible" aria-label="Sponsors">
        {sponsors.map((s) => (
          <li key={s.id} className="snap-start">
            <a href={s.website || "/sponsors"} {...(s.website ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex h-20 min-w-40 items-center justify-center rounded-xl border border-slate-200 px-5 text-center text-sm font-semibold text-navy hover:border-rotary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {s.logo_url ? <img src={s.logo_url} alt={s.name} loading="lazy" className="max-h-12 w-auto" /> : s.name}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
