import type { Status } from "./types";

type Publishable = { status: Status; publish_at?: string | null };

export function isVisibleAt(item: Publishable, now: Date): boolean {
  if (item.status === "published") return true;
  if (item.status === "scheduled" && item.publish_at) return new Date(item.publish_at) <= now;
  return false;
}
/** Public when published, or scheduled with a publish time that has passed. Safe to pass to Array.filter. */
export const isVisible = (item: Publishable) => isVisibleAt(item, new Date());

/** An event is upcoming until it has finished (or started, when it has no end time). */
export const isUpcoming = (e: { starts_at: string; ends_at?: string | null }, now = Date.now()) => new Date(e.ends_at ?? e.starts_at).getTime() >= now;
