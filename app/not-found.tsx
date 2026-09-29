import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="font-bold uppercase tracking-widest text-rotary">404</p>
      <h1 className="mt-2 text-4xl">We can&apos;t find that page</h1>
      <p className="mt-3 text-slate-700">It may have moved or no longer exist.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink href="/">Go home</ButtonLink><ButtonLink href="/events" variant="outline">See events</ButtonLink></div>
    </div>
  );
}
