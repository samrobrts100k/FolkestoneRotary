import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { PAGE_TEXT, type PageKey } from "@/lib/page-text";

export default async function PageTextIndex() {
  await requireStaff("pages");
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">Page text</h1>
      <p className="mb-6 mt-2 text-slate-700">Change the headings, introductions, buttons and other wording on each page. Events, news, stories, sponsors, figures and FAQs have their own sections in the menu.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(PAGE_TEXT) as PageKey[]).map((k) => (
          <li key={k}><Link href={`/admin/page-text/${k}`} className="block rounded-card border border-slate-200 p-4 font-semibold hover:border-rotary">{PAGE_TEXT[k].label} →<span className="block text-sm font-normal text-slate-blue">{PAGE_TEXT[k].path}</span></Link></li>
        ))}
      </ul>
    </div>
  );
}
