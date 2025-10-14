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
  IGetHandbagsParams,
  HandbagsService,
} from '@services/handbags.service';

import { HandbagsStore } from '@stores/handbags.store';

import { IHandbag } from '@root/src/app/interfaces/handbag';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class HandbagsFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getHandbags({ ...this._filter.value })));

  readonly handbagsState$ = combineLatest([
    this.handbagsStore.handbagsState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true }),
  );

  constructor(
    private handbagsService: HandbagsService,
    private handbagsStore: HandbagsStore,
  ) {}

  getHandbags(queryParams?: IGetHandbagsParams) {
    return this.handbagsService
      .getHandbags(queryParams)
      .pipe(tap((handbags) => this.handbagsStore.updateHandbags(handbags)));
  }

  getHandbagById(id: IHandbag['_id']) {
    return this.handbagsService
      .getHandbagById(id)
      .pipe(tap((handbag) => this.handbagsStore.updateHandbag(handbag)));
  }

  newHandbag(handbag: IHandbag) {
    return this.handbagsService
      .newHandbag(handbag)
      .pipe(tap((handbag) => this.handbagsStore.updateHandbag(handbag)));
  }

  updateHandbag(handbag: IHandbag) {
    return this.handbagsService
      .updateHandbag(handbag)
      .pipe(tap((handbag) => this.handbagsStore.updateHandbag(handbag)));
  }

  delete(handbag: IHandbag) {
    return this.handbagsService
      .delete(handbag)
      .pipe(tap(() => this.handbagsStore.deleteHandbag(handbag)));
  }

  filterHandbags(filter: IGetHandbagsParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
