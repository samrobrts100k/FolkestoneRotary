import type { Metadata } from "next";
import { getSponsors } from "@/lib/content";
import { PageHero, Section, SectionHeading } from "@/components/sections";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Our Sponsors & Partners", description: "The Folkestone businesses and partners who support Folkestone Rotary's events and community projects.", path: "/sponsors" });

const levels = [["gold", "Gold Sponsors"], ["silver", "Silver Sponsors"], ["bronze", "Bronze Sponsors"], ["community", "Community Partners"]] as const;

export default async function SponsorsPage() {
  const all = await getSponsors();
  return (
    <>
      <PageHero title="Our Sponsors & Partners" intro="Thank you to the local businesses that make our work possible." crumbs={[{ name: "Sponsors", path: "/sponsors" }]}>
        <ButtonLink href="/contact?subject=Sponsorship" variant="gold" size="lg">Become a Sponsor</ButtonLink>
        <ButtonLink href={site.sponsorshipPackUrl} variant="outline-light" size="lg">Download Sponsorship Pack</ButtonLink>
      </PageHero>
      <Section>
        {levels.map(([lvl, label]) => {
          const list = all.filter((s) => s.level === lvl);
          if (!list.length) return null;
          return (
            <div key={lvl} className="mb-12">
              <SectionHeading title={label} />
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((s) => (
                  <li key={s.id}><Card className="h-full"><CardBody className="text-center">
                    <a href={s.website || undefined} target="_blank" rel="noopener noreferrer" className="flex h-24 items-center justify-center font-bold text-rotary hover:underline" aria-label={`${s.name} (opens in a new tab)`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {s.logo_url ? <img src={s.logo_url} alt={s.name} loading="lazy" className="max-h-20 w-auto" /> : s.name}
                    </a>
                    {s.description && <p className="mt-2 text-sm text-slate-700">{s.description}</p>}
                  </CardBody></Card></li>
                ))}
              </ul>
            </div>
          );
        })}
      </Section>
    </>
  );
}
