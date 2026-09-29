import { createSessionClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth";

export default async function Contacts() {
  await requireMember("/members/contacts");
  const { data } = await (await createSessionClient()).from("profiles").select("id,full_name,email,phone,club_role").eq("is_active", true).not("club_role", "is", null).order("club_role");
  return (
    <div><h1 className="mb-5 text-3xl">Club contacts</h1>
      {data?.length ? <ul className="divide-y divide-slate-200 rounded-card border border-slate-200">{data.map((p) => <li key={p.id} className="p-4"><p className="font-semibold">{p.club_role} – {p.full_name}</p><a href={`mailto:${p.email}`} className="text-sm underline">{p.email}</a>{p.phone && <span className="text-sm"> · {p.phone}</span>}</li>)}</ul> : <p>No club officers have been listed yet (set a “club role” on a user in Admin → Users).</p>}
    </div>
  );
}
