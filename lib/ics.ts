import type { EventItem } from "./types";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);
const endOf = (e: Pick<EventItem, "starts_at" | "ends_at">) => e.ends_at ?? new Date(new Date(e.starts_at).getTime() + 2 * 3600_000).toISOString();
const where = (e: EventItem) => [e.venue_name, e.address, e.postcode].filter(Boolean).join(", ");

export function googleCalendarUrl(e: EventItem, pageUrl: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE", text: e.title, dates: `${stamp(e.starts_at)}/${stamp(endOf(e))}`,
    details: `${e.short_description}\n${pageUrl}`, location: where(e),
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function buildIcs(e: EventItem, pageUrl: string) {
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Folkestone Rotary//Website//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${e.id}@folkestonerotary`, `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.starts_at)}`, `DTEND:${stamp(endOf(e))}`,
    `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.short_description + "\n" + pageUrl)}`, `LOCATION:${esc(where(e))}`, `URL:${pageUrl}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export const mapsUrl = (e: Pick<EventItem, "venue_name" | "address" | "postcode" | "lat" | "lng">) =>
  e.lat != null && e.lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.venue_name, e.address, e.postcode].filter(Boolean).join(", "))}`;
