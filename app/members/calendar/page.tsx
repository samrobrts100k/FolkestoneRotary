import { createSessionClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth";
import { formatDate, formatTime } from "@/lib/utils";

export default async function CalendarPage() {
  await requireMember("/members/calendar");
  const { data } = await (await createSessionClient()).from("meetings").select("*").gte("starts_at", new Date(Date.now() - 864e5).toISOString()).order("starts_at");
  return (
    <div><h1 className="mb-5 text-3xl">Meeting calendar</h1>
      {data?.length ? <ul className="divide-y divide-slate-200 rounded-card border border-slate-200">{data.map((m) => <li key={m.id} className="p-4"><p className="font-semibold">{formatDate(m.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {formatTime(m.starts_at)}</p><p>{m.title}{m.venue ? ` – ${m.venue}` : ""}</p>{m.notes && <p className="text-sm text-slate-blue">{m.notes}</p>}</li>)}</ul> : <p>No upcoming meetings have been added.</p>}
    </div>
  );
}
