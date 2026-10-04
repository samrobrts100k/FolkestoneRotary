import Link from "next/link";
import { Reveal } from "@/components/motion";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

/** Latest headlines as a quiet two-column list: date over title, ruled between. */
export function NewsList({ items }: { items: NewsItem[] }) {
  if (!items.length) return <p className="text-slate-700">No news yet. Check back soon.</p>;
  return (
    <ul className="grid gap-x-16 md:grid-cols-2">
      {items.map((n, i) => (
        <li key={n.id}>
          <Reveal delay={i * 0.06}>
            <Link href={`/news/${n.slug}`} className="group block border-t border-line py-5 no-underline">
              <time dateTime={n.published_at} className="text-[15px] text-slate-blue">{formatDate(n.published_at, { day: "numeric", month: "short", year: "numeric" })}</time>
              <strong className="block font-serif text-[22px] font-bold leading-snug text-navy transition-colors duration-150 group-hover:text-rotary">{n.title}</strong>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
