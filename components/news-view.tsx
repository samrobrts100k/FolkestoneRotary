import { NewsCard } from "@/components/cards";
import { PageHero, Section } from "@/components/sections";
import { Photo } from "@/components/ui/photo";
import { ButtonLink } from "@/components/ui/button";
import { ShareButtons } from "@/components/share-buttons";
import { JsonLd } from "@/components/json-ld";
import { articleLd } from "@/lib/seo/jsonld";
import { categoryName, formatDate } from "@/lib/utils";
import { newsCategories } from "@/lib/seed";
import { site } from "@/lib/site";
import type { NewsItem } from "@/lib/types";

export function NewsView({ n, related }: { n: NewsItem; related: NewsItem[] }) {
  return (
    <>
      <JsonLd data={articleLd(n)} />
      <PageHero title={n.title} crumbs={[{ name: "News", path: "/news" }, { name: n.title, path: `/news/${n.slug}` }]} />
      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-rotary"><time dateTime={n.published_at}>{formatDate(n.published_at)}</time> · By {n.author} · {categoryName(newsCategories, n.category)}</p>
          <Photo src={n.image_url} alt={n.image_alt || n.title} ratio="aspect-[16/9]" className="mb-8 rounded-card" priority sizes="768px" />
          <div className="prose-club text-lg">{n.body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>
          <div className="mt-8 border-t border-slate-200 pt-6"><ShareButtons url={`${site.url}/news/${n.slug}`} title={n.title} /></div>
        </article>
        {related.length > 0 && (<div className="mt-16"><h2 className="mb-6 text-2xl">Related articles</h2><ul className="grid gap-6 md:grid-cols-3">{related.map((r) => <li key={r.id}><NewsCard item={r} /></li>)}</ul></div>)}
        <div className="mt-12 text-center"><ButtonLink href="/join" size="lg">Join Rotary</ButtonLink></div>
      </Section>
    </>
  );
}
