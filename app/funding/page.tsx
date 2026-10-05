import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getStories } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { Accordion } from "@/components/dx/common";
import { Application, ContinueBar, FundCards, GrantWall, StartButton, Track } from "@/components/dx/funding";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Apply for Funding – community funding Folkestone", description: "Local charities and community groups can apply for funding from Folkestone Rotary. Check the criteria and apply online.", path: "/funding" });

export default async function FundingPage() {
  const [faqItems, stories] = await Promise.all([getContentItems("faq", "funding"), getStories()]);
  const faqs = faqItems.map((f) => ({ q: f.title, a: f.body ?? "" }));
  const grants = stories.filter((s) => (s.amount_awarded ?? 0) > 0).slice(0, 4).map((s) => ({ id: s.id, name: s.title, what: s.summary, amount: s.amount_awarded ?? 0 }));
  return (
    <DxRoot>
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <DxHero page="funding" crumb="Funding" title="Funding for local good" lead="Tell us about your project in three short steps. No account, no jargon, and we save your answers as you go."
        extra={<ul className="nos" aria-label="What to expect"><li>About 5 minutes</li><li>Saved as you type</li><li>Quotes can wait</li></ul>}
        aside={<div className="glass fhero" id="fhero"><Application /></div>} />
      <section className="sec" id="criteria"><div className="wrap"><h2 className="s">What we fund</h2><p className="sub">Registered charities, schools, community groups and non-profits working to benefit people in the Folkestone area. If your idea is somewhere in this list, apply.</p><FundCards />
        <div className="fnot" data-rv><b>Usually not a fit</b><ul><li>Individuals or private businesses</li><li>Running costs on their own</li><li>Political or religious campaigns</li></ul><Link href="/contact?subject=Funding">Not sure? Ask us first.</Link></div></div></section>
      <section className="sec grey"><div className="wrap"><h2 className="s">What happens after you apply</h2><p className="sub">Our funding panel reviews each application and you will be told the outcome. The panel confirms the timings.</p><Track /></div></section>
      {grants.length > 0 && <section className="sec"><div className="wrap"><h2 className="s">Recent grants</h2><GrantWall grants={grants} /></div></section>}
      {faqs.length > 0 && <section className="sec grey"><div className="wrap" style={{ maxWidth: 820 }}><h2 className="s">Quick answers</h2><Accordion items={faqs} /></div></section>}
      <section className="sec"><div className="wrap"><div className="jcta" data-rv><div><h2>Got a project in mind?</h2><p>It takes about five minutes, and you can stop and come back whenever you like.</p></div><StartButton>Start my application</StartButton></div></div></section>
      <ContinueBar />
    </DxRoot>
  );
}
