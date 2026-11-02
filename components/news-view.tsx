import Link from "next/link";
import { DxRoot } from "@/components/dx/dx-root";
import { DxHero } from "@/components/dx/hero";
import { Photo } from "@/components/ui/photo";
import { ShareButtons } from "@/components/share-buttons";
import { JsonLd } from "@/components/json-ld";
import { articleLd } from "@/lib/seo/jsonld";
import { categoryName, formatDate } from "@/lib/utils";
import { newsCategories } from "@/lib/seed";
import { site } from "@/lib/site";
import type { NewsItem } from "@/lib/types";

const mins = (b: string) => Math.max(1, Math.round(b.split(/\s+/).length / 200));

/** One article, in the seafront design: hero with the summary, a comfortable reading column, then more news. */
export function NewsView({ n, related }: { n: NewsItem; related: NewsItem[] }) {
  return (
    <DxRoot>
      <JsonLd data={articleLd(n)} />
      <DxHero page="news" crumb="News" sub={{ name: n.title, path: `/news/${n.slug}` }} title={n.title} lead={n.summary}
        aside={
          <div className="glass">
            <ul>
              <li><span>Published</span><time dateTime={n.published_at}>{formatDate(n.published_at)}</time></li>
              <li><span>By</span><span>{n.author}</span></li>
              <li><span>Filed under</span><span>{categoryName(newsCategories, n.category)}</span></li>
              <li><span>Reading time</span><span>{mins(n.body)} min</span></li>
            </ul>
          </div>
        } />

      <section className="sec"><div className="wrap">
        <article className="artx">
          {n.image_url && <Photo src={n.image_url} alt={n.image_alt || n.title} ratio="aspect-[16/9]" className="dtl-pic" priority sizes="(min-width:800px) 760px, 100vw" />}
          <div className="dtl-copy big">{n.body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>
          {n.tags.length > 0 && <ul className="dtl-chips" aria-label="Tags">{n.tags.map((t) => <li key={t}><Link href={`/news?tag=${encodeURIComponent(t)}`}>{t}</Link></li>)}</ul>}
          <div className="dtl-share"><ShareButtons url={`${site.url}/news/${n.slug}`} title={n.title} /></div>
        </article>
      </div></section>

      {related.length > 0 && (
        <section className="sec grey"><div className="wrap">
          <h2 className="s">More from the club</h2>
          <div style={{ marginTop: 18 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/news/${r.slug}`} className="nrow">
                <time dateTime={r.published_at}>{formatDate(r.published_at)}</time>
                <div><h3>{r.title}</h3><p>{r.summary}</p></div>
                <span className="rt">{mins(r.body)} min read</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 22 }}><Link className="btn ghost" href="/news">All news</Link></p>
        </div></section>
      )}

      <section className="sec"><div className="wrap"><div className="meet" data-rv>
        <h2>Come to a meeting as our guest</h2>
        <div><p>{site.meeting.when}. At {site.meeting.venue}. No obligation.</p><Link className="btn" href="/join">Ask to visit</Link></div>
      </div></div></section>
    </DxRoot>
  );
}
