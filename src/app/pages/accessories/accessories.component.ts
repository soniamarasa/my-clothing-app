import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { openClosetDialog } from '../../utils/closet-dialog';
import { getContrastTextColor } from '../../utils/color-contrast';

import { AccessoriesFacade } from '@facades/accessories.facade';
import { IAccessory } from '@interfaces/accessory';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  standalone: false,
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss'],
  providers: [ConfirmationService],
})
export class AccessoriesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  total: number = 0;
  accessories: IAccessory[] = [];
  loading: boolean = true;

  readonly accessories$ = this.accessoriesFacade.accessoriesState$.pipe(
    map((accessories: IAccessory[]) => {
      return accessories;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private accessoriesFacade: AccessoriesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.accessories$.subscribe((accessories: IAccessory[]) => {
        this.accessories = accessories;
        this.loading = false;
        this.total = accessories.length;
      })
    );
  }

  openDialog(accessory?: IAccessory) {
    const ref = openClosetDialog(this._dialogService, ItemDialog, {
      header: accessory ? 'Editar acessório' : 'Novo acessório',
      width: '450px',
      data: { type: 'accessory', item: accessory, category: 'Acessório' },
      appendTo: 'body',
    });

    if (!ref) {
      return;
    }

    this.subs.add(
      ref.onClose.subscribe((accessoryObj) => {
        if (accessoryObj) {
          accessoryObj._id
            ? this.updateAccessory(accessoryObj)
            : this.newAccessory(accessoryObj);
        }
      })
    );
  }

  newAccessory(accessory: IAccessory) {
    this.subs.add(
      this.accessoriesFacade.newAccessory(accessory).subscribe({
        next: (accessory) => {
          this.setTableFilters();
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Acessório criado com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'danger',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar esse acessório. Tente novamente mais tarde.',
          });
        },
      })
    );
  }

  updateAccessory(accessory: IAccessory) {
    this.subs.add(
      this.accessoriesFacade.updateAccessory(accessory).subscribe({
        next: (accessory) => {
          this.setTableFilters();
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Acessório atualizado com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'danger',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse acessório. Tente novamente mais tarde.',
          });
        },
      })
    );
  }

  confirm(accessory: IAccessory) {
    this._confirmationService.confirm({
      message: 'Tem certeza que você deseja exluir esse acessório?',
      header: 'Excluir',
      accept: () => {
        this.subs.add(
          this.accessoriesFacade.deleteAccessory(accessory).subscribe({
            next: () => {
              this.setTableFilters();
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Acessório excluído.',
                detail: 'O acessório foi deletado com sucesso!',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'danger',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível deletar o acessório. Tente novamente mais tarde.',
              });
            },
          })
        );
      },
    });
  }

  getTextColor(bgColor: string | undefined): string {
    return getContrastTextColor(bgColor);
  }

  setTableFilters() {
    this.accessories = [...this.accessories];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
