import { IPlannedLook } from '@interfaces/plannedLook';
import { ILook } from '@interfaces/look';

export function getLookOutfitLabel(look: ILook | null | undefined): string {
  if (!look) {
    return 'Look';
  }

  if (look.garb?.name) {
    return look.garb.name;
  }

  const top = look.top?.name;
  const bottom = look.bottom?.name;

  if (top && bottom) {
    return `${top} + ${bottom}`;
  }

  return top || bottom || 'Look';
}

export function getPlannedLookSummary(plannedLook: IPlannedLook): string {
  const outfit = getLookOutfitLabel(plannedLook.look);
  const shoe = plannedLook.look?.shoe?.name;

  return shoe ? `${outfit} · ${shoe}` : outfit;
}

export function isPlannedLookUsed(plannedLook: IPlannedLook): boolean {
  const status = plannedLook.status as { id?: number; name?: string } | string;

  if (typeof status === 'object' && status?.id != null) {
    return status.id === 2;
  }

  return status === 'Usado';
}
