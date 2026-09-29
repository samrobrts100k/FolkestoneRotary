import Link from "next/link";
import { Briefcase, Globe2, HandHeart, HeartHandshake, PiggyBank, Users } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
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

export function WhatWeDo() {
  return (
    <Section tone="grey">
      <SectionHeading eyebrow="What we do" title="Local people, local action" intro="Six ways Folkestone Rotary makes a difference." />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, text, href, Icon }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link href={href} className="block h-full rounded-card">
                <Card className="h-full"><CardBody>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-light text-rotary"><Icon aria-hidden /></span>
                  <h3 className="mt-4 text-xl">{title}</h3><p className="mt-1 text-slate-700">{text}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-rotary">Learn more →</span>
                </CardBody></Card>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
