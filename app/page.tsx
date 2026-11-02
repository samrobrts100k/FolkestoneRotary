import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getNews, getPageText, getSponsors, getStats, getUpcomingEvents } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats";
import { EventTickets } from "@/components/home/tickets";
import { NewsList } from "@/components/home/news-list";
import { JoinCta } from "@/components/home/ctas";
import { SponsorRow } from "@/components/home/sponsors";
import { HomePhotos } from "@/components/home/photos";
import { Section, SectionHeading } from "@/components/sections";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: `${site.name} – ${site.tagline}`, path: "/" });

const moreCls = "font-bold text-rotary underline";

export default async function HomePage() {
  const [stats, events, news, testimonials, sponsors, t, jt] = await Promise.all([getStats(), getUpcomingEvents(3), getNews(), getContentItems("testimonial"), getSponsors(), getPageText("home"), getPageText("join")]);
  return (
    <>
      <Hero t={t} card={{ title: jt.cardTitle, btn: jt.cardBtn, fine: jt.cardFine }} />
      <StatsBand stats={stats} quote={testimonials[0]} />
      <Section>
        <SectionHeading title={t.eventsTitle} intro={t.eventsIntro} />
        <EventTickets events={events} />
        <p className="mt-7"><Link href="/events" className={moreCls}>{t.eventsLink}</Link></p>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <SectionHeading title={t.newsTitle} />
        <NewsList items={news.slice(0, 4)} />
        <p className="mt-7"><Link href="/news" className={moreCls}>{t.newsLink}</Link></p>
      </Section>
      <HomePhotos title={t.photosTitle} value={t.photos} />
      <SponsorRow sponsors={sponsors} t={t} />
      <JoinCta t={t} />
    </>
  );
}
