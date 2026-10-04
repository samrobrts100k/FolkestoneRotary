import { Counter, Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { ContentItem, Stat } from "@/lib/types";

/** Blue panel: one testimonial beside the headline figures. Both come from the admin. */
export function StatsBand({ stats, quote, limit = 3 }: { stats: Stat[]; quote?: ContentItem; limit?: number }) {
  const top = stats.slice(0, limit);
  // Seed quotes carry "(sample quote)" in the text; the caption says it instead.
  const text = quote?.body?.replace(/\s*\(sample quote\)\s*$/i, "").trim();
  if (!top.length && !text) return null;
  return (
    <section aria-label="Our impact in numbers" className="pt-9 sm:pt-14">
      <div className="container">
        <Reveal>
          <div className={cn("on-dark grid items-center gap-10 rounded-[1.75rem] bg-rotary p-7 text-white sm:p-10 md:gap-11 lg:rounded-panel lg:p-14", text && top.length > 0 && "md:grid-cols-[1.2fr_1fr]")}>
            {text && (
              <figure className="m-0">
                <blockquote className="m-0 font-serif text-[clamp(26px,3vw,38px)] font-medium leading-tight [text-wrap:balance]">{text}</blockquote>
                <figcaption className="mt-[18px] text-base font-semibold text-[#CFE3F7]">{quote?.is_sample ? "Sample quote · " : ""}{quote?.title}</figcaption>
              </figure>
            )}
            {top.length > 0 && (
              <div className={cn(text && "border-l-2 border-gold pl-6 sm:pl-7")}>
                <dl className={cn("grid gap-3.5 text-[17px]", !text && "grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]")}>
                  {top.map((s) => (
                    <div key={s.id} className="flex flex-col">
                      <dt className="order-2">{s.label}</dt>
                      <dd className="order-1 m-0 font-serif text-[30px] font-bold leading-tight text-gold tabular-nums"><Counter value={s.value} prefix={s.prefix} suffix={s.suffix} /></dd>
                    </div>
                  ))}
                </dl>
                {top.some((s) => s.is_sample) && <p className="mt-3.5 text-sm text-[#CFE3F7]">Sample figures, editable in the admin.</p>}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
