import type { Metadata } from "next";
import { Facebook, Instagram, Linkedin } from "@/components/icons";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { ContactForm, CopyBtn, NextMeeting } from "@/components/dx/contact";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ title: "Contact Folkestone Rotary", description: "Get in touch with Folkestone Rotary about membership, funding, events, sponsorship or media.", path: "/contact" });

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const mapQuery = encodeURIComponent(`${site.meeting.venue} ${site.meeting.address} ${site.meeting.postcode}`);
  return (
    <DxRoot>
      <DxHero page="contact" crumb="Contact" title="Say hello" lead="Questions about membership, funding, events or sponsorship? A real person will reply."
        aside={<div className="glass"><small>Fastest ways to reach us</small>
          <div style={{ marginTop: 8 }}><span className="cp">{site.email} <CopyBtn text={site.email} /></span></div>
          <div><span className="cp">{site.phone} <CopyBtn text={site.phone} /></span></div></div>} />
      <section className="sec"><div className="wrap cgrid">
        <div><ContactForm defaultSubject={subject} /></div>
        <aside>
          <div className="next"><small style={{ color: "var(--mute)" }}>Next meeting</small><b className="t" style={{ font: "700 24px var(--serif)", display: "block", margin: "2px 0 12px", color: "var(--navy)" }}>{site.meeting.when}</b><NextMeeting /></div>
          <div className="mapc">
            <svg viewBox="0 0 420 240" aria-hidden="true"><rect width="420" height="240" fill="#0d2b52" /><path d="M0 170Q70 140 130 160T250 130 340 150 420 120V240H0Z" fill="#005DAA" /><path d="M0 200Q80 175 150 190T290 165 420 180V240H0Z" fill="#0B1F3A" /><path d="M0 120Q60 100 110 110T200 85 300 95 420 70" fill="none" stroke="#4d93cc" strokeWidth="2" strokeDasharray="3 6" /><circle className="pin" cx="250" cy="118" r="10" fill="#F7A81B" /><circle cx="250" cy="118" r="8" fill="#F7A81B" stroke="#fff" strokeWidth="3" /></svg>
            <div className="in2"><b>{site.meeting.venue}</b><br />{site.meeting.address} {site.meeting.postcode}<br /><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" style={{ color: "#F7A81B", fontWeight: 700 }}>Open in Google Maps (opens in a new tab)</a></div>
          </div>
          <p style={{ marginTop: 18 }}><strong>Email</strong><br /><a href={`mailto:${site.email}`}>{site.email}</a> <CopyBtn text={site.email} /></p>
          <p><strong>Phone</strong><br /><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a> <CopyBtn text={site.phone} /></p>
          <ul className="soc" aria-label="Social media">
            {([["Facebook", site.social.facebook, Facebook], ["Instagram", site.social.instagram, Instagram], ["LinkedIn", site.social.linkedin, Linkedin]] as const).map(([l, h, Icon]) => <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" aria-label={`${l} (opens in a new tab)`}><Icon width={20} height={20} /></a></li>)}
          </ul>
        </aside>
      </div></section>
    </DxRoot>
  );
}
