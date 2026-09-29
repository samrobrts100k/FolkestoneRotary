import { ButtonLink } from "@/components/ui/button";
import { donateHref } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy text-white">
      {/* Replace with a local Folkestone photo: add <Image src="/images/hero.jpg" fill priority className="object-cover" alt="…" /> here. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-br from-rotary via-rotary-dark to-navy" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/40" />
      <div className="container py-20 sm:py-28 lg:py-36">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Together, we</p>
        <h1 id="hero-title" className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">Make a Difference in Folkestone</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/90 sm:text-xl">Folkestone Rotary brings local people together to support charities, young people and community projects across Folkestone.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <ButtonLink href="/join" variant="gold" size="lg">Join Us</ButtonLink>
          <ButtonLink href="/events" variant="white" size="lg">View Events</ButtonLink>
          <ButtonLink href="/funding" variant="outline-light" size="lg">Apply for Funding</ButtonLink>
          <ButtonLink href={donateHref} variant="outline-light" size="lg">Donate</ButtonLink>
        </div>
      </div>
    </section>
  );
}
