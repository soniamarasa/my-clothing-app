import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { PlannedLooksFacade } from '@facades/plannedLooks.facade';
import { PlacesFacade } from '@facades/places.facade';
import { TagsFacade } from '@facades/tags.facade';
import { HandbagsFacade } from '@facades/handbags.facade';
import { ClothesFacade } from '@facades/clothes.facade';
import { LooksFacade } from '@facades/looks.facade';

import { statusLook } from '../../utils/valueTypes';

import { PlannedLookDialog } from '@components/dialogs/planned-look-dialog/planned-look-dialog.component';

import { ILook } from '@interfaces/look';
import { IClothing } from '@interfaces/clothing';
import { IHandbag } from '@interfaces/handbag';
import { IPlace } from '@interfaces/place';
import { IPlannedLook } from '../../interfaces/plannedLook';
import { ITag } from '@interfaces/tag';



@Component({
  selector: 'app-planned-looks',
  templateUrl: './planned-Looks.component.html',
  styleUrls: ['./planned-looks.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class PlannedLooksComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  loading: boolean = true;
  total: number = 0;

  plannedLooksOriginal: IPlannedLook[] = [];
  plannedLooks: IPlannedLook[] = [];

  coats: IClothing[] = []
  status = statusLook;
  places: IPlace[] = [];
  handbags: IHandbag[] = [];
  tags: ITag[] = [];
  looks: ILook[] = [];

  filterPlaces = [];

  @ViewChild('dt1') tablePlannedLooks!: Table;

  readonly plannedLooks$ = this.plannedLooksFacade.plannedLooksState$.pipe(
    map((plannedLooks: IPlannedLook[]) => {
      return plannedLooks;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
    private plannedLooksFacade: PlannedLooksFacade,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private placesFacade: PlacesFacade,
    private tagsFacade: TagsFacade,
    private handbagsFacade: HandbagsFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.plannedLooks$.subscribe((plannedLooks: IPlannedLook[]) => {
        this.plannedLooksOriginal = plannedLooks;
        this.plannedLooks = plannedLooks;
        this.loading = false;
        this.total = plannedLooks.length;
      }),

      this.looksFacade.getLooks().subscribe((looks: ILook[]) => {
        this.looks = looks;
      }),

      this.clothesFacade.getClothes().subscribe((clothes: IClothing[]) => {
        this.coats = clothes.filter((obj) => obj.tag.clothesType === 4);
      }),

      this.placesFacade
        .getPlaces()
        .subscribe((places: IPlace[]) => {
          this.places = places;
        }),

      this.tagsFacade.getTags().subscribe((tags: ITag[]) => {
        this.tags = tags;
      }),

      this.handbagsFacade.getHandbags().subscribe((handbags: IHandbag[]) => {
        this.handbags = handbags;
      })
    );
  }

  getSeverity(status: boolean) {
    if (status) return 'error';
    else return 'success';
  }

  clear(table: Table) {
    table.clear();
    this.filterPlaces = [];
    this.tablePlannedLooks.value = this.plannedLooksOriginal;
  }

  openDialog(plannedLook?: ILook) {
    const ref = this._dialogService.open(PlannedLookDialog, {
      header: plannedLook ? ' Editar' : 'Novo' + 'Look',
      width: '450px',
      data: {
        item: plannedLook,
        looks: this.looks,
        handbags: this.handbags,
        tags: this.tags,
        places: this.places,
      },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((lookObj) => {
        if (lookObj) {
          lookObj._id ? this.updateLook(lookObj) : this.newLook(lookObj);
        }
      })
    );
  }

  newLook(plannedLook: IPlannedLook) {
    this.subs.add(
      this.plannedLooksFacade.newPlannedLook(plannedLook).subscribe({
        next: (plannedLook) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Roupa criada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa roupa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updateLook(plannedLook: IPlannedLook) {
    this.subs.add(
      this.plannedLooksFacade.updatePlannedLook(plannedLook).subscribe({
        next: (plannedLook) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Roupa atualizada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa roupa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  filterPlace(e: any) {
    if (e.value.length) {
      this.plannedLooks = this.plannedLooksOriginal;

      const selectedIds = e.value.map((el: any) => el._id);

      this.plannedLooks = this.plannedLooks.filter((look: any) =>
        look.places.some((place: any) =>
          selectedIds.includes(place._id)
        )
      );
    } else {
      this.plannedLooks = this.plannedLooksOriginal;
    }

    (this.tablePlannedLooks.filters['places'] as any)[0].value = e.value.map(
      (v: any) => [v]
    );

    this.filterPlaces = e.value;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
