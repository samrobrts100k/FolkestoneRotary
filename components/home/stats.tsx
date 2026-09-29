import { Counter, Reveal } from "@/components/motion";
import type { Stat } from "@/lib/types";

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Our impact in numbers" className="bg-white">
      <div className="container -mt-10 relative z-10">
        <Reveal>
          <dl className="grid grid-cols-2 gap-6 rounded-card bg-white p-6 shadow-lift sm:p-8 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.id} className="text-center">
                <dd className="order-1 text-3xl font-extrabold text-rotary sm:text-4xl"><Counter value={s.value} prefix={s.prefix} suffix={s.suffix} /></dd>
                <dt className="mt-1 text-sm font-medium text-slate-blue">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
        {stats.some((s) => s.is_sample) && <p className="mt-2 text-center text-xs text-slate-blue">Sample figures — editable placeholders until confirmed.</p>}
      </div>
    </section>
  );
}
