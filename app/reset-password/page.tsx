import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero, Section } from "@/components/sections";
import { ResetForm } from "@/components/password-forms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await getSession())) redirect("/forgot-password?error=expired");
  return (
    <>
      <PageHero title="Choose a new password" />
      <Section><div className="mx-auto max-w-md rounded-card border border-slate-200 p-6 shadow-soft sm:p-8"><ResetForm /></div></Section>
    </>
  );
}
