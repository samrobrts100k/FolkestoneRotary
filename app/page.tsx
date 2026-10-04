import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getNews, getSponsors, getStats, getStories, getUpcomingEvents } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats";
import { EventTickets } from "@/components/home/tickets";
import { NewsList } from "@/components/home/news-list";
import { WhatWeDo } from "@/components/home/what-we-do";
import { JoinCta, NewsletterSection, SponsorCta, SponsorStrip } from "@/components/home/ctas";
import { Section, SectionHeading } from "@/components/sections";
import { StoryCard } from "@/components/cards";
import { Reveal } from "@/components/motion";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: `${site.name} – ${site.tagline}`, path: "/" });

const moreCls = "font-bold text-rotary underline";

export default async function HomePage() {
  const [stats, events, stories, news, sponsors, testimonials] = await Promise.all([getStats(), getUpcomingEvents(3), getStories(), getNews(), getSponsors(), getContentItems("testimonial")]);
  return (
    <>
      <Hero />
      <StatsBand stats={stats} quote={testimonials[0]} />
      <Section>
        <SectionHeading title="What’s on" intro="Come for the fun. The money stays in Folkestone." />
        <EventTickets events={events} />
        <p className="mt-7"><Link href="/events" className={moreCls}>See all events</Link></p>
      </Section>
      <WhatWeDo />
      <Section>
        <SectionHeading title="Real difference, close to home" intro="A few of the local projects your support has made possible." />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{stories.slice(0, 3).map((s, i) => <li key={s.id}><Reveal delay={i * 0.05} className="h-full"><StoryCard story={s} /></Reveal></li>)}</ul>
        <p className="mt-7"><Link href="/impact" className={moreCls}>See all our impact</Link></p>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <SectionHeading title="News from the club" />
        <NewsList items={news.slice(0, 4)} />
        <p className="mt-7"><Link href="/news" className={moreCls}>All news</Link></p>
      </Section>
      <JoinCta />
      <SponsorCta />
      <SponsorStrip sponsors={sponsors} />
      <NewsletterSection />
    </>
  );
}
