import { describe, expect, it } from "vitest";
import { eventTime, finishesAt, isAllDay, isoToLocalInput, londonParts, londonToISO } from "@/lib/event-time";
import { isUpcoming } from "@/lib/visibility";
import { buildRow } from "@/lib/admin/build-row";
import { getResource } from "@/lib/admin/resources";
import { buildIcs, googleCalendarUrl } from "@/lib/ics";
import type { EventItem } from "@/lib/types";

const fd = (o: Record<string, string>) => ({ get: (k: string) => o[k] ?? null });

describe("UK times", () => {
  it("reads a summer time as BST and a winter time as GMT, wherever the server is", () => {
    expect(londonToISO("2026-07-04", "10:00")).toBe("2026-07-04T09:00:00.000Z");
    expect(londonToISO("2026-12-07", "10:00")).toBe("2026-12-07T10:00:00.000Z");
    expect(londonToISO("2026-03-29", "00:00")).toBe("2026-03-29T00:00:00.000Z"); // clock-change day
    expect(londonToISO("2026-10-25", "12:00")).toBe("2026-10-25T12:00:00.000Z");
    expect(londonToISO("2026-02-31")).toBeNull();
    expect(londonToISO("not a date")).toBeNull();
  });
  it("round-trips through the form boxes", () => {
    expect(isoToLocalInput("2026-07-04T09:00:00.000Z")).toBe("2026-07-04T10:00");
    expect(londonParts("2026-07-04T23:30:00.000Z")).toEqual({ date: "2026-07-05", time: "00:30" });
  });
});

describe("event time line", () => {
  const at = (d: string, t?: string) => londonToISO(d, t)!;
  it("shows All day when there is no start time", () => {
    expect(isAllDay(at("2026-12-12"))).toBe(true);
    expect(eventTime({ starts_at: at("2026-12-12") })).toBe("All day");
    expect(eventTime({ starts_at: at("2026-12-12"), ends_at: at("2026-12-14", "23:59") })).toBe("All day, until 14 Dec");
  });
  it("shows times when given", () => {
    expect(eventTime({ starts_at: at("2026-07-04", "08:00"), ends_at: at("2026-07-04", "17:00") })).toBe("08:00 – 17:00");
    expect(eventTime({ starts_at: at("2026-07-04", "08:00") })).toBe("08:00");
    expect(eventTime({ starts_at: at("2026-07-04", "09:00"), ends_at: at("2026-07-04", "23:59") })).toBe("From 09:00");
    expect(eventTime({ starts_at: at("2026-07-04", "19:00"), ends_at: at("2026-07-05", "01:00") })).toBe("19:00 – 5 Jul, 01:00");
  });
  it("keeps an all-day event upcoming until the end of its day", () => {
    const e = { starts_at: at("2026-12-12") };
    expect(isUpcoming(e, Date.parse(at("2026-12-12", "15:00")))).toBe(true);
    expect(isUpcoming(e, Date.parse(at("2026-12-13", "00:01")))).toBe(false);
    expect(finishesAt({ starts_at: at("2026-12-12", "10:00") })).toBe(Date.parse(at("2026-12-12", "10:00")));
  });
});

describe("saving an event in the admin", () => {
  const ev = getResource("events")!;
  const base = { title: "Collections", category: "community", short_description: "x", venue_name: "Town", status: "published" };
  it("saves with a date and no time", () => {
    const r = buildRow(ev, fd({ ...base, starts_at__date: "2026-12-12" }));
    expect(r.ok && r.row.starts_at).toBe("2026-12-12T00:00:00.000Z");
    expect(r.ok && r.row.ends_at).toBeNull();
  });
  it("needs a date, but not a time", () => {
    const r = buildRow(ev, fd({ ...base, starts_at__time: "10:00" }));
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errors.starts_at).toBe("Date is required");
  });
  it("uses the start date for an end time on its own, and the end of the day for an end date on its own", () => {
    const a = buildRow(ev, fd({ ...base, starts_at__date: "2026-07-04", starts_at__time: "09:00", ends_at__time: "17:00" }));
    expect(a.ok && a.row.ends_at).toBe(londonToISO("2026-07-04", "17:00"));
    const b = buildRow(ev, fd({ ...base, starts_at__date: "2026-07-04", ends_at__date: "2026-07-06" }));
    expect(b.ok && b.row.ends_at).toBe(londonToISO("2026-07-06", "23:59"));
  });
  it("rejects an end before the start", () => {
    const r = buildRow(ev, fd({ ...base, starts_at__date: "2026-07-04", starts_at__time: "09:00", ends_at__date: "2026-07-03" }));
    expect(!r.ok && r.errors.ends_at).toBe("The end is before the start");
  });
});

describe("calendar links", () => {
  const e = { id: "1", slug: "c", title: "Collections", short_description: "s", venue_name: "Town", starts_at: londonToISO("2026-12-12")!, ends_at: null } as unknown as EventItem;
  it("adds all-day events to calendars as all-day", () => {
    expect(buildIcs(e, "https://x")).toContain("DTSTART;VALUE=DATE:20261212");
    expect(buildIcs(e, "https://x")).toContain("DTEND;VALUE=DATE:20261213");
    expect(decodeURIComponent(googleCalendarUrl(e, "https://x"))).toContain("dates=20261212/20261213");
  });
});
