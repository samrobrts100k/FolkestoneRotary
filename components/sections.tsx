import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { JsonLd } from "./json-ld";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export function Section({ children, className, tone = "white", id }: { children: React.ReactNode; className?: string; tone?: "white" | "grey" | "blue" | "navy"; id?: string }) {
  const tones = { white: "bg-white", grey: "bg-surface", blue: "bg-rotary text-white", navy: "bg-navy text-white" };
  return <section id={id} className={cn("py-14 sm:py-20", tones[tone], className)}><div className="container">{children}</div></section>;
}

export function SectionHeading({ eyebrow, title, intro, align = "left", light }: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; light?: boolean }) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className={cn("mb-2 text-sm font-bold uppercase tracking-widest", light ? "text-gold" : "text-rotary")}>{eyebrow}</p>}
      <h2 className={cn("text-3xl sm:text-4xl", light && "text-white")}>{title}</h2>
      {intro && <p className={cn("mt-3 text-lg", light ? "text-white/85" : "text-slate-700")}>{intro}</p>}
    </Reveal>
  );
}

export function PageHero({ title, intro, crumbs, children }: { title: string; intro?: string; crumbs?: { name: string; path: string }[]; children?: React.ReactNode }) {
  const trail = [{ name: "Home", path: "/" }, ...(crumbs ?? [])];
  return (
    <div className="bg-gradient-to-br from-rotary to-navy text-white">
      <div className="container py-12 sm:py-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
            <JsonLd data={breadcrumbLd(trail)} />
            <ol className="flex flex-wrap items-center gap-1">
              {trail.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5" />}
                  {i < trail.length - 1 ? <Link href={c.path} className="underline-offset-2 hover:underline">{c.name}</Link> : <span aria-current="page">{c.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-white/90">{intro}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  );
}

export const SampleNote = () => (
  <p className="mt-4 rounded-xl border border-gold bg-gold-light px-4 py-2 text-sm text-navy">Sample content — figures and details are editable placeholders until confirmed by the club.</p>
);

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-card border border-slate-200 bg-white">
      {items.map((i) => (
        <details key={i.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{i.q}<ChevronRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" /></summary>
          <p className="mt-3 text-slate-700">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
