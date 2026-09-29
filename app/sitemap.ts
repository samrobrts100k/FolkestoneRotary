import type { MetadataRoute } from "next";
import { getEvents, getNews } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, news] = await Promise.all([getEvents(), getNews()]);
  const fixed = ["", "/about", "/impact", "/events", "/news", "/join", "/funding", "/donate", "/contact", "/sponsors", "/privacy", "/cookies", "/accessibility", "/terms"];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...events.map((e) => ({ url: `${site.url}/events/${e.slug}`, lastModified: e.starts_at })),
    ...news.map((n) => ({ url: `${site.url}/news/${n.slug}`, lastModified: n.published_at })),
  ];
}
