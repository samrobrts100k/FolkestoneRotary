import type { Metadata } from "next";
import { getContentItems, getPageText } from "@/lib/content";
import { toLines } from "@/lib/page-text";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { Accordion } from "@/components/dx/common";
import { JoinCta, JoinHeroCard, JoinShell, Personas, Table } from "@/components/dx/join";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Join Rotary – volunteer in Folkestone", description: "Join Folkestone Rotary: meet great people, volunteer locally and make a difference. Visit us as a guest.", path: "/join" });

export default async function JoinPage() {
  const [items, t] = await Promise.all([getContentItems("faq", "join"), getPageText("join")]);
  const faqs = items.map((f) => ({ q: f.title, a: f.body ?? "" }));
  const card = { title: t.cardTitle, btn: t.cardBtn, fine: t.cardFine };
  return (
    <DxRoot>
      <JsonLd data={faqLd(faqs)} />
      <JoinShell text={card} barBtn={t.barBtn} hero={(
        <DxHero page="join" crumb="Join" title={t.heroTitle} lead={t.heroLead}
          extra={<ul className="nos" aria-label="What to expect">{toLines(t.heroNos).map((x) => <li key={x}>{x}</li>)}</ul>} aside={<JoinHeroCard text={card} />} />
      )}>
        <section className="sec" id="guest"><div className="wrap"><h2 className="s">{t.whoTitle}</h2><p className="sub">{t.whoSub}</p><Personas t={t} /></div></section>
        <section className="sec grey"><div className="wrap"><h2 className="s">{t.tableTitle}</h2><p className="sub">{t.tableSub}</p><Table t={t} /></div></section>
        <section className="sec"><div className="wrap"><div className="facts4">{([[t.fact1, t.fact1Sub], [t.fact2, t.fact2Sub], [t.fact3, t.fact3Sub], [t.fact4, t.fact4Sub]] as const).map(([b, s], i) => <div key={i}><b>{b}</b><span>{s}</span></div>)}</div></div></section>
        {faqs.length > 0 && <section className="sec grey"><div className="wrap" style={{ maxWidth: 820 }}><h2 className="s">{t.faqTitle}</h2><Accordion className="faqs" items={faqs} /></div></section>}
        <section className="sec"><div className="wrap"><JoinCta t={t} /></div></section>
      </JoinShell>
    </DxRoot>
  );
}
