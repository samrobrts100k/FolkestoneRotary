import Link from "next/link";
import { Briefcase, Globe2, HandHeart, HeartHandshake, PiggyBank, Users } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/sections";

const items = [
  { title: "Community Projects", text: "Practical help for local charities and groups.", href: "/impact", Icon: HeartHandshake },
  { title: "Youth Support", text: "Opportunities and encouragement for young people.", href: "/impact#youth-programmes", Icon: Users },
  { title: "Fundraising", text: "Fun events that raise money for local causes.", href: "/events", Icon: PiggyBank },
  { title: "Volunteering", text: "Give your time and meet great people.", href: "/join", Icon: HandHeart },
  { title: "Business Partnerships", text: "Partner with us to support Folkestone.", href: "/sponsors", Icon: Briefcase },
  { title: "International Projects", text: "Part of a worldwide network of Rotarians.", href: "/about#rotary-international", Icon: Globe2 },
];

/** Six ways in, as a ruled list rather than a card grid: icon, name, one line, whole row links. */
export function WhatWeDo() {
  return (
    <Section tone="grey">
      <SectionHeading title="Local people, local action" intro="Six ways Folkestone Rotary makes a difference." />
      <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, text, href, Icon }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.04} className="h-full">
              <Link href={href} className="group flex h-full gap-4 border-t border-line py-6 no-underline">
                <Icon aria-hidden className="mt-1 h-6 w-6 shrink-0 text-rotary" strokeWidth={1.75} />
                <span>
                  <span className="block font-serif text-[22px] font-bold leading-snug text-navy transition-colors duration-150 group-hover:text-rotary">{title}</span>
                  <span className="mt-1 block text-slate-700">{text}</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
