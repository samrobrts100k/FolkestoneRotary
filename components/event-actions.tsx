"use client";
import { CalendarPlus, Ticket, Trophy } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { googleCalendarUrl } from "@/lib/ics";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import type { EventItem } from "@/lib/types";

/** Book / Enter / Add-to-calendar buttons. Google Calendar link + downloadable ICS. */
export function EventActions({ event: e, compact }: { event: EventItem; compact?: boolean }) {
  const page = `${site.url}/events/${e.slug}`;
  const size = compact ? "sm" : "default";
  const t = (label: string) => () => track("event_click", { label, event: e.slug });
  return (
    <>
      {e.book_url && <ButtonLink href={e.book_url} variant="gold" size={size} onClick={t("book")}><Ticket aria-hidden className="h-4 w-4" />Book</ButtonLink>}
      {e.enter_url && <ButtonLink href={e.enter_url} variant="gold" size={size} onClick={t("enter")}><Trophy aria-hidden className="h-4 w-4" />Enter</ButtonLink>}
      <ButtonLink href={googleCalendarUrl(e, page)} variant="ghost" size={size} onClick={t("google_calendar")}><CalendarPlus aria-hidden className="h-4 w-4" />Add to Calendar</ButtonLink>
      {!compact && <ButtonLink href={`/events/${e.slug}/ics`} variant="ghost" size={size} onClick={t("ics")}>Download .ics</ButtonLink>}
    </>
  );
}
