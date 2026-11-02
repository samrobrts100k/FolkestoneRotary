import { describe, expect, it } from "vitest";
import { isChristmasSeason } from "@/lib/site";

describe("Christmas menu item", () => {
  it("shows through November and December, UK time", () => {
    expect(isChristmasSeason(new Date("2026-10-31T23:30:00Z"))).toBe(false); // 31 Oct, 23:30 UK
    expect(isChristmasSeason(new Date("2026-11-01T00:00:00Z"))).toBe(true);
    expect(isChristmasSeason(new Date("2026-12-31T23:59:00Z"))).toBe(true);
  });
  it("is gone on 1 January", () => {
    expect(isChristmasSeason(new Date("2027-01-01T00:00:00Z"))).toBe(false);
    expect(isChristmasSeason(new Date("2027-06-15T12:00:00Z"))).toBe(false);
  });
});
