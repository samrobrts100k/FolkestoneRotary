import type { Metadata } from "next";
import { getNews, getSponsors, getStats, getStories, getUpcomingEvents } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats";
import { WhatWeDo } from "@/components/home/what-we-do";
import { JoinCta, NewsletterSection, SponsorCta, SponsorStrip } from "@/components/home/ctas";
import { Section, SectionHeading } from "@/components/sections";
import { EventCard, NewsCard, StoryCard } from "@/components/cards";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: `${site.name} – ${site.tagline}`, path: "/" });

export default async function HomePage() {
  const [stats, events, stories, news, sponsors] = await Promise.all([getStats(), getUpcomingEvents(3), getStories(), getNews(), getSponsors()]);
  return (
    <>
      <Hero />
      <StatsBand stats={stats} />
      <Section>
        <SectionHeading eyebrow="What's on" title="Upcoming events" intro="Fun, friendly ways to support Folkestone." />
        {events.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((e, i) => <li key={e.id}><Reveal delay={i * 0.05} className="h-full"><EventCard event={e} /></Reveal></li>)}</ul>
        ) : <p className="rounded-card bg-surface p-6 text-slate-700">No events are scheduled right now — check back soon.</p>}
        <div className="mt-8 text-center"><ButtonLink href="/events" variant="outline" size="lg">View All Events</ButtonLink></div>
      </Section>
      <WhatWeDo />
      <Section>
        <SectionHeading eyebrow="Our impact" title="Real difference, close to home" intro="A few of the local projects your support has made possible." />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{stories.slice(0, 3).map((s, i) => <li key={s.id}><Reveal delay={i * 0.05} className="h-full"><StoryCard story={s} /></Reveal></li>)}</ul>
        <div className="mt-8 text-center"><ButtonLink href="/impact" variant="outline" size="lg">See All Our Impact</ButtonLink></div>
      </Section>
      <Section tone="grey">
        <SectionHeading eyebrow="Latest news" title="News from the club" />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{news.slice(0, 3).map((n, i) => <li key={n.id}><Reveal delay={i * 0.05} className="h-full"><NewsCard item={n} /></Reveal></li>)}</ul>
        <div className="mt-8 text-center"><ButtonLink href="/news" variant="outline" size="lg">View All News</ButtonLink></div>
      </Section>
      <JoinCta />
      <SponsorCta />
      <SponsorStrip sponsors={sponsors} />
      <NewsletterSection />
    </>
  );
}
