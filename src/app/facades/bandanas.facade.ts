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
  IGetBandanasParams,
  BandanasService,
} from '@services/bandanas.service';

import { BandanasStore } from '@stores/bandanas.store';

import { IBandana } from '@root/src/app/interfaces/bandana';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class BandanasFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getBandanas({ ...this._filter.value })));

  readonly bandanasState$ = combineLatest([
    this.bandanasStore.bandanasState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true }),
  );

  constructor(
    private bandanasService: BandanasService,
    private bandanasStore: BandanasStore,
  ) {}

  getBandanas(queryParams?: IGetBandanasParams) {
    return this.bandanasService
      .getBandanas(queryParams)
      .pipe(tap((bandanas) => this.bandanasStore.updateBandanas(bandanas)));
  }

  getBandanaById(id: IBandana['_id']) {
    return this.bandanasService
      .getBandanaById(id)
      .pipe(tap((bandana) => this.bandanasStore.updateBandana(bandana)));
  }

  newBandana(bandana: IBandana) {
    return this.bandanasService
      .newBandana(bandana)
      .pipe(tap((bandana) => this.bandanasStore.updateBandana(bandana)));
  }

  updateBandana(bandana: IBandana) {
    return this.bandanasService
      .updateBandana(bandana)
      .pipe(tap((bandana) => this.bandanasStore.updateBandana(bandana)));
  }

  delete(bandana: IBandana) {
    return this.bandanasService
      .delete(bandana)
      .pipe(tap((bandana) => this.bandanasStore.deleteBandana(bandana)));
  }

  filterBandanas(filter: IGetBandanasParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
