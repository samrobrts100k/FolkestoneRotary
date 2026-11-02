import { describe, expect, it } from "vitest";
import { PAGE_TEXT, fill, isPageKey, mergeText, readImage, readPhotos, textFields, toLines, type PageKey } from "@/lib/page-text";

describe("page text", () => {
  const pages = Object.keys(PAGE_TEXT) as PageKey[];

  it("every field has a label and original wording, and no key repeats within a page", () => {
    for (const p of pages) {
      const keys = textFields(p).map(([k]) => k);
      expect(new Set(keys).size, p).toBe(keys.length);
      for (const [k, f] of textFields(p)) {
        expect(f.label.trim(), `${p}.${k}`).not.toBe("");
        if (!f.kind) expect(f.def.trim(), `${p}.${k}`).not.toBe("");
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

  it("only accepts known pages", () => {
    expect(isPageKey("join")).toBe(true);
    expect(isPageKey("toString")).toBe(false);
    expect(isPageKey("admin")).toBe(false);
  });
});
