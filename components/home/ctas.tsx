import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/sections";
import { Reveal } from "@/components/motion";
import { Check } from "lucide-react";
import { site } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { Sponsor } from "@/lib/types";

export function JoinCta() {
  return (
    <Section tone="blue">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl text-white sm:text-4xl">Make a Difference. Meet Great People.</h2>
        <p className="mt-4 text-lg text-white/90">Join Folkestone Rotary and become part of a welcoming group helping improve our local community.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/join" variant="gold" size="lg">Become a Member</ButtonLink>
          <ButtonLink href="/join#guest" variant="outline-light" size="lg">Visit Us as a Guest</ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}

export function SponsorCta() {
  const perks = ["Sponsor events", "Support community projects", "Promote your business", "Build local relationships"];
  return (
    <Section tone="grey">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-rotary">Business sponsorship</p>
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
