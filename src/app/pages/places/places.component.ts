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
    private placesFacade: PlacesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.places$.subscribe((places: IPlace[]) => {
        this.places = places;
        this.loading = false;
      })
    );
  }

  openDialog(place?: IPlace) {
    const ref = this._dialogService.open(ItemDialog, {
      header: place ? ' Editar' : 'Novo' + ' Local',
      width: '400px',
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
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Local criado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar esse Local. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updatePlace(place: IPlace) {
    this.subs.add(
      this.placesFacade.updatePlace(place).subscribe({
        next: (place) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Local atualizado com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse Local. Tente novamente mais tarde.',
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
