import Link from "next/link";
import { Reveal } from "@/components/motion";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

const action = (e: EventItem) => (e.enter_url ? "Enter" : e.book_url ? "Get tickets" : "Find out more");

/** Upcoming events as tear-off tickets. The whole ticket links to the event page. */
export function EventTickets({ events }: { events: EventItem[] }) {
  if (!events.length) return <p className="rounded-card bg-mist p-6 text-slate-700">No events are scheduled right now. Check back soon.</p>;
  return (
    <ul className="grid gap-[22px] pb-1 md:grid-cols-3">
      {events.map((e, i) => (
        <li key={e.id}>
          <Reveal delay={i * 0.06} className="h-full">
            <div className="ticket group relative flex h-full min-h-[230px] flex-col gap-1.5 rounded-[14px] bg-gradient-to-b from-mist to-mist-dark px-7 pb-[22px] pt-[26px] transition-transform duration-200 ease-out-quint hover:-translate-y-1 active:-translate-y-0.5 active:scale-[0.985]">
              <time dateTime={e.starts_at} className="text-[15px] font-bold text-rotary">{formatDate(e.starts_at, { weekday: "short", day: "numeric", month: "short" })}</time>
              <h3 className="m-0 text-[26px] leading-[1.1]">{e.title}</h3>
              <p className="m-0 text-base text-slate-blue">{e.short_description}</p>
              <span className="mt-auto origin-bottom-left pt-[34px] font-bold text-rotary-dark transition-transform duration-200 ease-out-quint group-hover:translate-y-[3px] group-hover:rotate-[2.5deg]">{action(e)}</span>
              <Link href={`/events/${e.slug}`} aria-label={`${action(e)}: ${e.title}`} className="absolute inset-0 rounded-[14px]" />
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
