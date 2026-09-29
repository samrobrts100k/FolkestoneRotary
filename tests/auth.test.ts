import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, middleware } from "@/middleware";

describe("route protection", () => {
  it("guards /members and /admin", () => expect(config.matcher).toEqual(["/members/:path*", "/admin/:path*"]));
  it("redirects anonymous visitors to login with a return path", async () => {
    for (const p of ["/admin", "/admin/events", "/members/directory"]) {
      const res = await middleware(new NextRequest(`http://localhost${p}`));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
      expect(res.headers.get("location")).toContain(encodeURIComponent(p));
    }
  });
});
