import { CalendarDays, Clock, Download, MapPin } from "lucide-react";
import { PageHero, Section, Faq } from "@/components/sections";
import { Photo } from "@/components/ui/photo";
import { ButtonLink } from "@/components/ui/button";
import { EventActions } from "@/components/event-actions";
import { ShareButtons } from "@/components/share-buttons";
import { Countdown } from "@/components/countdown";
import { JsonLd } from "@/components/json-ld";
import { eventLd, faqLd } from "@/lib/seo/jsonld";
import type { EventItem } from "@/lib/types";
import { mapsUrl } from "@/lib/ics";
import { formatDate, formatTime } from "@/lib/utils";
import { site } from "@/lib/site";



export function EventView({ e }: { e: EventItem }) {
  const url = `${site.url}/events/${e.slug}`;
  const future = new Date(e.starts_at) > new Date();
  const embed = e.lat != null && e.lng != null ? `${e.lat},${e.lng}` : [e.venue_name, e.address, e.postcode].filter(Boolean).join(", ");
  return (
    <>
      <JsonLd data={eventLd(e)} />
      {e.faq?.length ? <JsonLd data={faqLd(e.faq)} /> : null}
      <PageHero title={e.title} intro={e.short_description} crumbs={[{ name: "Events", path: "/events" }, { name: e.title, path: `/events/${e.slug}` }]}>
        {e.show_countdown && future && <Countdown to={e.starts_at} />}
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <Photo src={e.image_url} alt={e.image_alt || e.title} ratio="aspect-[16/8]" className="rounded-card" priority sizes="(min-width:1024px) 800px, 100vw" />
            <div className="prose-club mt-8">
              <h2>About this event</h2>
              {e.description.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {e.programme?.length ? (<><h2 className="mb-3 mt-8 text-2xl">Programme</h2>
              <ol className="divide-y divide-slate-200 rounded-card border border-slate-200">{e.programme.map((p) => <li key={p.time + p.item} className="flex gap-4 p-4"><span className="w-16 shrink-0 font-bold text-rotary">{p.time}</span>{p.item}</li>)}</ol></>) : null}
            <h2 className="mb-3 mt-8 text-2xl">Tickets &amp; entry</h2>
            <p className="text-slate-700">{e.ticket_info || "Details coming soon."}</p>
            {e.sponsors?.length ? (<><h2 className="mb-3 mt-8 text-2xl">Sponsors</h2><ul className="flex flex-wrap gap-2">{e.sponsors.map((s) => <li key={s} className="rounded-full bg-surface px-4 py-2 font-semibold">{s}</li>)}</ul></>) : null}
            {e.gallery?.length ? (<><h2 className="mb-3 mt-8 text-2xl">Gallery</h2><ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">{e.gallery.map((g) => <li key={g.url}><Photo src={g.url} alt={g.alt} ratio="aspect-square" className="rounded-xl" sizes="200px" /></li>)}</ul></>) : null}
            {e.downloads?.length ? (<><h2 className="mb-3 mt-8 text-2xl">Downloads</h2><ul className="space-y-2">{e.downloads.map((d) => <li key={d.url}><a href={d.url} className="inline-flex items-center gap-2 font-semibold text-rotary underline"><Download aria-hidden className="h-4 w-4" />{d.label}</a></li>)}</ul></>) : null}
            {e.faq?.length ? (<><h2 className="mb-3 mt-8 text-2xl">FAQ</h2><Faq items={e.faq} /></>) : null}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-3 rounded-card bg-surface p-6">
              <p className="flex items-center gap-3"><CalendarDays aria-hidden className="h-5 w-5 text-rotary" /><time dateTime={e.starts_at}>{formatDate(e.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</time></p>
              <p className="flex items-center gap-3"><Clock aria-hidden className="h-5 w-5 text-rotary" />{formatTime(e.starts_at)}{e.ends_at ? ` – ${formatTime(e.ends_at)}` : ""}</p>
              <p className="flex items-start gap-3"><MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-rotary" /><span>{e.venue_name}<br />{[e.address, e.postcode].filter(Boolean).join(", ")}<br /><a href={mapsUrl(e)} target="_blank" rel="noopener noreferrer" className="font-semibold text-rotary underline">Open in Google Maps</a></span></p>
              <iframe title={`Map showing ${e.venue_name}`} loading="lazy" className="h-48 w-full rounded-xl border-0" referrerPolicy="no-referrer-when-downgrade"
                src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(embed)}` : `https://maps.google.com/maps?q=${encodeURIComponent(embed)}&output=embed`} />
            </div>
            <div className="flex flex-col gap-3 [&>a]:w-full">
              {e.book_url ? null : <ButtonLink href={`/contact?subject=Events`} variant="gold">Book Now</ButtonLink>}
              <EventActions event={e} />
              <ButtonLink href="/contact?subject=Sponsorship" variant="outline">Sponsor This Event</ButtonLink>
              <ButtonLink href="/join" variant="outline">Volunteer</ButtonLink>
            </div>
            <ShareButtons url={url} title={e.title} />
          </aside>
        </div>
      </Section>
    </>
  );
}
