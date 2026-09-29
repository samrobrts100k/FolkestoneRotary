import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/lib/content";
import { EventView } from "@/components/event-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;
export async function generateStaticParams() { return (await getEvents()).map((e) => ({ slug: e.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return {};
  return buildMetadata({ title: e.title, description: e.short_description, path: `/events/${e.slug}`, image: e.image_url });
}
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  return <EventView e={e} />;
}
