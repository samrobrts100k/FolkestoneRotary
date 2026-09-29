import type { Metadata } from "next";
import { getPastEvents, getUpcomingEvents } from "@/lib/content";
import { EventsBrowser } from "@/components/events-browser";
import { PageHero, Section } from "@/components/sections";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Events – charity events in Folkestone", description: "Golf days, the Folkestone Half Marathon, race nights and more. Find and book Folkestone Rotary charity events.", path: "/events" });

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return (
    <>
      <PageHero title="Events" intro="Have fun, meet people and raise money for Folkestone causes." crumbs={[{ name: "Events", path: "/events" }]} />
      <Section><EventsBrowser upcoming={upcoming} past={past} />
        <div className="mt-14 rounded-card bg-rotary-light p-6 text-center sm:p-10">
          <h2 className="text-2xl">Want to sponsor or volunteer at an event?</h2>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href="/contact?subject=Sponsorship">Sponsor an event</ButtonLink><ButtonLink href="/join" variant="outline">Volunteer with us</ButtonLink></div>
        </div>
      </Section>
    </>
  );
}
