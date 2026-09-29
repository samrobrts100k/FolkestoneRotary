import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getContentItems, getGalleryImages, getStats, getStories } from "@/lib/content";
import { PageHero, Section, SectionHeading, SampleNote } from "@/components/sections";
import { StatsBand } from "@/components/home/stats";
import { StoryCard } from "@/components/cards";
import { Photo } from "@/components/ui/photo";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";
import { gbp } from "@/lib/utils";
import { donateHref } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Our Impact – community funding in Folkestone", description: "See how Folkestone Rotary supports local charities, schools, families and young people.", path: "/impact" });

export default async function ImpactPage() {
  const [stats, stories, testimonials, reports, gallery] = await Promise.all([getStats(), getStories(), getContentItems("testimonial"), getContentItems("annual_report"), getGalleryImages()]);
  const total = stories.reduce((s, x) => s + (x.amount_awarded ?? 0), 0);
  return (
    <>
      <PageHero title="Our Impact" intro="Every pound and every hour goes back into our community." crumbs={[{ name: "Our Impact", path: "/impact" }]} />
      <StatsBand stats={stats} />
      <Section id="projects">
        <SectionHeading eyebrow="Community projects" title="Where the money goes" intro={total ? `${gbp(total)} awarded across the projects below.` : undefined} />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{stories.map((s) => <li key={s.id} id={s.slug} className="scroll-mt-24"><StoryCard story={s} /></li>)}</ul>
        {stories.some((s) => s.is_sample) && <SampleNote />}
      </Section>
      <Section tone="grey" id="testimonials">
        <SectionHeading eyebrow="Testimonials" title="In their words" />
        <ul className="grid gap-5 md:grid-cols-2">{testimonials.map((t) => <li key={t.id}><Card><CardBody><blockquote className="text-lg">{t.body}</blockquote><p className="mt-3 font-semibold text-rotary">{t.title}</p></CardBody></Card></li>)}</ul>
      </Section>
      <Section id="volunteering">
        <SectionHeading eyebrow="Volunteer activity" title="Time given freely" intro="Members give their time at collections, races, school events and more. Want to help?" />
        <ButtonLink href="/join" size="lg">Volunteer with us</ButtonLink>
      </Section>
      <Section tone="grey" id="gallery">
        <SectionHeading eyebrow="Photo gallery" title="Rotary in action" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(gallery.length ? gallery : Array.from({ length: 8 }, () => ({ url: "", alt: "Photo placeholder", caption: "" }))).map((g, i) => <li key={i}><Photo src={g.url || null} alt={g.alt || "Folkestone Rotary"} ratio="aspect-square" className="rounded-xl" sizes="(min-width:768px) 25vw, 50vw" /></li>)}
        </ul>
      </Section>
      <Section id="reports">
        <SectionHeading eyebrow="Annual reports" title="Accountability and transparency" />
        <ul className="space-y-3">{reports.map((r) => <li key={r.id}>{r.url ? <a href={r.url} className="inline-flex items-center gap-2 font-semibold text-rotary underline"><Download aria-hidden className="h-4 w-4" />{r.title} (PDF)</a> : <span className="text-slate-700">{r.title} — PDF to be uploaded</span>}</li>)}</ul>
      </Section>
      <Section tone="blue"><div className="text-center"><h2 className="text-3xl text-white">Help us do even more</h2><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href={donateHref} variant="gold" size="lg">Donate</ButtonLink><ButtonLink href="/funding" variant="outline-light" size="lg">Apply for Funding</ButtonLink></div></div></Section>
    </>
  );
}
