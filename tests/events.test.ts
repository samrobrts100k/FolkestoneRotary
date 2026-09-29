import { describe, expect, it } from "vitest";
import { events } from "@/lib/seed";
import { isUpcoming, isVisibleAt } from "@/lib/visibility";
import { buildIcs, googleCalendarUrl } from "@/lib/ics";

describe("event listing", () => {
  it("separates upcoming from past events", () => {
    const up = events.filter((e) => isUpcoming(e)), past = events.filter((e) => !isUpcoming(e));
    expect(up.length).toBeGreaterThanOrEqual(6);
    expect(past.map((e) => e.slug)).toContain("summer-fete-2025");
    expect(up.map((e) => e.slug)).toContain("folkestone-half-marathon");
  });
  it("only shows published, or scheduled-and-due, content", () => {
    const now = new Date("2026-06-01T12:00:00Z");
    expect(isVisibleAt({ status: "published" }, now)).toBe(true);
    expect(isVisibleAt({ status: "draft" }, now)).toBe(false);
    expect(isVisibleAt({ status: "archived" }, now)).toBe(false);
    expect(isVisibleAt({ status: "scheduled", publish_at: "2026-07-01T00:00:00Z" }, now)).toBe(false);
    expect(isVisibleAt({ status: "scheduled", publish_at: "2026-05-01T00:00:00Z" }, now)).toBe(true);
  });
  it("builds calendar links and a valid ICS file", () => {
    const e = events[0];
    const ics = buildIcs(e, "https://x.test/events/a");
    expect(ics).toContain("BEGIN:VEVENT"); expect(ics).toContain(`SUMMARY:${e.title}`); expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(googleCalendarUrl(e, "https://x.test")).toContain("calendar.google.com");
  });
});
