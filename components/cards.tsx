import Link from "next/link";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { EventActions } from "@/components/event-actions";
import { categoryName, formatDate, formatTime, gbp } from "@/lib/utils";
import { eventCategories, newsCategories } from "@/lib/seed";

import type { EventItem, ImpactStory, NewsItem } from "@/lib/types";

export function EventCard({ event: e, showTime = false }: { event: EventItem; showTime?: boolean }) {
  return (
    <Card className="flex h-full flex-col">
      <Photo src={e.image_url} alt={e.image_alt || `${e.title} – Folkestone Rotary`} />
      <CardBody className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2"><Badge>{categoryName(eventCategories, e.category)}</Badge></div>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-rotary"><CalendarDays aria-hidden className="h-4 w-4" /><time dateTime={e.starts_at}>{formatDate(e.starts_at, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</time></p>
        {showTime && <p className="mt-1 flex items-center gap-2 text-sm text-slate-blue"><Clock aria-hidden className="h-4 w-4" />{formatTime(e.starts_at)}{e.ends_at ? ` – ${formatTime(e.ends_at)}` : ""}</p>}
        <h3 className="mt-2 text-xl"><Link href={`/events/${e.slug}`} className="hover:text-rotary">{e.title}</Link></h3>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-blue"><MapPin aria-hidden className="h-4 w-4 shrink-0" />{e.venue_name}</p>
        <p className="mt-3 flex-1 text-slate-700">{e.short_description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ButtonLink href={`/events/${e.slug}`} size="sm">Find Out More</ButtonLink>
          <EventActions event={e} compact />
        </div>
      </CardBody>
    </Card>
  );
}

export function NewsCard({ item: n }: { item: NewsItem }) {
  return (
    <Card className="flex h-full flex-col">
      <Photo src={n.image_url} alt={n.image_alt || n.title} />
      <CardBody className="flex flex-1 flex-col">
        <p className="text-sm font-semibold text-rotary"><time dateTime={n.published_at}>{formatDate(n.published_at)}</time> · {categoryName(newsCategories, n.category)}</p>
        <h3 className="mt-2 text-xl"><Link href={`/news/${n.slug}`} className="hover:text-rotary">{n.title}</Link></h3>
        <p className="mt-2 flex-1 text-slate-700">{n.summary}</p>
        <div className="mt-4"><ButtonLink href={`/news/${n.slug}`} variant="outline" size="sm">Read More</ButtonLink></div>
      </CardBody>
    </Card>
  );
}

export function StoryCard({ story: s }: { story: ImpactStory }) {
  return (
    <Card className="flex h-full flex-col">
      <Photo src={s.image_url} alt={s.image_alt || s.title} />
      <CardBody className="flex flex-1 flex-col">
        <p className="text-sm font-semibold text-rotary">{s.organisation}</p>
        <h3 className="mt-1 text-xl">{s.title}</h3>
        <p className="mt-2 text-slate-700">{s.summary}</p>
        {s.amount_awarded ? <p className="mt-3"><Badge>{gbp(s.amount_awarded)} awarded</Badge></p> : null}
        <p className="mt-3 flex-1 text-sm text-slate-blue"><strong className="text-navy">Outcome:</strong> {s.outcome}</p>
        <div className="mt-4"><ButtonLink href={`/impact#${s.slug}`} variant="outline" size="sm">Read More</ButtonLink></div>
      </CardBody>
    </Card>
  );
}
