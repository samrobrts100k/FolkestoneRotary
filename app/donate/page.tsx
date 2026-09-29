import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { PageHero, Section } from "@/components/sections";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ title: "Donate – support Folkestone Rotary", description: "Donate to Folkestone Rotary and help fund local charities, young people and community projects.", path: "/donate" });

/** Donations are taken on an external donation site (set NEXT_PUBLIC_DONATE_URL). No payment data touches this website. */
export default function DonatePage() {
  return (
    <>
      <PageHero title="Donate" intro="Your gift stays local and helps people across Folkestone." crumbs={[{ name: "Donate", path: "/donate" }]} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card><CardBody>
            <HeartHandshake aria-hidden className="h-8 w-8 text-rotary" />
            <h2 className="mt-3 text-2xl">Give online</h2>
            <p className="mt-2 text-slate-700">Press the button and you&apos;ll be taken to our secure donation page, where you can give once or set up regular giving and claim Gift Aid.</p>
            {site.donateUrl ? (
              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href={site.donateUrl} variant="gold" size="lg">Donate now</ButtonLink>
                {site.donateMonthlyUrl && <ButtonLink href={site.donateMonthlyUrl} variant="outline" size="lg">Give monthly</ButtonLink>}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-gold-light p-4 text-sm">Online donations are being set up. To donate now, please <a href="/contact?subject=Other" className="font-semibold text-rotary underline">contact us</a>.</div>
            )}
          </CardBody></Card>
          <Card><CardBody>
            <ShieldCheck aria-hidden className="h-8 w-8 text-rotary" />
            <h2 className="mt-3 text-2xl">Good to know</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              <li>Donations are processed by a trusted external provider — we never see your card details.</li>
              <li>UK taxpayers can add 25% with Gift Aid at no cost to you.</li>
              <li>Prefer to sponsor an event or business? <a href="/sponsors" className="font-semibold text-rotary underline">See sponsorship</a>.</li>
            </ul>
          </CardBody></Card>
        </div>
      </Section>
    </>
  );
}
