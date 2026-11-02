import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getPageText, getStories } from "@/lib/content";
import { toLines } from "@/lib/page-text";
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
  const [faqItems, stories, t] = await Promise.all([getContentItems("faq", "funding"), getStories(), getPageText("funding")]);
  const faqs = faqItems.map((f) => ({ q: f.title, a: f.body ?? "" }));
  const grants = stories.filter((s) => (s.amount_awarded ?? 0) > 0).slice(0, 4).map((s) => ({ id: s.id, name: s.title, what: s.summary, amount: s.amount_awarded ?? 0 }));
  return (
    <DxRoot>
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <DxHero page="funding" crumb="Funding" title={t.heroTitle} lead={t.heroLead}
        extra={<ul className="nos" aria-label="What to expect">{toLines(t.heroNos).map((x) => <li key={x}>{x}</li>)}</ul>}
        aside={<div className="glass fhero" id="fhero"><Application /></div>} />
      <section className="sec" id="criteria"><div className="wrap"><h2 className="s">{t.fundTitle}</h2><p className="sub">{t.fundSub}</p><FundCards cards={[[t.c1Title, t.c1Text], [t.c2Title, t.c2Text], [t.c3Title, t.c3Text], [t.c4Title, t.c4Text], [t.c5Title, t.c5Text]]} />
        <div className="fnot" data-rv><b>{t.notTitle}</b><ul>{toLines(t.notList).map((x) => <li key={x}>{x}</li>)}</ul><Link href="/contact?subject=Funding">{t.notLink}</Link></div></div></section>
      <section className="sec grey"><div className="wrap"><h2 className="s">{t.afterTitle}</h2><p className="sub">{t.afterSub}</p><Track steps={[[t.s1, t.s1Text], [t.s2, t.s2Text], [t.s3, t.s3Text], [t.s4, t.s4Text]]} /></div></section>
      {grants.length > 0 && <section className="sec"><div className="wrap"><h2 className="s">{t.grantsTitle}</h2><GrantWall grants={grants} /></div></section>}
      {faqs.length > 0 && <section className="sec grey"><div className="wrap" style={{ maxWidth: 820 }}><h2 className="s">{t.faqTitle}</h2><Accordion items={faqs} /></div></section>}
      <section className="sec"><div className="wrap"><div className="jcta" data-rv><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><StartButton>{t.ctaBtn}</StartButton></div></div></section>
      <ContinueBar />
    </DxRoot>
  );
}
