import { describe, expect, it } from "vitest";
import { PAGE_TEXT, fill, isPageKey, mergeText, okLink, readImage, readPanels, readPhotos, textFields, toLines, type PageKey } from "@/lib/page-text";

describe("page text", () => {
  const pages = Object.keys(PAGE_TEXT) as PageKey[];

  it("every field has a label and original wording, and no key repeats within a page", () => {
    for (const p of pages) {
      const keys = textFields(p).map(([k]) => k);
      expect(new Set(keys).size, p).toBe(keys.length);
      for (const [k, f] of textFields(p)) {
        expect(f.label.trim(), `${p}.${k}`).not.toBe("");
        if (!f.kind || f.kind === "switch") expect(f.def.trim(), `${p}.${k}`).not.toBe("");
      }
    }
  });

  it("uses saved wording, and the original when a box is blank or missing", () => {
    const t = mergeText("home", { heroTitle: "  Hello Folkestone ", heroLead: "   ", unknown: "ignored" });
    expect(t.heroTitle).toBe("Hello Folkestone");
    expect(t.heroLead).toBe(PAGE_TEXT.home.groups[0].fields.heroLead.def);
    expect("unknown" in t).toBe(false);
    expect(mergeText("home", null).heroTitle).toBe("Making a difference in Folkestone");
  });

  it("fills {tokens} it knows and leaves others alone", () => {
    expect(fill("{meeting}. At {venue}. {other}", { meeting: "Mondays", venue: "The Burlington" })).toBe("Mondays. At The Burlington. {other}");
  });

  it("splits one-per-line fields and drops blank lines", () => {
    expect(toLines("a\n\n  b \r\nc\n")).toEqual(["a", "b", "c"]);
  });

  it("reads photo lists safely", () => {
    const ok = JSON.stringify([{ url: "https://x.supabase.co/a.jpg", alt: " Golf day " }, { url: "/local.jpg" }]);
    expect(readPhotos(ok)).toEqual([{ url: "https://x.supabase.co/a.jpg", alt: "Golf day" }, { url: "/local.jpg", alt: "" }]);
    expect(readPhotos(JSON.stringify([{ url: "javascript:alert(1)" }, { url: "http://insecure/a.jpg" }, { alt: "no url" }, null]))).toEqual([]);
    expect(readPhotos("not json")).toEqual([]);
    expect(readPhotos("")).toEqual([]);
    expect(readImage("https://x.supabase.co/a.jpg")).toBe("https://x.supabase.co/a.jpg");
    expect(readImage('https://x/a.jpg" onerror="x')).toBe("");
  });

  it("carries an earlier single home background photo into the slideshow", () => {
    expect(readPhotos(mergeText("home", { heroPhoto: "https://x.supabase.co/old.jpg" }).heroPhotos)).toEqual([{ url: "https://x.supabase.co/old.jpg", alt: "" }]);
    const both = JSON.stringify([{ url: "https://x.supabase.co/new.jpg", alt: "" }]);
    expect(mergeText("home", { heroPhoto: "https://x.supabase.co/old.jpg", heroPhotos: both }).heroPhotos).toBe(both);
  });

  it("every page can take extra panels", () => {
    // "forms" holds form wording for every page, so it isn't a page of its own.
    for (const p of pages.filter((x) => x !== "forms")) expect(textFields(p).some(([k, f]) => k === "panels" && f.kind === "panels"), p).toBe(true);
  });

  it("reads extra panels safely", () => {
    const raw = JSON.stringify([
      { title: " Golf Day ", text: "Tee off", btn: "Book", href: "/events/golf", btn2: "Ask", href2: "mailto:info@example.org", where: "top", tone: "blue" },
      { title: "Bad links", btn: "Click", href: "javascript:alert(1)", btn2: "Other", href2: "//evil.example" },
      { title: "", text: "no heading is dropped" },
      { title: "Odd values", where: "sideways", tone: "pink" },
    ]);
    const [a, b, c] = readPanels(raw);
    expect(a).toEqual({ title: "Golf Day", text: "Tee off", btn: "Book", href: "/events/golf", btn2: "Ask", href2: "mailto:info@example.org", where: "top", tone: "blue" });
    expect([b.btn, b.href, b.btn2, b.href2]).toEqual(["", "", "", ""]);
    expect([c.title, c.where, c.tone]).toEqual(["Odd values", "bottom", "gold"]);
    expect(readPanels(raw)).toHaveLength(3);
    expect(readPanels("nope")).toEqual([]);
  });

  it("accepts only safe button links", () => {
    for (const ok of ["/join", "/events?x=1", "https://rotary.org", "mailto:a@b.org", "tel:01303000000"]) expect(okLink(ok), ok).toBe(true);
    for (const bad of ["javascript:alert(1)", "//evil.example", "http://insecure", "join", "", 'https://x" onmouseover="y']) expect(okLink(bad), bad).toBe(false);
  });

  it("built-in panels show unless switched off", () => {
    expect(mergeText("home", null).ctaShow).toBe("show");
    expect(mergeText("home", { ctaShow: "hide" }).ctaShow).toBe("hide");
  });

  it("has wording for every contact subject and three funding choices", () => {
    const t = mergeText("forms", null);
    expect(toLines(t.f_steps)).toHaveLength(3);
    expect(toLines(t.f_types)).toHaveLength(4);
    expect(toLines(t.f_when)).toHaveLength(3);
    expect(fill(t.f_doneText, { amount: "£500", project: "Lunch club", email: "a@b.org" })).toBe("You asked for £500 for Lunch club. We’ve emailed a confirmation to a@b.org.");
  });

  it("only accepts known pages", () => {
    expect(isPageKey("join")).toBe(true);
    expect(isPageKey("toString")).toBe(false);
    expect(isPageKey("admin")).toBe(false);
  });
});
