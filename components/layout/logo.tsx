import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 rounded-lg font-serif text-xl font-bold leading-tight no-underline transition-colors duration-200", light ? "text-white" : "text-navy")} aria-label={`${site.name} – home`}>
      <span aria-hidden className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-lg text-rotary-dark ring-[3px] transition-shadow duration-200", light ? "ring-white" : "ring-rotary")}>F</span>
      <span className="whitespace-nowrap">{site.name}</span>
    </Link>
  );
}
