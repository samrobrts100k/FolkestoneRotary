import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getStats } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { History, RoundTable, SwapWords, WorldNumbers } from "@/components/dx/about";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: "About Folkestone Rotary", description: "Who we are, what Rotary is, our history, leadership and how we meet in Folkestone.", path: "/about" });

export default async function AboutPage() {
  const [timeline, leaders, stats] = await Promise.all([getContentItems("timeline"), getContentItems("leader"), getStats()]);
  const groups = stats.find((s) => /organisation/i.test(s.label))?.value ?? 40;
  const sample = timeline.some((t) => t.is_sample);
  return (
    <DxRoot>
      <DxHero page="about" crumb="About us" title="Local people. Global network." lead="We’re Folkestone’s Rotary club: neighbours who’d rather do something than talk about it."
        aside={<div className="glass"><small>At a glance</small><ul><li><span>Meets</span><b>{site.meeting.short}</b></li><li><span>Part of</span><b>Rotary International</b></li><li><span>Backing</span><b>{groups}+ local groups</b></li></ul></div>} />
      <section className="sec" id="who-we-are"><div className="wrap"><SwapWords /><p className="sub" style={{ marginTop: 18 }}>We raise money, give time and connect with local organisations, as part of a worldwide network of Rotarians. Our focus is firmly local: every pound raised goes to local causes.</p></div></section>
      <section className="sec grey" id="history"><div className="wrap"><h2 className="s">Our story</h2>{sample && <p className="sub">Sample milestones. Replace with the club’s real history.</p>}<History items={timeline.map((t) => ({ id: t.id, title: t.title, body: t.body ?? "" }))} /></div></section>
      <section className="sec" id="leadership"><div className="wrap"><h2 className="s">Pull up a chair</h2><p className="sub">This is who’s round the table at lunch. Tap a seat to say hello.</p><RoundTable leaders={leaders.map((l) => ({ id: l.id, title: l.title, body: l.body }))} /></div></section>
      <section className="sec grey" id="rotary-international"><div className="wrap"><h2 className="s">Part of something bigger</h2><WorldNumbers clubGroups={groups} /><p className="sub" style={{ marginTop: 18 }}>Rotary International brings over a million Rotarians together on causes including peace, health, education and the environment. <a href="https://www.rotary.org" target="_blank" rel="noopener noreferrer">Visit rotary.org (opens in a new tab)</a>.</p></div></section>
      <section className="sec" id="how-we-meet"><div className="wrap"><div className="meet" data-rv><h2>Come and meet us</h2><div><p style={{ margin: "0 0 16px" }}>{site.meeting.when}, {site.meeting.venue}. Visitors are always welcome.</p><Link className="btn" href="/join">Visit as a guest</Link>{" "}<Link className="btn ghost" href="/contact">Get in touch</Link></div></div></div></section>
    </DxRoot>
  );
}
