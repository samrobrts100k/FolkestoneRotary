import Link from "next/link";
import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { resources } from "@/lib/admin/resources";
import { canManage, roleLabels } from "@/lib/permissions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireStaff();
  const links = [
    ["/admin", "Dashboard"],
    ...resources.filter((r) => canManage(s.role, r.key)).map((r) => [`/admin/${r.key}`, r.title]),
    ...(canManage(s.role, "media") ? [["/admin/media", "Media library"]] : []),
    ...(canManage(s.role, "funding_applications") ? [["/admin/funding", "Funding applications"]] : []),
    ...(canManage(s.role, "profiles") ? [["/admin/users", "Users"]] : []),
  ];
  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[15rem_1fr]">
      <aside>
        <p className="text-sm text-slate-blue">Signed in as {s.email} · {roleLabels[s.role]}</p>
        <nav aria-label="Admin" className="mt-4"><ul className="flex flex-wrap gap-1 lg:flex-col">{links.map(([h, l]) => <li key={h}><Link href={h} className="block rounded-full px-4 py-2 text-sm font-semibold hover:bg-rotary-light">{l}</Link></li>)}</ul></nav>
        <Link href="/members" className="mt-4 inline-block text-sm underline">← Members area</Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
