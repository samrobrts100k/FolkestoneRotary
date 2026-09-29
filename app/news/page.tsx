import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getNews } from "@/lib/content";
import { NewsCard } from "@/components/cards";
import { PageHero, Section } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { newsCategories } from "@/lib/seed";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({ title: "News", description: "Latest news from Folkestone Rotary: fundraising, community projects and club life.", path: "/news" });

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; tag?: string }> }) {
  const { q = "", category, tag } = await searchParams;
  const all = await getNews();
  const term = q.trim().toLowerCase();
  const list = all.filter((n) => (!category || n.category === category) && (!tag || n.tags.includes(tag)) && (!term || `${n.title} ${n.summary} ${n.body}`.toLowerCase().includes(term)));
  const filtering = Boolean(term || category || tag);
  const featured = !filtering ? all.find((n) => n.featured) ?? all[0] : undefined;
  const grid = list.filter((n) => n.id !== featured?.id);
  const tags = [...new Set(all.flatMap((n) => n.tags))].sort();
  return (
    <>
      <PageHero title="News" intro="What's been happening at Folkestone Rotary." crumbs={[{ name: "News", path: "/news" }]} />
      <Section>
        <div className="mb-8 space-y-4">
          <form role="search" action="/news" className="flex gap-2">
            <label htmlFor="q" className="sr-only">Search news</label>
            <Input id="q" name="q" type="search" defaultValue={q} placeholder="Search news…" className="max-w-md" />
            <Button type="submit"><Search aria-hidden className="h-4 w-4" />Search</Button>
          </form>
          <nav aria-label="News categories" className="flex flex-wrap gap-2">
            <Link href="/news" className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-semibold ${!category ? "border-rotary bg-rotary text-white" : "border-slate-300"}`}>All</Link>
            {newsCategories.map((c) => <Link key={c.slug} href={`/news?category=${c.slug}`} aria-current={category === c.slug ? "true" : undefined} className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-semibold ${category === c.slug ? "border-rotary bg-rotary text-white" : "border-slate-300"}`}>{c.name}</Link>)}
          </nav>
          <p className="flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold">Tags:</span>{tags.map((t) => <Link key={t} href={`/news?tag=${t}`}><Badge className={tag === t ? "bg-gold" : ""}>#{t}</Badge></Link>)}</p>
        </div>
        {featured && (
          <Link href={`/news/${featured.slug}`} className="mb-10 block rounded-card bg-rotary p-8 text-white shadow-soft hover:bg-rotary-dark">
            <Badge>Featured</Badge>
            <h2 className="mt-3 text-3xl text-white">{featured.title}</h2>
            <p className="mt-2 max-w-2xl text-white/90">{featured.summary}</p>
            <p className="mt-3 text-sm text-white/80">{formatDate(featured.published_at)} · {featured.author}</p>
          </Link>
        )}
        {grid.length ? <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{grid.map((n) => <li key={n.id}><NewsCard item={n} /></li>)}</ul>
          : <p className="rounded-card bg-surface p-6">No stories match. <Link href="/news" className="font-semibold text-rotary underline">Clear filters</Link></p>}
      </Section>
    </>
  );
}
