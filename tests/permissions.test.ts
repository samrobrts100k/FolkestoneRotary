import { describe, expect, it } from "vitest";
import { canAccessAdmin, canManage, canViewCommitteeDocs, resourceRoles } from "@/lib/permissions";
import { buildRow } from "@/lib/admin/build-row";
import { getResource } from "@/lib/admin/resources";

describe("admin permissions", () => {
  it("lets admins manage everything", () => Object.keys(resourceRoles).forEach((r) => expect(canManage("admin", r), r).toBe(true)));
  it("limits editors by role", () => {
    expect(canManage("events_manager", "events")).toBe(true);
    expect(canManage("events_manager", "news")).toBe(false);
    expect(canManage("news_editor", "news")).toBe(true);
    expect(canManage("news_editor", "funding_applications")).toBe(false);
    expect(canManage("funding_reviewer", "funding_applications")).toBe(true);
    expect(canManage("funding_reviewer", "profiles")).toBe(false);
    expect(canManage("editor", "profiles")).toBe(false);
  });
  it("gives plain members and anonymous users no admin access", () => {
    expect(canAccessAdmin("member")).toBe(false); expect(canAccessAdmin(null)).toBe(false); expect(canAccessAdmin("editor")).toBe(true);
    expect(canManage("member", "events")).toBe(false); expect(canManage(undefined, "events")).toBe(false);
  });
  it("restricts committee documents", () => { expect(canViewCommitteeDocs("member")).toBe(false); expect(canViewCommitteeDocs("admin")).toBe(true); });
});

describe("CMS record building", () => {
  const news = getResource("news")!;
  const fd = (o: Record<string, string>) => ({ get: (k: string) => o[k] });
  const base = { title: "Big News", category: "community", published_at: "2026-05-01T10:00", summary: "Hi", status: "published" };
  it("creates a slug and a clean row", () => {
    const r = buildRow(news, fd({ ...base, tags: "a, b ,," }));
    expect(r.ok && r.row.slug).toBe("big-news"); expect(r.ok && r.row.tags).toEqual(["a", "b"]); expect(r.ok && r.row.publish_at).toBeNull();
  });
  it("requires required fields and a publish time for scheduled items", () => {
    expect(buildRow(news, fd({ ...base, title: "" })).ok).toBe(false);
    expect(buildRow(news, fd({ ...base, status: "scheduled" })).ok).toBe(false);
    expect(buildRow(news, fd({ ...base, status: "scheduled", publish_at: "2030-01-01T09:00" })).ok).toBe(true);
    expect(buildRow(news, fd({ ...base, status: "bogus" })).ok).toBe(false);
  });
  it("rejects invalid JSON and non-http links", () => {
    const ev = getResource("events")!;
    const e = { title: "E", category: "social", starts_at: "2030-01-01T10:00", short_description: "s", venue_name: "v", status: "draft" };
    expect(buildRow(ev, fd({ ...e, faq: "{oops" })).ok).toBe(false);
    expect(buildRow(ev, fd({ ...e, book_url: "javascript:alert(1)" })).ok).toBe(false);
    expect(buildRow(ev, fd(e)).ok).toBe(true);
  });
});
