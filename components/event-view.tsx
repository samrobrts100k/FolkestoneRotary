import Link from "next/link";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { Accordion, Cd } from "@/components/dx/common";
import { Photo } from "@/components/ui/photo";
import { ShareButtons } from "@/components/share-buttons";
import { JsonLd } from "@/components/json-ld";
import { eventLd, faqLd } from "@/lib/seo/jsonld";
import type { EventItem } from "@/lib/types";
import { cat } from "@/lib/event-categories";
import { googleCalendarUrl, mapsUrl } from "@/lib/ics";
import { formatDate, formatTime } from "@/lib/utils";
import { site } from "@/lib/site";

/** One event, in the seafront design: hero with countdown, the story on the left, a ticket with the essentials on the right. */
export function EventView({ e }: { e: EventItem }) {
  const url = `${site.url}/events/${e.slug}`;
  const future = new Date(e.starts_at) > new Date();
  const [cn, col, light] = cat(e.category);
  const embed = e.lat != null && e.lng != null ? `${e.lat},${e.lng}` : [e.venue_name, e.address, e.postcode].filter(Boolean).join(", ");
  const when = `${formatTime(e.starts_at)}${e.ends_at ? ` – ${formatTime(e.ends_at)}` : ""}`;
  const book = e.book_url ? { href: e.book_url, label: "Book tickets" } : e.enter_url ? { href: e.enter_url, label: "Enter the race" } : null;
  return (
    <DxRoot>
      <JsonLd data={eventLd(e)} />
      {e.faq?.length ? <JsonLd data={faqLd(e.faq)} /> : null}
      <DxHero page="events" crumb="Events" sub={{ name: e.title, path: `/events/${e.slug}` }} title={e.title} lead={e.short_description}
        aside={
          <div className="glass">
            <small>{formatDate(e.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</small>
            <b className="t">{when} · {e.venue_name}</b>
            {future && e.show_countdown !== false && <Cd to={e.starts_at} small label={`Time until ${e.title}`} />}
            {!future && <p style={{ margin: 0, color: "var(--on-dark)" }}>This event has finished. Thank you to everyone who came.</p>}
            {future && (book
              ? <a className="btn gold" href={book.href} target="_blank" rel="noopener noreferrer">{book.label}</a>
              : <Link className="btn gold" href="/contact?subject=Events">Ask about tickets</Link>)}
          </div>
        } />

      <section className="sec"><div className="wrap dtl">
        <div className="dtl-main">
          {e.image_url && <Photo src={e.image_url} alt={e.image_alt || e.title} ratio="aspect-[16/9]" className="dtl-pic" priority sizes="(min-width:1000px) 720px, 100vw" />}
          <h2 className="s">About this event</h2>
          <div className="dtl-copy">{e.description.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>

          {e.programme?.length ? (<>
            <h2 className="s">On the day</h2>
            <ol className="dtl-prog">{e.programme.map((p) => <li key={p.time + p.item}><b>{p.time}</b><span>{p.item}</span></li>)}</ol>
          </>) : null}

          <h2 className="s">Tickets and entry</h2>
          <div className="dtl-copy"><p>{e.ticket_info || "Details coming soon. Ask us and we’ll let you know first."}</p></div>

          {e.sponsors?.length ? (<>
            <h2 className="s">With thanks to</h2>
            <ul className="dtl-chips">{e.sponsors.map((s) => <li key={s}>{s}</li>)}</ul>
          </>) : null}

          {e.gallery?.length ? (<>
            <h2 className="s">Photos</h2>
            <ul className="gal">{e.gallery.map((g) => <li key={g.url}><Photo src={g.url} alt={g.alt} ratio="aspect-square" className="rounded-xl" sizes="220px" /></li>)}</ul>
          </>) : null}

          {e.downloads?.length ? (<>
            <h2 className="s">Downloads</h2>
            <ul className="dtl-dl">{e.downloads.map((d) => <li key={d.url}><a href={d.url}>{d.label}</a></li>)}</ul>
          </>) : null}

          {e.faq?.length ? (<>
            <h2 className="s">Questions</h2>
            <Accordion items={e.faq.map((f) => ({ q: f.q, a: f.a }))} />
          </>) : null}
        </div>

        <aside className="dtl-side">
          <article className={`dtl-tk${light ? " lt" : ""}`} style={{ ["--c" as string]: col }} aria-label="Event details">
            <div className="stub">
              <b>{formatDate(e.starts_at, { day: "numeric" })}</b>
              <span>{formatDate(e.starts_at, { month: "short" })}</span>
              <small>{formatDate(e.starts_at, { weekday: "long" })}</small>
            </div>
            <div className="main">
              <span className="tag">{cn}</span>
              <dl>
                <div><dt>When</dt><dd><time dateTime={e.starts_at}>{formatDate(e.starts_at, { day: "numeric", month: "long", year: "numeric" })}</time>, {when}</dd></div>
                <div><dt>Where</dt><dd>{e.venue_name}{e.address || e.postcode ? <><br />{[e.address, e.postcode].filter(Boolean).join(", ")}</> : null}<br /><a href={mapsUrl(e)} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></dd></div>
              </dl>
              <div className="acts">
                {future && book && <a className="btn blue blk" href={book.href} target="_blank" rel="noopener noreferrer">{book.label}</a>}
                {future && !book && <Link className="btn blue blk" href="/contact?subject=Events">Ask about tickets</Link>}
                {future && <a className="btn ghost blk" href={googleCalendarUrl(e, url)} target="_blank" rel="noopener noreferrer">Add to calendar</a>}
                {future && <a className="lnk" href={`/events/${e.slug}/ics`}>Download for Outlook or Apple Calendar</a>}
              </div>
            </div>
          </article>
          <iframe title={`Map showing ${e.venue_name}`} loading="lazy" className="dtl-map" referrerPolicy="no-referrer-when-downgrade"
            src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(embed)}` : `https://maps.google.com/maps?q=${encodeURIComponent(embed)}&output=embed`} />
          <div className="dtl-share"><ShareButtons url={url} title={e.title} /></div>
        </aside>
      </div></section>

      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="meet" data-rv>
        <h2>Help make it happen</h2>
        <div><p>Put your business on the programme, or give a morning to help it run.</p><Link className="btn" href="/contact?subject=Sponsorship">Sponsor this event</Link>{" "}<Link className="btn ghost" href="/join">Volunteer</Link></div>
      </div></div></section>
    </DxRoot>
  );
}
