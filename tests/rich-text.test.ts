import { describe, expect, it } from "vitest";
import { parseInline, parseRich, plainText, richImages } from "@/lib/rich-text";

describe("article formatting", () => {
  it("keeps older plain articles as paragraphs", () => {
    const b = parseRich("First paragraph.\n\nSecond one,\nwith a line break.");
    expect(b.map((x) => x.t)).toEqual(["p", "p"]);
    expect(plainText("First paragraph.\n\nSecond one,\nwith a line break.")).toBe("First paragraph.\n\nSecond one, with a line break.");
  });

  it("reads headings, lists, quotes and lines", () => {
    const b = parseRich("## Big\n### Small\n- one\n- two\n\n1. first\n2. second\n> quoted\n> more\n---\nend");
    expect(b.map((x) => x.t)).toEqual(["h2", "h3", "ul", "ol", "quote", "hr", "p"]);
    expect(b[2].t === "ul" && b[2].items).toHaveLength(2);
  });

  it("reads bold, italic and safe links only", () => {
    expect(parseInline("a **b** *c* [d](/join)")).toEqual([
      { t: "text", v: "a " }, { t: "b", c: [{ t: "text", v: "b" }] }, { t: "text", v: " " },
      { t: "i", c: [{ t: "text", v: "c" }] }, { t: "text", v: " " }, { t: "a", href: "/join", c: [{ t: "text", v: "d" }] },
    ]);
    expect(parseInline("[x](javascript:alert(1))").some((n) => n.t === "a")).toBe(false);
    expect(parseInline("[x](//evil.example)").some((n) => n.t === "a")).toBe(false);
    expect(parseInline("2 * 3 * 4")).toEqual([{ t: "text", v: "2 * 3 * 4" }]);
  });

  it("groups photos on neighbouring lines into a gallery and drops unsafe ones", () => {
    const b = parseRich("Intro\n\n![Cheque](https://x.supabase.co/a.jpg)\n![Team](/b.jpg)\n![Bad](javascript:x)\n\n![Solo](https://x.supabase.co/c.jpg)");
    expect(b.map((x) => x.t)).toEqual(["p", "images", "images"]);
    expect(b[1].t === "images" && b[1].images).toEqual([{ url: "https://x.supabase.co/a.jpg", alt: "Cheque" }, { url: "/b.jpg", alt: "Team" }]);
    expect(richImages("![A](/a.jpg)\ntext\n![B](/b.jpg)")).toHaveLength(2);
    expect(plainText("![A](/a.jpg)\n\nWords here")).toBe("Words here");
  });

  it("never produces HTML from text", () => {
    const b = parseRich("<script>alert(1)</script> **<b>x</b>**");
    expect(JSON.stringify(b)).toContain("<script>"); // kept as text, which React escapes
    expect(b[0].t).toBe("p");
  });
});
