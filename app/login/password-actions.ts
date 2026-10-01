"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSession } from "@/lib/auth";

export interface PwState { ok?: boolean; error?: string }

/** Always reports success so the form can't be used to discover which emails have accounts. */
export async function requestReset(_: PwState, fd: FormData): Promise<PwState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email address." };
  if (!isSupabaseConfigured()) return { error: "Password reset isn't connected yet." };
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { error } = await (await createSessionClient()).auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
  if (error) console.error("[reset] failed", error.code, error.message);
  return { ok: true };
}

export async function setPassword(_: PwState, fd: FormData): Promise<PwState> {
  const pw = String(fd.get("password") ?? ""), again = String(fd.get("confirm") ?? "");
  if (pw.length < 10) return { error: "Use at least 10 characters." };
  if (pw !== again) return { error: "The two passwords don't match." };
  if (!(await getSession())) return { error: "This link has expired. Request a new reset email." };
  const { error } = await (await createSessionClient()).auth.updateUser({ password: pw });
  if (error) return { error: error.message };
  redirect("/members");
}
