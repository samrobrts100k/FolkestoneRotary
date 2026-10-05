import type { Metadata } from "next";
import Link from "next/link";
import { getPastEvents, getUpcomingEvents } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { EventsExplorer, EventsTimeline, NextUp } from "@/components/dx/events";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventCategories } from "@/lib/seed";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Events – charity events in Folkestone", description: "Golf days, the Folkestone Half Marathon, race nights and more. Find and book Folkestone Rotary charity events.", path: "/events" });

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return (
    <DxRoot>
      <DxHero page="events" crumb="Events" title="What’s on" lead="Races, quizzes, collections and one very good golf day. Every ticket helps someone in Folkestone." aside={upcoming[0] && <NextUp event={upcoming[0]} />} />
      {upcoming.length > 0 && <section className="sec"><div className="wrap"><h2 className="s">The year at a glance</h2><p className="sub">Every date in the diary, flying from the Harbour Arm. Tap a flag for the details, drag along the arm, or use the arrows.</p><EventsTimeline events={upcoming} /></div></section>}
      <section className="sec grey"><div className="wrap"><EventsExplorer upcoming={upcoming} past={past} categories={eventCategories} /></div></section>
      <section className="sec"><div className="wrap"><div className="meet" data-rv><h2>Want to sponsor or volunteer at an event?</h2><div><p style={{ margin: "0 0 16px" }}>Put your business on the programme, or give a morning to help it run.</p><Link className="btn" href="/contact?subject=Sponsorship">Sponsor an event</Link>{" "}<Link className="btn ghost" href="/join">Volunteer</Link></div></div></div></section>
    </DxRoot>
  );
}
