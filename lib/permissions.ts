export const ROLES = ["admin", "editor", "events_manager", "news_editor", "funding_reviewer", "member"] as const;
export type Role = (typeof ROLES)[number];
export const roleLabels: Record<Role, string> = {
  admin: "Admin", editor: "Editor", events_manager: "Events Manager", news_editor: "News Editor", funding_reviewer: "Funding Reviewer", member: "Member",
};

/** Which roles may manage each admin resource. Mirrors the RLS policies in supabase/migrations. */
export const resourceRoles: Record<string, Role[]> = {
  events: ["admin", "editor", "events_manager"],
  news: ["admin", "editor", "news_editor"],
  impact_stories: ["admin", "editor"],
  stats: ["admin", "editor"],
  sponsors: ["admin", "editor"],
  content_items: ["admin", "editor"],
  pages: ["admin", "editor"],
  galleries: ["admin", "editor"],
  media: ["admin", "editor", "events_manager", "news_editor"],
  contact_enquiries: ["admin", "editor"],
  membership_enquiries: ["admin", "editor"],
  newsletter_subscribers: ["admin", "editor"],
  member_documents: ["admin", "editor"],
  meetings: ["admin", "editor"],
  funding_applications: ["admin", "funding_reviewer"],
  profiles: ["admin"],
};

export const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as readonly string[]).includes(v);
export const canManage = (role: Role | null | undefined, resource: string) => Boolean(role && resourceRoles[resource]?.includes(role));
/** Anyone above plain "member" gets into /admin (and sees only what their role allows). */
export const canAccessAdmin = (role: Role | null | undefined) => Boolean(role && role !== "member");
export const canViewCommitteeDocs = (role: Role | null | undefined) => role === "admin" || role === "editor";
