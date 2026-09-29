import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { getResource } from "@/lib/admin/resources";
import { EventView } from "@/components/event-view";
import { NewsView } from "@/components/news-view";
import { StoryCard } from "@/components/cards";
import type { EventItem, ImpactStory, NewsItem } from "@/lib/types";

/** Shows any item (including drafts) exactly as visitors will see it. Only reachable by staff who manage that content. */
export default async function Preview({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res?.previewKind) notFound();
  await requireStaff(res.key);
  const { data } = await (await createSessionClient()).from(res.table).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="-mx-4 -my-10 lg:-mx-0">
      <div role="status" className="bg-gold px-4 py-3 text-center font-semibold text-navy">Preview — status: {data.status}. This page is {data.status === "published" ? "live" : "not visible to the public"} until published.</div>
      {res.previewKind === "event" && <EventView e={data as EventItem} />}
      {res.previewKind === "news" && <NewsView n={data as NewsItem} related={[]} />}
      {res.previewKind === "story" && <div className="container max-w-md py-10"><StoryCard story={data as ImpactStory} /></div>}
    </div>
  );
}
