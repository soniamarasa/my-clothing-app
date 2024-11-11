import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ShoesFacade } from '@facades/shoes.facade';
import { IShoe } from '@interfaces/shoe';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-shoes',
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class ShoesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  total: number = 0;
  ref?: DynamicDialogRef;
  shoes: IShoe[] = [];
  loading: boolean = true;

  readonly shoes$ = this.shoesFacade.shoesState$.pipe(
    map((shoes: IShoe[]) => {
      return shoes;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private shoesFacade: ShoesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.shoes$.subscribe((shoes: IShoe[]) => {
        this.shoes = shoes;
        this.loading = false;
        this.total = shoes.length;
      })
    );
  }

  openDialog(shoe?: IShoe) {
    const ref = this._dialogService.open(ItemDialog, {
      header: shoe ? ' Editar' : 'Novo' + ' sapato',
      width: '450px',
      data: { type: 'shoe', item: shoe, category: 'Sapato' },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((shoeObj) => {
        if (shoeObj) {
          shoeObj._id
            ? this.updateShoe(shoeObj)
            : this.newShoe(shoeObj);
        }
      })
    );
  }

  newShoe(shoe: IShoe) {
    this.subs.add(
      this.shoesFacade.newShoe(shoe).subscribe({
        next: (shoe) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Sapato criado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar esse sapato. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updateShoe(shoe: IShoe) {
    this.subs.add(
      this.shoesFacade.updateShoe(shoe).subscribe({
        next: (shoe) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Sapato atualizado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse sapato. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }



  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
