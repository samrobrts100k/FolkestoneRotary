import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "@/components/icons";
import { footerLegal, nav, site } from "@/lib/site";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  const social = [
    { href: site.social.facebook, label: "Facebook", Icon: Facebook },
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];
  return (
    <footer className="bg-navy text-white/85">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">{site.description}</p>
          <ul className="flex gap-2">
            {social.map(({ href, label, Icon }) => (
              <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy"><Icon aria-hidden className="h-5 w-5" /></a></li>
            ))}
          </ul>
        </div>
        <nav aria-label="Quick links">
          <h2 className="mb-4 text-base font-semibold text-gold">Quick links</h2>
          <ul className="space-y-2 text-sm">
            {[...nav.filter((n) => n.href !== "/"), { href: "/sponsors", label: "Our Sponsors" }, { href: "/donate", label: "Donate" }].map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-gold hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 text-base font-semibold text-gold">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></li>
            <li className="flex gap-2"><Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:underline">{site.phone}</a></li>
            <li className="flex gap-2"><MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><span><strong className="font-semibold">We meet:</strong> {site.meeting.when}<br />{site.meeting.venue}, {site.meeting.address}</span></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-base font-semibold text-gold">Stay in touch</h2>
          <NewsletterForm compact />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-sm md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footerLegal.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-gold hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
