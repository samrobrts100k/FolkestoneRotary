"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

export async function signIn(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Member login isn't connected yet." };
  const parsed = schema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  const sb = await createSessionClient();
  const { error } = await sb.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Incorrect email or password." }; // deliberately vague
  const next = String(fd.get("next") ?? "/members");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/members"); // no open redirects
}

export async function signOut() {
  if (isSupabaseConfigured()) await (await createSessionClient()).auth.signOut();
  redirect("/");
}
