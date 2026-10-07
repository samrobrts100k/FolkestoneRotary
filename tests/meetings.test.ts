import { describe, expect, it } from "vitest";
import { meetingEnd, nextMeetings } from "@/lib/meetings";

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

describe("lunch meetings (2nd and 4th Monday, 12:15 to 12:45)", () => {
  it("lists the 2nd and 4th Mondays in order", () => {
    // October 2026: Mondays are the 5th, 12th, 19th and 26th
    expect(nextMeetings(4, new Date(2026, 9, 1)).map(ymd)).toEqual(["2026-10-12", "2026-10-26", "2026-11-09", "2026-11-23"]);
  });
  it("skips a meeting that has finished and keeps one that is still on", () => {
    expect(ymd(nextMeetings(1, new Date(2026, 9, 12, 12, 40))[0])).toBe("2026-10-12");
    expect(ymd(nextMeetings(1, new Date(2026, 9, 12, 12, 50))[0])).toBe("2026-10-26");
  });
  it("always starts at 12:15 on a Monday and lasts 30 minutes", () => {
    const [d] = nextMeetings(1, new Date(2027, 0, 20));
    expect([d.getDay(), d.getHours(), d.getMinutes()]).toEqual([1, 12, 15]);
    expect(meetingEnd(d).getMinutes()).toBe(45);
  });
});
