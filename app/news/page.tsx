import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/lib/content";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { NewsExplorer } from "@/components/dx/news";
import { newsCategories } from "@/lib/seed";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({ title: "News", description: "Latest news from Folkestone Rotary: fundraising, community projects and club life.", path: "/news" });

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; tag?: string }> }) {
  const { q = "", category = "", tag } = await searchParams;
  const all = await getNews();
  const latest = all[0];
  const featured = all.find((n) => n.featured) ?? latest;
  const items = (tag ? all.filter((n) => n.tags.includes(tag)) : all).map((n) => ({ id: n.id, slug: n.slug, title: n.title, summary: n.summary, body: n.body, category: n.category, published_at: n.published_at }));
  return (
    <DxRoot>
      <DxHero page="news" crumb="News" title="News from the club" lead="Funding rounds, new members and the odd photo of someone in a hat."
        aside={latest && <div className="glass"><small>Latest · {formatDate(latest.published_at)}</small><Link className="link" href={`/news/${latest.slug}`}>{latest.title}</Link><p style={{ margin: 0, color: "#cfe0f2" }}>{latest.summary}</p></div>} />
      {featured && <section className="sec"><div className="wrap"><Link className="feat" href={`/news/${featured.slug}`}><div className="pic" aria-hidden="true" style={featured.image_url ? { backgroundImage: `url(${featured.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} /><div className="tx"><span className="tag">Featured</span><h2>{featured.title}</h2><p>{featured.summary}</p><span style={{ fontWeight: 700, color: "var(--gold)" }}>Read the story</span></div></Link></div></section>}
      <section className="sec grey"><div className="wrap"><NewsExplorer items={items} categories={newsCategories} initialQ={q} initialCategory={category} /></div></section>
    </DxRoot>
  );
}
