import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { PlacesFacade } from '@facades/places.facade';
import { IPlace } from '@interfaces/place';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class PlacesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  total: number = 0;
  places: IPlace[] = [];
  loading: boolean = true;

  readonly places$ = this.placesFacade.placesState$.pipe(
    map((places: IPlace[]) => {
      return places;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private placesFacade: PlacesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.places$.subscribe((places: IPlace[]) => {
        this.places = places;
        this.loading = false;
        this.total = places.length;
      })
    );
  }

  openDialog(place?: IPlace) {
    const ref = this._dialogService.open(ItemDialog, {
      header: place ? ' Editar' : 'Novo' + ' Local',
      width: '450px',
      data: { type: 'place', item: place, types: [] },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((placeObj) => {
        if (placeObj) {
          placeObj._id ? this.updatePlace(placeObj) : this.newPlace(placeObj);
        }
      })
    );
  }

  newPlace(place: IPlace) {
    this.subs.add(
      this.placesFacade.newPlace(place).subscribe({
        next: (place) => {
          this.setTableFilters();
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Local criado com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar esse Local. Tente novamente mais tarde.',
          });
        },
      })
    );
  }

  confirm(place: IPlace) {
    this._confirmationService.confirm({
      message: 'Tem certeza que você deseja exluir esse local?',
      header: 'Excluir',
      accept: () => {
        this.subs.add(
          this.placesFacade.delete(place).subscribe({
            next: () => {
              this.setTableFilters();
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Local excluído.',
                detail: 'O local foi deletado com sucesso!',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível deletar o local. Tente novamente mais tarde.',
              });
            },
          })
        );
      },
    });
  }

  updatePlace(place: IPlace) {
    this.subs.add(
      this.placesFacade.updatePlace(place).subscribe({
        next: (place) => {
          this.setTableFilters();
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Local atualizado com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse Local. Tente novamente mais tarde.',
          });
        },
      })
    );
  }

  setTableFilters() {
    this.places = [...this.places];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
