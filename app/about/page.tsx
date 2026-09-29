import type { Metadata } from "next";
import { getContentItems } from "@/lib/content";
import { PageHero, Section, SectionHeading, SampleNote } from "@/components/sections";
import { Photo } from "@/components/ui/photo";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "About Folkestone Rotary", description: "Who we are, what Rotary is, our history, leadership and how we meet in Folkestone.", path: "/about" });

export default async function AboutPage() {
  const [timeline, leaders] = await Promise.all([getContentItems("timeline"), getContentItems("leader")]);
  return (
    <>
      <PageHero title="About Us" intro="A friendly group of local people who believe in giving back to Folkestone." crumbs={[{ name: "About Us", path: "/about" }]} />
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div id="who-we-are" className="prose-club">
            <SectionHeading eyebrow="Who we are" title="Folkestone's local Rotary club" />
            <p>Folkestone Rotary is a club of volunteers from all walks of life. We raise money, give our time and connect with local organisations to support people and projects across Folkestone.</p>
            <p>We&apos;re part of Rotary, one of the world&apos;s largest service organisations — but our focus is firmly local.</p>
          </div>
          <Photo src={null} alt="Folkestone Rotary members at a community event (photo to be added)" className="rounded-card" ratio="aspect-[4/3]" />
        </div>
      </Section>
      <Section tone="grey">
        <div className="grid gap-6 md:grid-cols-2">
          <Card id="what-rotary-is"><CardBody><h2 className="text-2xl">What Rotary is</h2><p className="mt-3 text-slate-700">Rotary is a global network of neighbours, friends, leaders and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.</p></CardBody></Card>
          <Card id="our-club"><CardBody><h2 className="text-2xl">Our club</h2><p className="mt-3 text-slate-700">Our members are business people, retirees, teachers, volunteers and more. We share ideas, run events, and make sure every pound raised goes to local causes.</p></CardBody></Card>
        </div>
      </Section>
      <Section id="history">
        <SectionHeading eyebrow="Our history" title="A long tradition of service" />
        <ol className="relative ml-3 space-y-8 border-l-2 border-gold pl-8">
          {timeline.map((t) => (<li key={t.id} className="relative"><span aria-hidden className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-rotary" /><h3 className="text-xl">{t.title}</h3><p className="mt-1 text-slate-700">{t.body}</p></li>))}
        </ol>
        {timeline.some((t) => t.is_sample) && <SampleNote />}
      </Section>
      <Section tone="grey" id="leadership">
        <SectionHeading eyebrow="Our leadership" title="Meet the team" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{leaders.map((l) => <li key={l.id}><Card><CardBody className="flex items-center gap-4"><Photo src={null} alt="" ratio="aspect-square" className="h-16 w-16 shrink-0 rounded-full" sizes="64px" /><div><h3 className="text-lg">{l.title}</h3><p className="text-slate-700">{l.body}</p></div></CardBody></Card></li>)}</ul>
      </Section>
      <Section id="how-we-meet">
        <div className="grid gap-8 lg:grid-cols-2">
          <div><SectionHeading eyebrow="How we meet" title="Come and join us" /><p className="text-lg text-slate-700"><strong>{site.meeting.when}</strong><br />{site.meeting.venue}, {site.meeting.address}</p><p className="mt-3 text-slate-700">Meetings are relaxed and social. Guests are always welcome.</p></div>
          <div id="rotary-international" className="rounded-card bg-rotary-light p-6"><h2 className="text-2xl">Rotary International</h2><p className="mt-3 text-slate-700">Over a million Rotarians worldwide work together on causes including peace, health, education and the environment. Locally, we bring that spirit to Folkestone.</p><p className="mt-3"><a className="font-semibold text-rotary underline" href="https://www.rotary.org" target="_blank" rel="noopener noreferrer">Visit rotary.org (opens in a new tab)</a></p></div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3"><ButtonLink href="/join" size="lg">Join Rotary</ButtonLink><ButtonLink href="/contact" variant="outline" size="lg">Contact Us</ButtonLink></div>
      </Section>
    </>
  );
}
