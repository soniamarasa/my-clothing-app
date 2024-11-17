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
import { AccessoriesFacade } from '../../facades/accessories.facade';
import { BandanasFacade } from '../../facades/bandanas.facade';
import { IBandana } from '../../interfaces/bandana';
import { IAccessory } from '../../interfaces/accessory';
import { ActivatedRoute, Router } from '@angular/router';

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
  statusId: number = 1;

  plannedLooksOriginal: IPlannedLook[] = [];
  plannedLooks: IPlannedLook[] = [];

  filterAccessories = [];

  coats: IClothing[] = [];
  status = statusLook;
  places: IPlace[] = [];
  handbags: IHandbag[] = [];
  accessories: IAccessory[] = [];
  bandanas: IBandana[] = [];
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
    private _router: Router,
    private _route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private plannedLooksFacade: PlannedLooksFacade,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private placesFacade: PlacesFacade,
    private accessoriesFacade: AccessoriesFacade,
    private bandanasFacade: BandanasFacade,
    private handbagsFacade: HandbagsFacade
  ) {}

  ngOnInit(): void {
  
    const currentRoute = this._router.url;
    if (currentRoute.includes('/planned-looks')) {
      this.statusId = 1;
    } else if (currentRoute.includes('/used-looks')) {
      this.statusId = 2;
    }

    this.plannedLooksFacade.filterPlannedLooks({ status: this.statusId });

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

      this.placesFacade.getPlaces().subscribe((places: IPlace[]) => {
        this.places = places;
      }),

      this.accessoriesFacade
        .getAccessories()
        .subscribe((accessories: IAccessory[]) => {
          this.accessories = accessories;
        }),

      this.bandanasFacade.getBandanas().subscribe((bandanas: IBandana[]) => {
        this.bandanas = bandanas;
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
    this.filterAccessories = [];
    this.tablePlannedLooks.value = this.plannedLooksOriginal;
  }

  openDialog(plannedLook?: ILook) {
    const ref = this._dialogService.open(PlannedLookDialog, {
      header: plannedLook ? ' Editar' : 'Novo',
      width: '500px',
      data: {
        item: plannedLook,
        looks: this.looks,
        handbags: this.handbags,
        bandanas: this.bandanas,
        accessories: this.accessories,
        places: this.places,
        statusId: this.statusId,
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
        look.places.some((place: any) => selectedIds.includes(place._id))
      );
    } else {
      this.plannedLooks = this.plannedLooksOriginal;
    }

    (this.tablePlannedLooks.filters['places'] as any)[0].value = e.value.map(
      (v: any) => [v]
    );

    this.filterPlaces = e.value;
  }

  filterAccessory(e: any) {
    if (e.value.length) {
      this.plannedLooks = this.plannedLooksOriginal;

      const selectedIds = e.value.map((el: any) => el._id);

      this.looks = this.looks.filter((look: any) =>
        look.accessories.some((accessory: any) =>
          selectedIds.includes(accessory._id)
        )
      );
    } else {
      this.plannedLooks = this.plannedLooksOriginal;
    }

    (this.tablePlannedLooks.filters['accessories'] as any)[0].value =
      e.value.map((v: any) => [v]);

    this.filterAccessories = e.value;
  }

  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }

  darkenColor(hex: string, percent: number): string {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, r - (r * percent) / 100);
    const newG = Math.max(0, g - (g * percent) / 100);
    const newB = Math.max(0, b - (b * percent) / 100);

    const darkenedColor =
      '#' +
      [newR, newG, newB]
        .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
        .join('');

    return darkenedColor;
  }

  filterGlobal(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value || '';
    this.tablePlannedLooks.filterGlobal(filterValue, 'contains');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
