export default function Loading() {
  return <div className="container py-24" role="status" aria-live="polite"><div className="h-8 w-1/3 animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none" /><div className="mt-6 h-40 animate-pulse rounded-card bg-slate-100 motion-reduce:animate-none" /><span className="sr-only">Loading…</span></div>;
}
