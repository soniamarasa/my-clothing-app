import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import {
  IGetPlannedLooksParams,
  PlannedLooksService,
} from '@services/plannedLooks.service';

import { PlannedLooksStore } from '@stores/plannedLooks.store';

import { IPlannedLook } from '@root/src/app/interfaces/plannedLook';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class PlannedLooksFacade {
  year = new Date().getFullYear().toString();

  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getPlannedLooks({ year:this.year, ...this._filter.value })));

  readonly plannedLooksState$ = combineLatest([
    this.plannedLooksStore.plannedLooksState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private plannedLooksService: PlannedLooksService,
    private plannedLooksStore: PlannedLooksStore
  ) {}

  getPlannedLooks(queryParams?: IGetPlannedLooksParams) {
    return this.plannedLooksService
      .getPlannedLooks(queryParams)
      .pipe(
        tap((plannedLooks) =>
          this.plannedLooksStore.updatePlannedLooks(plannedLooks)
        )
      );
  }

  getPlannedLookById(id: IPlannedLook['_id']) {
    return this.plannedLooksService
      .getPlannedLookById(id)
      .pipe(
        tap((plannedLook) =>
          this.plannedLooksStore.updatePlannedLook(plannedLook)
        )
      );
  }

  newPlannedLook(plannedLook: IPlannedLook) {
    return this.plannedLooksService
      .newPlannedLook(plannedLook)
      .pipe(
        tap((plannedLook) =>
          this.plannedLooksStore.updatePlannedLook(plannedLook)
        )
      );
  }

  updatePlannedLook(plannedLook: IPlannedLook) {
    return this.plannedLooksService
      .updatePlannedLook(plannedLook)
      .pipe(
        tap((plannedLook) =>
          this.plannedLooksStore.updatePlannedLook(plannedLook)
        )
      );
  }

  filterPlannedLooks(filter: IGetPlannedLooksParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
