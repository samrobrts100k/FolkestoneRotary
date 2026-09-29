import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { footerLegal, nav } from "@/lib/site";

const root = path.resolve(__dirname, "..");
const routeExists = (href: string) => fs.existsSync(path.join(root, "app", href === "/" ? "" : href.replace(/^\//, ""), "page.tsx"));

describe("navigation", () => {
  it("has every required main link in order", () => {
    expect(nav.map((n) => n.label)).toEqual(["Home", "About Us", "Our Impact", "Events", "News", "Join Rotary", "Apply for Funding", "Contact"]);
  });
  it("points every nav and footer link at a real page", () => {
    for (const l of [...nav, ...footerLegal, { href: "/donate" }, { href: "/sponsors" }, { href: "/login" }]) expect(routeExists(l.href), l.href).toBe(true);
  });
  it("has no placeholder href=\"#\" links anywhere in the source", () => {
    const hits: string[] = [];
    const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const f = path.join(d, e.name);
      if (e.isDirectory()) return walk(f);
      if (/\.tsx?$/.test(e.name) && /href=["']#["']/.test(fs.readFileSync(f, "utf8"))) hits.push(f);
    });
    ["app", "components"].forEach((d) => walk(path.join(root, d)));
    expect(hits).toEqual([]);
  });
});
