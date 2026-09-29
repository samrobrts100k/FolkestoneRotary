import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { resources } from "@/lib/admin/resources";
import { canManage } from "@/lib/permissions";
import { Card, CardBody } from "@/components/ui/card";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const s = await requireStaff();
  const { denied } = await searchParams;
  const sb = await createSessionClient();
  const [funding, member, contact] = await Promise.all([
    canManage(s.role, "funding_applications") ? sb.from("funding_applications").select("id", { count: "exact", head: true }).eq("status", "received") : null,
    canManage(s.role, "membership_enquiries") ? sb.from("membership_enquiries").select("id", { count: "exact", head: true }).eq("status", "new") : null,
    canManage(s.role, "contact_enquiries") ? sb.from("contact_enquiries").select("id", { count: "exact", head: true }).eq("status", "new") : null,
  ]);
  const todo = [["New funding applications", funding?.count, "/admin/funding"], ["New membership enquiries", member?.count, "/admin/membership_enquiries"], ["New contact enquiries", contact?.count, "/admin/contact_enquiries"]].filter((x) => x[1] != null);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Admin dashboard</h1>
      {denied && <p role="alert" className="rounded-xl bg-red-50 p-3 font-medium text-red-800">Your role doesn&apos;t have access to that area.</p>}
      {todo.length > 0 && <ul className="grid gap-4 sm:grid-cols-3">{todo.map(([l, n, h]) => <li key={h as string}><Link href={h as string}><Card><CardBody><p className="text-3xl font-extrabold text-rotary">{n as number}</p><p className="text-sm">{l as string}</p></CardBody></Card></Link></li>)}</ul>}
      <ul className="grid gap-3 sm:grid-cols-2">{resources.filter((r) => canManage(s.role, r.key)).map((r) => <li key={r.key}><Link href={`/admin/${r.key}`} className="block rounded-card border border-slate-200 p-4 font-semibold hover:border-rotary">{r.title} →</Link></li>)}</ul>
    </div>
  );
}
