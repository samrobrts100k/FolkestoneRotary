import { cn } from "@/lib/utils";
export const Badge = ({ className, ...p }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("inline-flex items-center rounded-full bg-gold-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy", className)} {...p} />
);
