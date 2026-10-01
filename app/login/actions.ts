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
  if (error) {
    if (error.code === "email_not_confirmed") return { error: "Your email address hasn't been confirmed yet. Ask an administrator to confirm your account." };
    if (error.code === "invalid_credentials") return { error: "Incorrect email or password." }; // deliberately vague
    console.error("[login] unexpected auth error", error.code, error.message);
    return { error: "Sign-in isn't working right now. The site may not be connected to Supabase correctly." };
  }
  const next = String(fd.get("next") ?? "/members");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/members"); // no open redirects
}

export async function signOut() {
  if (isSupabaseConfigured()) await (await createSessionClient()).auth.signOut();
  redirect("/");
}
