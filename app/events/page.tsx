import type { Metadata } from "next";
import Link from "next/link";
import { getPageText, getPastEvents, getUpcomingEvents } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { EventsExplorer, EventsTimeline, NextUp } from "@/components/dx/events";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventCategories } from "@/lib/seed";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Events – charity events in Folkestone", description: "Golf days, the Folkestone Half Marathon, race nights and more. Find and book Folkestone Rotary charity events.", path: "/events" });

export default async function EventsPage() {
  const [upcoming, past, t] = await Promise.all([getUpcomingEvents(), getPastEvents(), getPageText("events")]);
  return (
    <DxRoot>
      <DxHero page="events" crumb="Events" title={t.heroTitle} lead={t.heroLead} aside={upcoming[0] && <NextUp event={upcoming[0]} />} />
      {upcoming.length > 0 && <section className="sec"><div className="wrap"><h2 className="s">{t.yearTitle}</h2><p className="sub">{t.yearSub}</p><EventsTimeline events={upcoming} /></div></section>}
      <section className="sec grey"><div className="wrap"><EventsExplorer upcoming={upcoming} past={past} categories={eventCategories} /></div></section>
      <section className="sec"><div className="wrap"><div className="meet" data-rv><h2>{t.ctaTitle}</h2><div><p style={{ margin: "0 0 16px" }}>{t.ctaText}</p><Link className="btn" href="/contact?subject=Sponsorship">{t.ctaBtn}</Link>{" "}<Link className="btn ghost" href="/join">{t.ctaBtn2}</Link></div></div></div></section>
    </DxRoot>
  );
}
