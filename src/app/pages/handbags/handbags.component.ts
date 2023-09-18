import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { HandbagsFacade } from '@facades/handbags.facade';
import { IHandbag } from '@interfaces/handbag';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-handbags',
  templateUrl: './handbags.component.html',
  styleUrls: ['./handbags.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class HandbagsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  total: number = 0;
  ref?: DynamicDialogRef;

  handbags: IHandbag[] = [];

  loading: boolean = true;

  readonly handbags$ = this.handbagsFacade.handbagsState$.pipe(
    map((handbags: IHandbag[]) => {
      return handbags;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private handbagsFacade: HandbagsFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.handbags$.subscribe((handbags: IHandbag[]) => {
        this.handbags = handbags;
        this.loading = false;
        this.total = handbags.length;
      })
    );
  }

  openDialog(handbags?: IHandbag) {
    const ref = this._dialogService.open(ItemDialog, {
      header: handbags ? ' Editar' : 'Nova' + ' bolsa',
      width: '450px',
      data: { type: 'handbags', item: handbags},
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((handbagsObj) => {
        if (handbagsObj) {
          handbagsObj._id
            ? this.updateHandbag(handbagsObj)
            : this.newHandbag(handbagsObj);
        }
      })
    );
  }

  newHandbag(handbags: IHandbag) {
    this.subs.add(
      this.handbagsFacade.newHandbag(handbags).subscribe({
        next: (handbags) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Bolsa criada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa bolsa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updateHandbag(handbags: IHandbag) {
    this.subs.add(
      this.handbagsFacade.updateHandbag(handbags).subscribe({
        next: (handbags) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Bolsa atualizada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa bolsa. Tente novamente mais tarde.',
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
