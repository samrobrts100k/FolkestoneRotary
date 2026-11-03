/**
 * Event dates and times, always in UK time (Europe/London), whatever the server's clock is set to.
 *
 * An event can be saved with a date only. That is stored as 00:00 UK time on the day and shown as "All day"
 * (also right for staggered starts). An end with a date only is stored as 23:59 that day.
 */
import { formatDate } from "./utils";

const TZ = "Europe/London";

/** The UK wall-clock date and time of an instant: { date: "2026-12-07", time: "08:00" }. */
export function londonParts(iso: string | Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(iso)).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

/** The instant for a UK date and time ("2026-07-04", "10:00"), correct across BST/GMT. Null if the input isn't a real date/time. */
export function londonToISO(date: string, time = "00:00"): string | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date), t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;
  const [y, m, day, h, mi] = [+d[1], +d[2], +d[3], +t[1], +t[2]];
  if (m < 1 || m > 12 || day < 1 || day > 31 || h > 23 || mi > 59) return null;
  const want = Date.UTC(y, m - 1, day, h, mi);
  const offsetAt = (ms: number) => { const p = londonParts(new Date(ms)); return Date.parse(`${p.date}T${p.time}:00Z`) - ms; };
  let ms = want - offsetAt(want);
  ms = want - offsetAt(ms); // second pass settles the clock-change days
  const back = londonParts(new Date(ms));
  return back.date === date ? new Date(ms).toISOString() : null; // rejects 31 February and the like
}

/** "2026-12-07T08:00" from a datetime-local box, read as UK time. */
export const localInputToISO = (v: string) => { const [date, time] = v.split("T"); return londonToISO(date, (time ?? "").slice(0, 5)); };
/** The other way, for filling a datetime-local box. */
export const isoToLocalInput = (iso?: string | null) => { if (!iso) return ""; const p = londonParts(iso); return `${p.date}T${p.time}`; };

/** True when the event was saved with a date but no start time. */
export const isAllDay = (iso: string) => londonParts(iso).time === "00:00";
const isDayEnd = (iso: string) => londonParts(iso).time === "23:59";

/** When the event is over: its end, or the end of its start day for all-day events, or its start. */
export function finishesAt(e: { starts_at: string; ends_at?: string | null }) {
  if (e.ends_at) return new Date(e.ends_at).getTime();
  if (isAllDay(e.starts_at)) return Date.parse(londonToISO(londonParts(e.starts_at).date, "23:59") ?? e.starts_at);
  return new Date(e.starts_at).getTime();
}

/** The time line for an event: "08:00 – 17:00", "From 10:00", "All day", "All day, until 9 Dec". */
export function eventTime(e: { starts_at: string; ends_at?: string | null }): string {
  const s = londonParts(e.starts_at), en = e.ends_at ? londonParts(e.ends_at) : null;
  const laterDay = en && en.date !== s.date ? formatDate(e.ends_at!, { day: "numeric", month: "short" }) : "";
  if (isAllDay(e.starts_at)) return laterDay ? `All day, until ${laterDay}` : "All day";
  if (!en) return s.time;
  if (laterDay) return isDayEnd(e.ends_at!) ? `From ${s.time}, until ${laterDay}` : `${s.time} – ${laterDay}, ${en.time}`;
  return isDayEnd(e.ends_at!) ? `From ${s.time}` : `${s.time} – ${en.time}`;
}
