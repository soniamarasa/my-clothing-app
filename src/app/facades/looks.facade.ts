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

import { IGetLooksParams, LooksService } from '@services/looks.service';

import { LooksStore } from '@stores/looks.store';

import { ILook } from '@root/src/app/interfaces/look';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class LooksFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getLooks({ ...this._filter.value })));

  readonly looksState$ = combineLatest([
    this.looksStore.looksState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private looksService: LooksService,
    private looksStore: LooksStore
  ) {}

  getLooks(queryParams?: IGetLooksParams) {
    return this.looksService
      .getLooks(queryParams)
      .pipe(tap((looks) => this.looksStore.updateLooks(looks)));
  }

  getLookById(id: ILook['_id']) {
    return this.looksService
      .getLookById(id)
      .pipe(tap((look) => this.looksStore.updateLook(look)));
  }

  newLook(look: ILook) {
    return this.looksService
      .newLook(look)
      .pipe(tap((look) => this.looksStore.updateLook(look)));
  }

  updateLook(look: ILook) {
    return this.looksService
      .updateLook(look)
      .pipe(tap((look) => this.looksStore.updateLook(look)));
  }

  filterLooks(filter: IGetLooksParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
