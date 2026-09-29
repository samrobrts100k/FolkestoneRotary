import "server-only";
import * as seed from "./seed";
import { createPublicClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { isUpcoming, isVisible } from "./visibility";
import type { ContentItem, EventItem, ImpactStory, NewsItem, Sponsor, Stat } from "./types";

/** Reads a table from Supabase, falling back to seed content when Supabase is not configured or errors. */
async function load<T>(table: string, fallback: T[], order?: { col: string; asc: boolean }): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    let q = createPublicClient().from(table).select("*");
    if (order) q = q.order(order.col, { ascending: order.asc });
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as T[];
  } catch (e) {
    console.error(`[content] ${table} failed, using seed`, e);
    return fallback;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  const rows = (await load<EventItem>("events", seed.events, { col: "starts_at", asc: true })).filter(isVisible);
  return rows;
}
export async function getUpcomingEvents(limit?: number) {
  const list = (await getEvents()).filter((e) => isUpcoming(e));
  return limit ? list.slice(0, limit) : list;
}
export async function getPastEvents() {
  return (await getEvents()).filter((e) => !isUpcoming(e)).reverse();
}
export const getEvent = async (slug: string) => (await getEvents()).find((e) => e.slug === slug) ?? null;

export async function getNews(): Promise<NewsItem[]> {
  return (await load<NewsItem>("news", seed.news, { col: "published_at", asc: false })).filter(isVisible);
}
export const getNewsItem = async (slug: string) => (await getNews()).find((n) => n.slug === slug) ?? null;

export async function getStories(): Promise<ImpactStory[]> {
  return (await load<ImpactStory>("impact_stories", seed.stories)).filter(isVisible);
}
export async function getStats(): Promise<Stat[]> {
  return (await load<Stat>("stats", seed.stats, { col: "sort_order", asc: true }));
}
export async function getSponsors(): Promise<Sponsor[]> {
  const now = new Date().toISOString().slice(0, 10);
  return (await load<Sponsor>("sponsors", seed.sponsors)).filter(
    (s) => isVisible(s) && (!s.ends_on || s.ends_on >= now) && (!s.starts_on || s.starts_on <= now),
  );
}
export async function getContentItems(kind: ContentItem["kind"], page?: string): Promise<ContentItem[]> {
  const rows = (await load<ContentItem>("content_items", seed.contentItems, { col: "sort_order", asc: true })).filter(isVisible);
  return rows.filter((r) => r.kind === kind && (!page || r.page === page));
}
export async function getGalleryImages(): Promise<{ url: string; alt: string; caption?: string }[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await createPublicClient().from("gallery_images").select("url, alt, caption").order("sort_order").limit(24);
    return data ?? [];
  } catch { return []; }
}
