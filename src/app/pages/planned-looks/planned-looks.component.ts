import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { openClosetDialog } from '../../utils/closet-dialog';
import { Table } from 'primeng/table';

import { PlannedLooksFacade } from '@facades/plannedLooks.facade';
import { DashboardFacade } from '@facades/dashboard.facade';
import { PlacesFacade } from '@facades/places.facade';
import { HandbagsFacade } from '@facades/handbags.facade';
import { ClothesFacade } from '@facades/clothes.facade';
import { LooksFacade } from '@facades/looks.facade';
import { AccessoriesFacade } from '@facades/accessories.facade';
import { BandanasFacade } from '@facades/bandanas.facade';

import { statusLook } from '../../utils/valueTypes';
import { PlannedLookDialog } from '@components/dialogs/planned-look-dialog/planned-look-dialog.component';
import { getContrastTextColor } from '../../utils/color-contrast';
import {
  buildCalendarDays,
  CalendarDay,
  toDateKey,
} from '../../utils/calendar';
import { isPlannedLookUsed } from '../../utils/planned-look-label';

import { ILook } from '@interfaces/look';
import { IClothing } from '@interfaces/clothing';
import { IHandbag } from '@interfaces/handbag';
import { IPlace } from '@interfaces/place';
import { IPlannedLook } from '@interfaces/plannedLook';
import { IBandana } from '@interfaces/bandana';
import { IAccessory } from '@interfaces/accessory';

type PlannedViewMode = 'calendar' | 'list';

