import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AccessoriesFacade } from '@facades/accessories.facade';
import { IAccessory } from '@interfaces/accessory';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss'],
  providers: [DialogService, ConfirmationService],
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
    const ref = this._dialogService.open(ItemDialog, {
      header: accessory ? ' Editar' : 'Novo' + ' acessório',
      width: '450px',
      data: { type: 'accessory', item: accessory, category: 'Acessório' },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((accessoryObj) => {
        if (accessoryObj) {
          accessoryObj._id
            ? this.updateAceIAccessory(accessoryObj)
            : this.newAceIAccessory(accessoryObj);
        }
      })
    );
  }

  newAceIAccessory(accessory: IAccessory) {
    this.subs.add(
      this.accessoriesFacade.newAccessory(accessory).subscribe({
        next: (accessory) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Acessório criado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar esse acessório. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updateAceIAccessory(accessory: IAccessory) {
    this.subs.add(
      this.accessoriesFacade.updateAccessory(accessory).subscribe({
        next: (accessory) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Acessório atualizado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse acessório. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
