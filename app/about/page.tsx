import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getPageText, getStats } from "@/lib/content";
import { toLines } from "@/lib/page-text";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { History, RoundTable, SwapWords, WorldNumbers } from "@/components/dx/about";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "About Folkestone Rotary", description: "Who we are, what Rotary is, our history, leadership and how we meet in Folkestone.", path: "/about" });

export default async function AboutPage() {
  const [timeline, leaders, stats, t] = await Promise.all([getContentItems("timeline"), getContentItems("leader"), getStats(), getPageText("about")]);
  const groups = stats.find((s) => /organisation/i.test(s.label))?.value ?? 40;
  const sample = timeline.some((t) => t.is_sample);
  return (
    <DxRoot>
      <DxHero page="about" crumb="About us" title={t.heroTitle} lead={t.heroLead}
        aside={<div className="glass"><small>{t.glassLabel}</small><ul><li><span>Meets</span><b>{site.meeting.short}</b></li><li><span>Part of</span><b>Rotary International</b></li><li><span>Backing</span><b>{groups}+ local groups</b></li></ul></div>} />
      <section className="sec" id="who-we-are"><div className="wrap"><SwapWords start={t.swapStart} words={toLines(t.swapWords)} /><p className="sub" style={{ marginTop: 18 }}>{t.whoText}</p></div></section>
      <section className="sec grey" id="history"><div className="wrap"><h2 className="s">{t.storyTitle}</h2>{sample && <p className="sub">Sample milestones. Replace with the club’s real history.</p>}<History items={timeline.map((t) => ({ id: t.id, title: t.title, body: t.body ?? "" }))} /></div></section>
      <section className="sec" id="leadership"><div className="wrap"><h2 className="s">{t.leadersTitle}</h2><p className="sub">{t.leadersSub}</p><RoundTable leaders={leaders.map((l) => ({ id: l.id, title: l.title, body: l.body }))} /></div></section>
      <section className="sec grey" id="rotary-international"><div className="wrap"><h2 className="s">{t.worldTitle}</h2><WorldNumbers clubGroups={groups} /><p className="sub" style={{ marginTop: 18 }}>{t.worldText} <a href="https://www.rotary.org" target="_blank" rel="noopener noreferrer">Visit rotary.org (opens in a new tab)</a>.</p></div></section>
      <section className="sec" id="how-we-meet"><div className="wrap"><div className="meet" data-rv><h2>{t.ctaTitle}</h2><div><p style={{ margin: "0 0 16px" }}>{t.ctaText}</p><Link className="btn" href="/join">{t.ctaBtn}</Link>{" "}<Link className="btn ghost" href="/contact">{t.ctaBtn2}</Link></div></div></div></section>
    </DxRoot>
  );
}
