export function getContrastTextColor(bgColor: string | undefined): string {
  if (!bgColor) {
    return 'var(--closet-text)';
  }

  const rgb = parseInt(bgColor.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness > 128 ? '#1a1512' : '#D4BE98';
}
