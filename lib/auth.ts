import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { canAccessAdmin, canManage, isRole, type Role } from "./permissions";

export interface Session { userId: string; email: string; fullName: string; role: Role; active: boolean }

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = await createSessionClient();
  const { data: { user } } = await sb.auth.getUser(); // getUser() verifies the JWT with Supabase
  if (!user) return null;
  const { data: p } = await sb.from("profiles").select("full_name, role, is_active").eq("id", user.id).maybeSingle();
  if (!p) return null;
  return { userId: user.id, email: user.email ?? "", fullName: p.full_name ?? "", role: isRole(p.role) ? p.role : "member", active: Boolean(p.is_active) };
}

/** Any active member. Redirects to login otherwise. */
export async function requireMember(next = "/members"): Promise<Session> {
  const s = await getSession();
  if (!s) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!s.active) redirect("/login?error=pending");
  return s;
}

/** Staff with access to a specific admin resource (or any admin area when `resource` is omitted). */
export async function requireStaff(resource?: string): Promise<Session> {
  const s = await requireMember("/admin");
  const ok = resource ? canManage(s.role, resource) : canAccessAdmin(s.role);
  if (!ok) redirect("/admin?denied=1");
  return s;
}
