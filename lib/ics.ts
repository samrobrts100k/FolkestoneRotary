import type { EventItem } from "./types";
import { isAllDay, londonParts } from "./event-time";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);
/** All-day events go into calendars as all-day: start date, and the day after the last day (calendar convention). */
const day = (iso: string) => londonParts(iso).date.replace(/-/g, "");
const nextDay = (iso: string) => { const d = new Date(`${londonParts(iso).date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10).replace(/-/g, ""); };
const allDay = (e: Pick<EventItem, "starts_at" | "ends_at">) => isAllDay(e.starts_at) ? { start: day(e.starts_at), end: nextDay(e.ends_at ?? e.starts_at) } : null;
const endOf = (e: Pick<EventItem, "starts_at" | "ends_at">) => e.ends_at ?? new Date(new Date(e.starts_at).getTime() + 2 * 3600_000).toISOString();
const where = (e: EventItem) => [e.venue_name, e.address, e.postcode].filter(Boolean).join(", ");

export function googleCalendarUrl(e: EventItem, pageUrl: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE", text: e.title, dates: ((a) => (a ? `${a.start}/${a.end}` : `${stamp(e.starts_at)}/${stamp(endOf(e))}`))(allDay(e)),
    details: `${e.short_description}\n${pageUrl}`, location: where(e),
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function buildIcs(e: EventItem, pageUrl: string) {
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Folkestone Rotary//Website//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${e.id}@folkestonerotary`, `DTSTAMP:${stamp(new Date().toISOString())}`,
    ...((a) => (a ? [`DTSTART;VALUE=DATE:${a.start}`, `DTEND;VALUE=DATE:${a.end}`] : [`DTSTART:${stamp(e.starts_at)}`, `DTEND:${stamp(endOf(e))}`]))(allDay(e)),
    `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.short_description + "\n" + pageUrl)}`, `LOCATION:${esc(where(e))}`, `URL:${pageUrl}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export const mapsUrl = (e: Pick<EventItem, "venue_name" | "address" | "postcode" | "lat" | "lng">) =>
  e.lat != null && e.lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.venue_name, e.address, e.postcode].filter(Boolean).join(", "))}`;
