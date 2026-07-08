import { Type } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

const CLOSET_DIALOG_DEFAULTS: Partial<DynamicDialogConfig> = {
  closable: true,
  closeOnEscape: true,
  modal: true,
  dismissableMask: true,
  showHeader: true,
  closeAriaLabel: 'Fechar',
  styleClass: 'closet-dialog',
};

export function openClosetDialog(
  dialogService: DialogService,
  componentType: Type<unknown>,
  config: DynamicDialogConfig = {}
): DynamicDialogRef | null {
  const styleClass = [CLOSET_DIALOG_DEFAULTS.styleClass, config.styleClass]
    .filter(Boolean)
    .join(' ');

  return dialogService.open(componentType, {
    ...CLOSET_DIALOG_DEFAULTS,
    ...config,
    styleClass,
  });
}
