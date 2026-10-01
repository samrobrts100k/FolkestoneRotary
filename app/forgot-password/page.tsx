import type { Metadata } from "next";
import { PageHero, Section } from "@/components/sections";
import { ForgotForm } from "@/components/password-forms";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <PageHero title="Forgot your password?" intro="Enter your email and we'll send you a reset link." />
      <Section><div className="mx-auto max-w-md rounded-card border border-slate-200 p-6 shadow-soft sm:p-8">
        {error === "expired" && <p role="alert" className="mb-5 rounded-xl bg-gold-light p-3 text-sm">That link has expired or was already used. Request a new one.</p>}
        <ForgotForm />
      </div></Section>
    </>
  );
}
