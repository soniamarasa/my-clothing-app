import { IPlannedLook } from '@interfaces/plannedLook';

export interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  looks: IPlannedLook[];
}

const DAY_MS = 86_400_000;

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function groupPlannedLooksByDate(
  plannedLooks: IPlannedLook[]
): Map<string, IPlannedLook[]> {
  const map = new Map<string, IPlannedLook[]>();

  for (const plannedLook of plannedLooks) {
    const date = new Date(plannedLook.date);
    const key = toDateKey(date);
    const bucket = map.get(key) ?? [];
    bucket.push(plannedLook);
    map.set(key, bucket);
  }

  for (const [key, items] of map) {
    items.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    map.set(key, items);
  }

  return map;
}

export function buildCalendarDays(
  month: number,
  year: number,
  plannedLooks: IPlannedLook[]
): CalendarDay[] {
  const grouped = groupPlannedLooksByDate(plannedLooks);
  const todayKey = toDateKey(new Date());
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart.getTime() + i * DAY_MS);
    const key = toDateKey(date);

    days.push({
      date,
      inMonth: date.getMonth() === month,
      isToday: key === todayKey,
      looks: grouped.get(key) ?? [],
    });
  }

  return days;
}

export function formatMonthLabel(month: number, year: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1));
}
