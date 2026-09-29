import { getEvent } from "@/lib/content";
import { buildIcs } from "@/lib/ics";
import { site } from "@/lib/site";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const e = await getEvent((await params).slug);
  if (!e) return new Response("Not found", { status: 404 });
  return new Response(buildIcs(e, `${site.url}/events/${e.slug}`), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${e.slug}.ics"` },
  });
}
