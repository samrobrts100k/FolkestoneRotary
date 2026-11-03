import type { Status } from "./types";
import { finishesAt } from "./event-time";

type Publishable = { status: Status; publish_at?: string | null };

export function isVisibleAt(item: Publishable, now: Date): boolean {
  if (item.status === "published") return true;
  if (item.status === "scheduled" && item.publish_at) return new Date(item.publish_at) <= now;
  return false;
}
/** Public when published, or scheduled with a publish time that has passed. Safe to pass to Array.filter. */
export const isVisible = (item: Publishable) => isVisibleAt(item, new Date());

/** An event is upcoming until it has finished: its end time, the end of the day for all-day events, otherwise its start. */
export const isUpcoming = (e: { starts_at: string; ends_at?: string | null }, now = Date.now()) => finishesAt(e) >= now;
