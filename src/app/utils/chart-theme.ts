import { colors } from './colors';

export const CHART_TEXT = '#D4BE98';
export const CHART_TEXT_MUTED = 'rgba(212, 190, 152, 0.72)';
export const CHART_GRID = 'rgba(159, 159, 159, 0.28)';
export const CHART_TOOLTIP_BG = '#312F2E';
export const CHART_BODY_HEIGHT = '22rem';
export const CHART_VIEW_HEIGHT = 300;

export const CHART_ACCESSIBILITY_OPTIONS = {
  accessibility: {
    enabled: false,
  },
} as const;

export function chartFontStyle(color = CHART_TEXT) {
  return {
    fontFamily: 'DM Mono, monospace',
    color,
  };
}

export function buildSeriesColors(
  count: number,
  accent?: string
): string[] {
  if (!count) {
    return [];
  }

  if (accent) {
    return Array.from({ length: count }, (_, index) => {
      const opacity =
        count === 1
          ? 1
          : Math.max(0.35, 1 - (index / (count - 1)) * 0.65);
      return withAlpha(accent, opacity);
    });
  }

  return Array.from(
    { length: count },
    (_, index) => colors[index % colors.length]
  );
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return hex;
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}
