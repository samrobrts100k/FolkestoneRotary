import type { Metadata } from "next";
import { getContentItems } from "@/lib/content";
import { PageHero, Section, SectionHeading, Faq } from "@/components/sections";
import { FundingForm } from "@/components/forms/funding-form";
import { Card, CardBody } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Apply for Funding – community funding Folkestone", description: "Local charities and community groups can apply for funding from Folkestone Rotary. Check the criteria and apply online.", path: "/funding" });

const info = [
  ["Who can apply", "Registered charities, schools, community groups and non-profits working to benefit people in the Folkestone area."],
  ["What we support", "Community projects, youth activities, equipment, events and services that make a clear local difference."],
  ["Funding criteria", "Local benefit, clear outcomes, good value, and a realistic budget. Placeholder — confirm the club's criteria and grant limits."],
  ["What you'll need", "Project details, budget, amount requested, expected outcomes and any quotes or supporting documents."],
  ["How decisions are made", "Our funding panel reviews each application and you will be told the outcome. Placeholder — confirm the review timetable."],
];

export default async function FundingPage() {
  const faqs = (await getContentItems("faq", "funding")).map((f) => ({ q: f.title, a: f.body ?? "" }));
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <PageHero title="Apply for Funding" intro="Help for local organisations doing great work in Folkestone." crumbs={[{ name: "Apply for Funding", path: "/funding" }]} />
      <Section><ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{info.map(([t, b]) => <li key={t}><Card className="h-full"><CardBody><h2 className="text-xl">{t}</h2><p className="mt-2 text-slate-700">{b}</p></CardBody></Card></li>)}</ul></Section>
      <Section tone="grey" id="apply"><div className="mx-auto max-w-3xl"><SectionHeading title="Funding application" intro="Fields marked * are required. You'll receive a confirmation email and a reference." /><FundingForm /></div></Section>
      {faqs.length > 0 && <Section><SectionHeading title="Questions about funding" /><Faq items={faqs} /></Section>}
    </>
  );
}
