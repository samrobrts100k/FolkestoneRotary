import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { ROLES, roleLabels } from "@/lib/permissions";
import { updateUser } from "../actions";
import { InviteForm } from "@/components/admin/invite-form";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/fields";

export default async function UsersPage() {
  await requireStaff("profiles");
  const { data } = await (await createSessionClient()).from("profiles").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Users</h1>
      <section aria-labelledby="inv"><h2 id="inv" className="mb-3 text-xl">Invite a member</h2><InviteForm /></section>
      <ul className="space-y-4">
        {data?.map((u) => (
          <li key={u.id} className="rounded-card border border-slate-200 p-4">
            <form action={updateUser.bind(null, u.id)} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <p className="sm:col-span-2 lg:col-span-3 font-semibold">{u.email}</p>
              <label className="text-sm font-semibold">Name<Input name="full_name" defaultValue={u.full_name ?? ""} /></label>
              <label className="text-sm font-semibold">Phone<Input name="phone" defaultValue={u.phone ?? ""} /></label>
              <label className="text-sm font-semibold">Club role (e.g. Secretary)<Input name="club_role" defaultValue={u.club_role ?? ""} /></label>
              <label className="text-sm font-semibold">Access role<Select name="role" defaultValue={u.role}>{ROLES.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}</Select></label>
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={u.is_active} className="h-5 w-5 accent-rotary" />Active (can sign in)</label>
              <Button type="submit" size="sm" className="self-end">Save</Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
