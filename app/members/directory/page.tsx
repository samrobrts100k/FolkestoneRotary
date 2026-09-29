import { createSessionClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth";

export default async function Directory() {
  await requireMember("/members/directory");
  const { data } = await (await createSessionClient()).from("profiles").select("id,full_name,email,phone,club_role").eq("is_active", true).eq("show_in_directory", true).order("full_name");
  return (
    <div><h1 className="mb-5 text-3xl">Member directory</h1>
      <p className="mb-4 text-sm text-slate-blue">For Folkestone Rotary members only — please don&apos;t share these details.</p>
      <ul className="grid gap-3 sm:grid-cols-2">{data?.map((p) => <li key={p.id} className="rounded-card border border-slate-200 p-4"><p className="font-semibold">{p.full_name || "Member"}</p>{p.club_role && <p className="text-sm text-rotary">{p.club_role}</p>}<a href={`mailto:${p.email}`} className="block text-sm underline">{p.email}</a>{p.phone && <a href={`tel:${p.phone}`} className="block text-sm underline">{p.phone}</a>}</li>)}</ul>
    </div>
  );
}
