"use client";
import { useEffect, useState } from "react";

export function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => { const tick = () => setLeft(new Date(to).getTime() - Date.now()); tick(); const i = setInterval(tick, 1000); return () => clearInterval(i); }, [to]);
  if (left === null || left <= 0) return null;
  const parts = [["Days", Math.floor(left / 864e5)], ["Hours", Math.floor(left / 36e5) % 24], ["Minutes", Math.floor(left / 6e4) % 60], ["Seconds", Math.floor(left / 1e3) % 60]] as const;
  return (
    <div role="timer" aria-label="Time until the event starts" className="flex gap-3">
      {parts.map(([l, v]) => <div key={l} className="min-w-16 rounded-xl bg-white/15 px-3 py-2 text-center backdrop-blur"><div className="text-2xl font-extrabold tabular-nums">{v}</div><div className="text-xs uppercase tracking-wide">{l}</div></div>)}
    </div>
  );
}
