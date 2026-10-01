import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero, Section } from "@/components/sections";
import { LoginForm } from "./login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Member Login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = "/members", error } = await searchParams;
  const s = await getSession();
  if (s?.active) redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/members");
  return (
    <>
      <PageHero title="Member Login" intro="For Folkestone Rotary members and website editors." />
      <Section>
        <div className="mx-auto max-w-md rounded-card border border-slate-200 p-6 shadow-soft sm:p-8">
          {error === "pending" && <p role="alert" className="mb-5 rounded-xl bg-gold-light p-3 text-sm">Your account is waiting for approval by a club administrator.</p>}
          <LoginForm next={next} />
          <p className="mt-5 text-sm"><a href="/forgot-password" className="font-semibold text-rotary underline">Forgot your password?</a></p>
          <p className="mt-2 text-sm text-slate-blue">Need an account? Ask a club administrator.</p>
        </div>
      </Section>
    </>
  );
}
