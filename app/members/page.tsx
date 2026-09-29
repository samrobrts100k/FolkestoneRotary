import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { Card, CardBody } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const s = await requireMember();
  const sb = await createSessionClient();
  const { data: meetings } = await sb.from("meetings").select("id,title,starts_at,venue").gte("starts_at", new Date().toISOString()).order("starts_at").limit(3);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Welcome{s.fullName ? `, ${s.fullName.split(" ")[0]}` : ""}</h1>
      <Card><CardBody>
        <h2 className="text-xl">Next meetings</h2>
        {meetings?.length ? <ul className="mt-3 space-y-2">{meetings.map((m) => <li key={m.id}><strong>{formatDate(m.starts_at, { weekday: "long", day: "numeric", month: "long" })}</strong> – {m.title}{m.venue ? `, ${m.venue}` : ""}</li>)}</ul> : <p className="mt-2 text-slate-700">No meetings scheduled yet.</p>}
        <Link href="/members/calendar" className="mt-3 inline-block font-semibold text-rotary underline">Full calendar</Link>
      </CardBody></Card>
      <ul className="grid gap-4 sm:grid-cols-2">
        {[["/members/documents/minutes", "Meeting minutes"], ["/members/documents/policy", "Policies"], ["/members/directory", "Member directory"], ["/members/contacts", "Club contacts"]].map(([h, l]) => <li key={h}><Link href={h}><Card><CardBody className="font-semibold">{l} →</CardBody></Card></Link></li>)}
      </ul>
    </div>
  );
}
