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
  IGetDashboardParams,
  DashboardService,
} from '@services/dashboard.service';

import { DashboardStore } from '@stores/dashboard.store';

import { IDashboard } from '@root/src/app/interfaces/dashboard';

const REFRESH_INTERVAL = 600000;

const sameDashboardFilter = (
  previous: IGetDashboardParams,
  current: IGetDashboardParams
) => previous.year === current.year;

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<IGetDashboardParams>({
    year: new Date().getFullYear().toString(),
  });
  readonly filter$ = this._filter
    .asObservable()
    .pipe(distinctUntilChanged(sameDashboardFilter));

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(
    switchMap(([filter]) => this.getDashboard({ ...filter }))
  );

  readonly dashboardState$ = combineLatest([
    this.dashboardStore.dashboardState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly nextPlannedLook$ = this.dashboardService
    .getNextPlannedLook()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(
    private dashboardService: DashboardService,
    private dashboardStore: DashboardStore
  ) {}

  getDashboard(queryParams?: IGetDashboardParams) {
    return this.dashboardService
      .getDashboard(queryParams)
      .pipe(tap((dashboard) => this.dashboardStore.updateDashboard(dashboard)));
  }

  getNextPlannedLook() {
    return this.nextPlannedLook$;
  }

  filter(filter: IGetDashboardParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }
}
