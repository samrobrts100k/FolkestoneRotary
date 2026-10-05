import type { Metadata } from "next";
import { getContentItems } from "@/lib/content";
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
  const faqs = (await getContentItems("faq", "join")).map((f) => ({ q: f.title, a: f.body ?? "" }));
  return (
    <DxRoot>
      <JsonLd data={faqLd(faqs)} />
      <JoinShell hero={(
        <DxHero page="join" crumb="Join" title="Your first Tuesday" lead="No sign-up, no suit, no speech. Come to lunch and see if it feels like your kind of people."
          extra={<ul className="nos" aria-label="What to expect"><li>No suit</li><li>No speech</li><li>No commitment</li></ul>} aside={<JoinHeroCard />} />
      )}>
        <section className="sec" id="guest"><div className="wrap"><h2 className="s">Who’s it for?</h2><p className="sub">Everyone at the table started as a stranger. Find yourself below.</p><Personas /></div></section>
        <section className="sec grey"><div className="wrap"><h2 className="s">Pull up a chair</h2><p className="sub">This is the kind of company you’ll find on a Tuesday. Take one of the free seats.</p><Table /></div></section>
        <section className="sec"><div className="wrap"><div className="facts4"><div><b>To be confirmed</b><span>Annual membership</span></div><div><b>About two hours</b><span>A month, if you want it that way</span></div><div><b>Come as you are</b><span>Dress for your day</span></div><div><b>Always welcome</b><span>Guests, no strings</span></div></div></div></section>
        {faqs.length > 0 && <section className="sec grey"><div className="wrap" style={{ maxWidth: 820 }}><h2 className="s">Questions people ask</h2><Accordion className="faqs" items={faqs} /></div></section>}
        <section className="sec"><div className="wrap"><JoinCta /></div></section>
      </JoinShell>
    </DxRoot>
  );
}
