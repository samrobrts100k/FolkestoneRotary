import Link from "next/link";
import { Reveal } from "@/components/motion";
import type { Sponsor } from "@/lib/types";
import type { PageText } from "@/lib/page-text";

/** Thank-you row for the businesses behind our events, with an invitation for the next one. */
export function SponsorRow({ sponsors, t }: { sponsors: Sponsor[]; t: PageText<"home"> }) {
  const sample = sponsors.some((s) => s.is_sample);
  return (
    <section className="pb-14 sm:pb-20">
      <div className="container">
        <div className="grid gap-8 border-t-2 border-navy pt-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <Reveal>
            <h2 className="m-0 text-3xl leading-[1.1] sm:text-4xl">{t.sponsorsTitle}</h2>
            <p className="mb-6 mt-3 text-lg text-slate-700">{t.sponsorsIntro}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/contact?subject=Sponsorship" className="inline-block rounded-full bg-rotary px-6 py-3 font-bold text-white no-underline transition duration-200 ease-out-quint hover:-translate-y-0.5 hover:bg-rotary-dark hover:shadow-lift active:scale-[0.97]">{t.sponsorsBtn}</Link>
              <Link href="/sponsors" className="font-bold text-rotary underline decoration-2 underline-offset-4 hover:text-navy">{t.sponsorsLink}</Link>
            </div>
          </Reveal>
          {sponsors.length > 0 && (
            <Reveal delay={0.08}>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Our sponsors">
                {sponsors.slice(0, 8).map((s) => {
                  const own = s.website && !s.is_sample;
                  return (
                    <li key={s.id}>
                      <a href={own ? s.website : "/sponsors"} {...(own ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex h-24 items-center justify-center rounded-[14px] border border-line bg-white px-4 text-center text-[15px] font-bold leading-snug text-navy no-underline transition duration-200 ease-out-quint hover:-translate-y-1 hover:border-rotary hover:shadow-lift">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {s.logo_url ? <img src={s.logo_url} alt={s.name} loading="lazy" className="max-h-14 w-auto" /> : s.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {sample && <p className="mt-3 text-sm text-slate-blue">Sample names until the club adds its real sponsors.</p>}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
