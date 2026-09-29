import Link from "next/link";
import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { canAccessAdmin, canViewCommitteeDocs } from "@/lib/permissions";
import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Members", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const s = await requireMember();
  const links = [
    ["/members", "Dashboard"], ["/members/calendar", "Meeting calendar"], ["/members/documents/minutes", "Minutes"], ["/members/documents/policy", "Policies"],
    ["/members/documents/document", "Documents"], ["/members/contacts", "Club contacts"], ["/members/directory", "Directory"], ["/members/documents/download", "Downloads"],
    ...(canViewCommitteeDocs(s.role) ? [["/members/documents/committee", "Committee"]] : []),
  ];
  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[14rem_1fr]">
      <aside>
        <p className="font-semibold">{s.fullName || s.email}</p>
        <p className="mb-4 text-sm capitalize text-slate-blue">{s.role.replace("_", " ")}</p>
        <nav aria-label="Members area"><ul className="flex flex-wrap gap-1 lg:flex-col">{links.map(([h, l]) => <li key={h}><Link href={h} className="block rounded-full px-4 py-2 text-sm font-semibold hover:bg-rotary-light">{l}</Link></li>)}</ul></nav>
        <div className="mt-4 flex flex-wrap gap-2">
          {canAccessAdmin(s.role) && <Link href="/admin" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold">Admin</Link>}
          <form action={signOut}><Button variant="outline" size="sm" type="submit">Sign out</Button></form>
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
