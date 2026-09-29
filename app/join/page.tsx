import type { Metadata } from "next";
import { getContentItems } from "@/lib/content";
import { PageHero, Section, SectionHeading, Faq } from "@/components/sections";
import { MembershipForm } from "@/components/forms/membership-form";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Join Rotary – volunteer in Folkestone", description: "Join Folkestone Rotary: meet great people, volunteer locally and make a difference. Visit us as a guest.", path: "/join" });

const blocks = [
  ["Who can join", "Anyone over 18 who wants to give back to Folkestone. No experience needed."],
  ["What members do", "Run fundraising events, support local charities, volunteer at community projects and enjoy a social life."],
  ["Why join", "Meet new people, develop skills, and see the difference you make close to home."],
  ["Time commitment", "Attend meetings as often as you can and help at events when you're free. Placeholder — confirm expectations."],
  ["Meeting format", `${site.meeting.when} at ${site.meeting.venue}. Informal, friendly, with a speaker or club business.`],
  ["Costs", "Membership fees and meal costs to be confirmed. Placeholder — add the current subscription."],
];

export default async function JoinPage() {
  const faqs = (await getContentItems("faq", "join")).map((f) => ({ q: f.title, a: f.body ?? "" }));
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <PageHero title="Join Rotary" intro="Make a difference. Meet great people." crumbs={[{ name: "Join Rotary", path: "/join" }]}>
        <ButtonLink href="#enquiry" variant="gold" size="lg">Join Now</ButtonLink>
        <ButtonLink href="#guest" variant="outline-light" size="lg">Visit as a Guest</ButtonLink>
        <ButtonLink href="/contact?subject=Membership" variant="outline-light" size="lg">Ask a Question</ButtonLink>
      </PageHero>
      <Section>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{blocks.map(([t, b]) => <li key={t}><Card className="h-full"><CardBody><h2 className="text-xl">{t}</h2><p className="mt-2 text-slate-700">{b}</p></CardBody></Card></li>)}</ul>
      </Section>
      <Section tone="grey" id="guest">
        <SectionHeading eyebrow="Visit us as a guest" title="Come along — no obligation" intro={`Join us ${site.meeting.when.toLowerCase()} at ${site.meeting.venue}. Send an enquiry below and we'll arrange your visit.`} />
      </Section>
      <Section id="enquiry">
        <div className="mx-auto max-w-3xl"><SectionHeading title="Membership enquiry" intro="Tell us a little about yourself and someone will be in touch." /><MembershipForm /></div>
      </Section>
      <Section tone="grey"><SectionHeading title="Frequently asked questions" /><Faq items={faqs} /></Section>
    </>
  );
}
