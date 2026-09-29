import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label={`${site.name} – home`}>
      <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-lg font-extrabold text-rotary-dark ring-2 ring-rotary">F</span>
      <span className={`leading-tight ${light ? "text-white" : "text-navy"}`}>
        <span className="block text-base font-bold">Folkestone</span>
        <span className={`block text-xs font-semibold uppercase tracking-widest ${light ? "text-gold" : "text-rotary"}`}>Rotary</span>
      </span>
    </Link>
  );
}
