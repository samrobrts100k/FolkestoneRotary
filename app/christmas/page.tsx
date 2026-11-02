import type { Metadata } from "next";
import Link from "next/link";
import { getPageText } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { SantaFrame } from "@/components/dx/santa-frame";
import { Photo } from "@/components/ui/photo";
import { readImage } from "@/lib/page-text";
import { buildMetadata } from "@/lib/seo/metadata";
import { donateHref, santaFinderUrl } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Santa’s sleigh – when is Santa coming to my street?", description: "Find out when Folkestone Rotary’s Santa sleigh reaches your street this Christmas, and help us collect for local families.", path: "/christmas" });

export default async function ChristmasPage() {
  const t = await getPageText("christmas");
  const photo = readImage(t.sleighPhoto);
  return (
    <DxRoot>
      <DxHero page="christmas" crumb="Christmas" title={t.heroTitle} lead={t.heroLead}
        extra={<p style={{ marginTop: 22 }}><a className="btn gold" href="#santa">{t.finderTitle}</a></p>} />
      {photo && <section className="sec" style={{ paddingBottom: 0 }}><div className="wrap"><Photo src={photo} alt={t.sleighAlt} ratio="aspect-[16/7]" className="santa-photo" priority sizes="(min-width:1200px) 1132px, 100vw" /></div></section>}
      <section className="sec" id="santa"><div className="wrap">
        <h2 className="s">{t.finderTitle}</h2>
        <p className="sub">{t.finderNote}</p>
        <SantaFrame title={t.finderTitle} />
        <p className="santa-alt">Can’t see the route finder? <a href={santaFinderUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.</p>
      </div></section>
      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="meet" data-rv>
        <h2>{t.ctaTitle}</h2>
        <div><p>{t.ctaText}</p><Link className="btn" href="/join">{t.ctaBtn}</Link>{" "}<a className="btn ghost" href={donateHref}>{t.ctaBtn2}</a></div>
      </div></div></section>
    </DxRoot>
  );
}
