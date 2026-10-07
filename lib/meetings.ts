/** Lunch meetings: the 2nd and 4th Monday of each month, 12:15 to 12:45. */
export const MEETING = { startHour: 12, startMinute: 15, minutes: 30, weekday: 1, nth: [2, 4] as const };

const nthWeekday = (year: number, month: number, weekday: number, n: number) => {
  const first = new Date(year, month, 1, MEETING.startHour, MEETING.startMinute, 0, 0);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7, MEETING.startHour, MEETING.startMinute, 0, 0);
};

/** The next `count` meetings that have not finished yet (device time zone, which is the UK for visitors). */
export function nextMeetings(count: number, from = new Date()): Date[] {
  const out: Date[] = [];
  for (let m = 0; out.length < count && m < 14; m++) {
    const d = new Date(from.getFullYear(), from.getMonth() + m, 1);
    for (const n of MEETING.nth) {
      const when = nthWeekday(d.getFullYear(), d.getMonth(), MEETING.weekday, n);
      if (when.getTime() + MEETING.minutes * 60000 > from.getTime() && out.length < count) out.push(when);
    }
  }
  return out;
}
export const meetingEnd = (d: Date) => new Date(d.getTime() + MEETING.minutes * 60000);
