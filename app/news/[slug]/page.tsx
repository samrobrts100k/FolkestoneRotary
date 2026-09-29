import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNews, getNewsItem } from "@/lib/content";
import { NewsView } from "@/components/news-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export async function generateStaticParams() { return (await getNews()).map((n) => ({ slug: n.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = await getNewsItem((await params).slug);
  return n ? buildMetadata({ title: n.title, description: n.summary, path: `/news/${n.slug}`, image: n.image_url, type: "article" }) : {};
}
export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const n = await getNewsItem((await params).slug);
  if (!n) notFound();
  const related = (await getNews()).filter((x) => x.id !== n.id && (x.category === n.category || x.tags.some((t) => n.tags.includes(t)))).slice(0, 3);
  return <NewsView n={n} related={related} />;
}