@Component({
  standalone: false,
  selector: 'app-planned-looks',
  templateUrl: './planned-looks.component.html',
  styleUrls: ['./planned-looks.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class PlannedLooksComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  loading = true;
  total = 0;
  statusId = 1;
  viewMode: PlannedViewMode = 'calendar';

  plannedLooksOriginal: IPlannedLook[] = [];
  plannedLooks: IPlannedLook[] = [];
  filterAccessories: IAccessory[] = [];
  filterPlaces: IPlace[] = [];
  coats: IClothing[] = [];
  status = statusLook;
  places: IPlace[] = [];
  handbags: IHandbag[] = [];
  accessories: IAccessory[] = [];
  bandanas: IBandana[] = [];
  looks: ILook[] = [];

  calendarMonth = new Date().getMonth();
  calendarYear = new Date().getFullYear();
  calendarDays: CalendarDay[] = [];
  selectedDate: Date | null = new Date();
  selectedDayLooks: IPlannedLook[] = [];

  readonly viewOptions = [
    { label: 'Calendário', value: 'calendar' as PlannedViewMode, icon: 'pi pi-calendar' },
    { label: 'Lista', value: 'list' as PlannedViewMode, icon: 'pi pi-list' },
  ];

  readonly pageTitle = {
    1: 'Looks Planejados',
    2: 'Looks Usados',
  };

  readonly pageReportTemplate =
    'Mostrando {first} a {last} de {totalRecords} looks';

  @ViewChild('dt1') tablePlannedLooks!: Table;

  readonly plannedLooks$ = this.plannedLooksFacade.plannedLooksState$.pipe(
    map((plannedLooks: IPlannedLook[]) => plannedLooks)
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private _router: Router,
    private plannedLooksFacade: PlannedLooksFacade,
    private dashboardFacade: DashboardFacade,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private placesFacade: PlacesFacade,
    private accessoriesFacade: AccessoriesFacade,
    private bandanasFacade: BandanasFacade,
    private handbagsFacade: HandbagsFacade
  ) {}

  ngOnInit(): void {
    const currentRoute = this._router.url;
    if (currentRoute.includes('/used-looks')) {
      this.statusId = 2;
    } else {
      this.statusId = 1;
    }

    this.plannedLooksFacade.filterPlannedLooks({ status: this.statusId });

    this.subs.add(
      this.plannedLooks$.subscribe((plannedLooks: IPlannedLook[]) => {
        this.plannedLooksOriginal = plannedLooks;
        this.plannedLooks = plannedLooks;
        this.loading = false;
        this.total = plannedLooks.length;
        this.refreshCalendar();
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

  get canMarkAsUsed(): boolean {
    return this.statusId === 1;
  }

  get pageHeading(): string {
    return this.pageTitle[this.statusId as 1 | 2] ?? 'Looks';
  }

  clear(table: Table): void {
    table.clear();
    this.filterPlaces = [];
    this.filterAccessories = [];
    this.tablePlannedLooks.value = this.plannedLooksOriginal;
  }

  openDialog(plannedLook?: IPlannedLook, presetDate?: Date): void {
    const ref = openClosetDialog(this._dialogService, PlannedLookDialog, {
      header: plannedLook ? 'Editar look planejado' : 'Novo look planejado',
      width: '500px',
      data: {
        item: plannedLook,
        presetDate,
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

  newLook(plannedLook: IPlannedLook): void {
    this.subs.add(
      this.plannedLooksFacade.newPlannedLook(plannedLook).subscribe({
        next: () => {
          this.afterMutation('Registro salvo com sucesso!');
        },
        error: () => this.showError(),
      })
    );
  }

  updateLook(plannedLook: IPlannedLook): void {
    this.subs.add(
      this.plannedLooksFacade.updatePlannedLook(plannedLook).subscribe({
        next: () => {
          this.afterMutation('Registro atualizado com sucesso!');
        },
        error: () => this.showError(),
      })
    );
  }

  markAsUsed(plannedLook: IPlannedLook, event?: Event): void {
    event?.stopPropagation();

    if (isPlannedLookUsed(plannedLook)) {
      return;
    }

    const updated: IPlannedLook = {
      ...plannedLook,
      status: this.status[1],
      date: new Date(),
    };

    this.subs.add(
      this.plannedLooksFacade.updatePlannedLook(updated).subscribe({
        next: () => {
          this.afterMutation('Look marcado como usado!');
        },
        error: () => this.showError('Não foi possível marcar o look como usado.'),
      })
    );
  }

  prevCalendarMonth(): void {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear -= 1;
    } else {
      this.calendarMonth -= 1;
    }
    this.refreshCalendar();
  }

  nextCalendarMonth(): void {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear += 1;
    } else {
      this.calendarMonth += 1;
    }
    this.refreshCalendar();
  }

  goToToday(): void {
    const now = new Date();
    this.calendarMonth = now.getMonth();
    this.calendarYear = now.getFullYear();
    this.selectCalendarDay({
      date: now,
      inMonth: true,
      isToday: true,
      looks: [],
    });
    this.refreshCalendar();
  }

  selectCalendarDay(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.selectedDayLooks = day.looks;
  }

  createLookForSelectedDay(): void {
    this.openDialog(undefined, this.selectedDate ?? new Date());
  }

  filterPlace(e: { value: IPlace[] }): void {
    if (e.value.length) {
      this.plannedLooks = this.plannedLooksOriginal;
      const selectedIds = e.value.map((el) => el._id);
      this.plannedLooks = this.plannedLooks.filter(
        (look) => look.place && selectedIds.includes(look.place._id)
      );
    } else {
      this.plannedLooks = this.plannedLooksOriginal;
    }

    this.filterPlaces = e.value;
  }

  filterAccessory(e: { value: IAccessory[] }): void {
    if (e.value.length) {
      this.plannedLooks = this.plannedLooksOriginal;
      const selectedIds = e.value.map((el) => el._id);
      this.plannedLooks = this.plannedLooks.filter((look) =>
        look.accessories?.some((accessory) => selectedIds.includes(accessory._id))
      );
    } else {
      this.plannedLooks = this.plannedLooksOriginal;
    }

    this.filterAccessories = e.value;
  }

  getTextColor(bgColor: string): string {
    return getContrastTextColor(bgColor);
  }

  darkenColor(hex: string, percent: number): string {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, r - (r * percent) / 100);
    const newG = Math.max(0, g - (g * percent) / 100);
    const newB = Math.max(0, b - (b * percent) / 100);

    return (
      '#' +
      [newR, newG, newB]
        .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  filterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value || '';
    this.tablePlannedLooks.filterGlobal(filterValue, 'contains');
  }

  setTableFilters(): void {
    this.plannedLooks = [...this.plannedLooks];
    this.refreshCalendar();
  }

  private refreshCalendar(): void {
    this.calendarDays = buildCalendarDays(
      this.calendarMonth,
      this.calendarYear,
      this.plannedLooks
    );

    const selected = this.selectedDate ?? new Date();
    const key = toDateKey(selected);
    const day =
      this.calendarDays.find((item) => toDateKey(item.date) === key) ??
      this.calendarDays.find((item) => item.isToday);

    if (day) {
      this.selectedDate = day.date;
      this.selectedDayLooks = day.looks;
    }
  }

  private afterMutation(summary: string): void {
    this.setTableFilters();
    this.plannedLooksFacade.refresh();
    this.dashboardFacade.refresh();
    this._messageService.add({
      key: 'notification',
      severity: 'success',
      summary,
    });
  }

  private showError(
    detail = 'Tente novamente mais tarde.'
  ): void {
    this._messageService.add({
      key: 'notification',
      severity: 'danger',
      summary: 'Houve um problema!',
      detail,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
