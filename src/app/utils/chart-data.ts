import { IDashboardItem } from '../interfaces/dashboard';

export const CHART_OTHERS_LABEL = 'Outros';

export function sortByCountDesc(items: IDashboardItem[]): IDashboardItem[] {
  return [...items].sort((a, b) => b.count - a.count);
}

export function sumUsageCounts(items: IDashboardItem[]): number {
  return items.reduce((sum, item) => sum + (item.count > 0 ? item.count : 0), 0);
}

export function getTopItemName(items: IDashboardItem[]): string | null {
  const sorted = sortByCountDesc(items);
  return sorted[0]?.count ? sorted[0].name : null;
}

export function topNWithOthers(
  items: IDashboardItem[],
  limit: number
): IDashboardItem[] {
  const sorted = sortByCountDesc(items).filter((item) => item.count > 0);
  if (sorted.length <= limit) {
    return sorted;
  }

  const top = sorted.slice(0, limit);
  const othersCount = sorted.slice(limit).reduce((sum, item) => sum + item.count, 0);

  if (othersCount <= 0) {
    return top;
  }

  return [
    ...top,
    {
      id: '__others__',
      name: CHART_OTHERS_LABEL,
      count: othersCount,
    },
  ];
}

export function topN(items: IDashboardItem[], limit: number): IDashboardItem[] {
  return sortByCountDesc(items)
    .filter((item) => item.count > 0)
    .slice(0, limit);
}
