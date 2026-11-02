import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import type { PageText } from "@/lib/page-text";

/** Gold invitation panel: the lowest-commitment way in is visiting a meeting as a guest. */
export function JoinCta({ t }: { t: PageText<"home"> }) {
  return (
    <section className="pb-14 sm:pb-20">
      <div className="container">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[1.75rem] bg-gold px-7 py-9 text-navy sm:px-10 md:grid-cols-[1.3fr_1fr] md:gap-10 lg:rounded-panel lg:px-14 lg:py-12">
            <h2 className="m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.1]">{t.ctaTitle}</h2>
            <div>
              <p className="mb-5 mt-0">{t.ctaText}</p>
              <ButtonLink href="/join" className="bg-navy text-white shadow-none hover:bg-rotary-dark focus-visible:outline-navy">{t.ctaBtn}</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
