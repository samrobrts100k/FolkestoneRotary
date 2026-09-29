"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container py-24 text-center" role="alert">
      <h1 className="text-3xl">Something went wrong</h1>
      <p className="mt-3 text-slate-700">Sorry about that. Please try again.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
