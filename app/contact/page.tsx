import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "@/components/icons";
import { PageHero, Section } from "@/components/sections";
import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ title: "Contact Folkestone Rotary", description: "Get in touch with Folkestone Rotary about membership, funding, events, sponsorship or media.", path: "/contact" });

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const q = encodeURIComponent(`${site.meeting.venue} ${site.meeting.address} ${site.meeting.postcode}`);
  return (
    <>
      <PageHero title="Contact Us" intro="Questions about membership, funding, events or sponsorship? We'd love to hear from you." crumbs={[{ name: "Contact", path: "/contact" }]} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div><h2 className="mb-5 text-2xl">Send us a message</h2><ContactForm defaultSubject={subject} /></div>
          <div className="space-y-6">
            <ul className="space-y-4">
              <li className="flex gap-3"><Mail aria-hidden className="mt-1 h-5 w-5 text-rotary" /><a href={`mailto:${site.email}`} className="font-semibold hover:underline">{site.email}</a></li>
              <li className="flex gap-3"><Phone aria-hidden className="mt-1 h-5 w-5 text-rotary" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold hover:underline">{site.phone}</a></li>
              <li className="flex gap-3"><Clock aria-hidden className="mt-1 h-5 w-5 text-rotary" /><span><strong>We meet:</strong> {site.meeting.when}</span></li>
              <li className="flex gap-3"><MapPin aria-hidden className="mt-1 h-5 w-5 text-rotary" /><span>{site.meeting.venue}<br />{site.meeting.address} {site.meeting.postcode}</span></li>
            </ul>
            <iframe title="Map of our meeting venue" loading="lazy" className="h-64 w-full rounded-card border-0" src={`https://maps.google.com/maps?q=${q}&output=embed`} />
            <ul className="flex gap-2" aria-label="Social media">
              {[["Facebook", site.social.facebook, Facebook], ["Instagram", site.social.instagram, Instagram], ["LinkedIn", site.social.linkedin, Linkedin]].map(([l, h, I]) => { const Icon = I as typeof Mail; return <li key={l as string}><a href={h as string} target="_blank" rel="noopener noreferrer" aria-label={`${l} (opens in a new tab)`} className="flex h-11 w-11 items-center justify-center rounded-full bg-rotary-light text-rotary hover:bg-rotary hover:text-white"><Icon aria-hidden className="h-5 w-5" /></a></li>; })}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
