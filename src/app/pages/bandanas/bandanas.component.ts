import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BandanasFacade } from '@facades/bandanas.facade';
import { IBandana } from '@interfaces/bandana';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-bandanas',
  templateUrl: './bandanas.component.html',
  styleUrls: ['./bandanas.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class BandanasComponent implements OnInit, OnDestroy {
  total: number = 0;
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  bandanas: IBandana[] = [];
  loading: boolean = true;

  readonly bandanas$ = this.bandanasFacade.bandanasState$.pipe(
    map((bandanas: IBandana[]) => {
      return bandanas;
    }),
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private bandanasFacade: BandanasFacade,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.bandanas$.subscribe((bandanas: IBandana[]) => {
        this.bandanas = bandanas;
        this.loading = false;
        this.total = bandanas.length;
      }),
    );
  }

  openDialog(bandana?: IBandana) {
    const ref = this._dialogService.open(ItemDialog, {
      header: bandana ? 'Editar' : 'Novo',
      width: '450px',
      data: { type: 'bandana', item: bandana },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((bandanaObj) => {
        if (bandanaObj) {
          bandanaObj._id
            ? this.updateBandana(bandanaObj)
            : this.newBandana(bandanaObj);
        }
      }),
    );
  }

  newBandana(bandana: IBandana) {
    this.subs.add(
      this.bandanasFacade.newBandana(bandana).subscribe({
        next: (bandana) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Bandana criada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa bandana. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  updateBandana(bandana: IBandana) {
    this.subs.add(
      this.bandanasFacade.updateBandana(bandana).subscribe({
        next: (bandana) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Bandana atualizada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa bandana. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  confirm(bandana: IBandana) {
    this._confirmationService.confirm({
      message: 'Tem certeza que você deseja exluir esse item?',
      header: 'Excluir',
      accept: () => {
        this.subs.add(
          this.bandanasFacade.delete(bandana).subscribe({
            next: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Item excluído.',
                detail: 'O item foi deletado com sucesso!',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível deletar o item. Tente novamente mais tarde.',
              });
            },
          }),
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
