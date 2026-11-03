import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getGalleryImages, getPageText, getStats, getStories } from "@/lib/content";
import { fill } from "@/lib/page-text";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { DxPanels } from "@/components/dx/panels";
import { DxPhotos } from "@/components/dx/photos";
import { Huts, Quotes, StoryBento, VolunteerRing } from "@/components/dx/impact";
import { buildMetadata } from "@/lib/seo/metadata";
import { gbp } from "@/lib/utils";
import { Counter } from "@/components/motion";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "Our Impact – community funding in Folkestone", description: "See how Folkestone Rotary supports local charities, schools, families and young people.", path: "/impact" });

const SEG = ["#005DAA", "#4d93cc", "#F7A81B", "#fff"];

export default async function ImpactPage() {
  const [stats, stories, testimonials, reports, gallery, t] = await Promise.all([getStats(), getStories(), getContentItems("testimonial"), getContentItems("annual_report"), getGalleryImages(), getPageText("impact")]);
  const raised = stats[0];
  const awarded = stories.filter((s) => (s.amount_awarded ?? 0) > 0);
  const total = awarded.reduce((a, s) => a + (s.amount_awarded ?? 0), 0);
  const causes = [...awarded].sort((a, b) => (b.amount_awarded ?? 0) - (a.amount_awarded ?? 0)).slice(0, 4).map((s) => ({ id: s.id, name: s.title, value: s.amount_awarded ?? 0 }));
  const hours = stats.find((s) => /volunteer/i.test(s.label))?.value ?? 1200;
  const headline = raised ? `${raised.prefix ?? ""}${raised.value.toLocaleString("en-GB")}` : gbp(total);
  const sample = stories.some((s) => s.is_sample) || Boolean(raised?.is_sample);
  return (
    <DxRoot>
      <DxHero page="impact" crumb="Our impact" title={fill(t.heroTitle, { amount: headline })} lead={t.heroLead}
        aside={raised && <div className="glass"><small>{raised.label}{sample ? " (sample)" : ""}</small><b className="big"><Counter value={raised.value} prefix={raised.prefix} suffix={raised.suffix} /></b>
          <div className="segs" aria-hidden="true">{causes.map((c, k) => <i key={c.id} style={{ width: `${(c.value / (total || 1)) * 100}%`, background: SEG[k % 4] }} />)}</div>
          <p style={{ margin: "10px 0 0", color: "#cfe0f2" }}>{t.glassNote}</p><a className="btn gold" href="#where">{t.glassBtn}</a></div>} />
      <DxPanels value={t.panels} where="top" />
      {causes.length > 0 && <section className="sec" id="where"><div className="wrap"><h2 className="s">{t.hutsTitle}</h2><p className="sub">{t.hutsSub}{sample ? " Sample figures, editable in the admin." : ""}</p><Huts causes={causes} total={total} /></div></section>}
      <section className="sec grey" id="projects"><div className="wrap"><h2 className="s">{t.storiesTitle}</h2><p className="sub">{t.storiesSub}</p><StoryBento sample={sample} stories={stories.map((s) => ({ id: s.id, slug: s.slug, title: s.title, organisation: s.organisation, summary: s.summary, outcome: s.outcome, amount: s.amount_awarded, body: s.body }))} /></div></section>
      {testimonials.length > 0 && <section className="sec" id="testimonials"><div className="wrap"><h2 className="s">{t.quotesTitle}</h2><Quotes items={testimonials.map((t) => ({ id: t.id, quote: t.body ?? "", by: t.title }))} /></div></section>}
      <section className="sec grey" id="volunteering"><div className="wrap ringwrap"><VolunteerRing hours={hours} /><div style={{ maxWidth: "30em" }}><h2 className="s">{t.timeTitle}</h2><p className="sub">{t.timeSub}</p><Link className="btn blue" href="/join">{t.timeBtn}</Link></div></div></section>
      <DxPhotos title={t.galleryTitle} value={t.photos} extra={gallery.map((g) => ({ url: g.url, alt: g.alt || "Folkestone Rotary" }))} />
      <section className="sec" id="reports"><div className="wrap"><h2 className="s">{t.reportsTitle}</h2><div style={{ maxWidth: 700, marginTop: 16 }}>{reports.map((r) => <div className="dl" key={r.id}><b>{r.title}</b>{r.url ? <a className="btn blue" href={r.url} download>Download PDF</a> : <span style={{ color: "var(--mute)" }}>PDF to be uploaded</span>}</div>)}</div></div></section>
      {t.ctaShow !== "hide" && <section className="sec"><div className="wrap"><div className="meet" data-rv><h2>{t.ctaTitle}</h2><div><p style={{ margin: "0 0 16px" }}>{t.ctaText}</p><Link className="btn" href="/funding">{t.ctaBtn}</Link>{" "}<Link className="btn ghost" href="/join">{t.ctaBtn2}</Link></div></div></div></section>}
      <DxPanels value={t.panels} where="bottom" />
    </DxRoot>
  );
}
