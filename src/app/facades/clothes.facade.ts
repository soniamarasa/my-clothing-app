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

import { IGetClothesParams, ClothesService } from '@services/clothes.service';

import { ClothesStore } from '@stores/clothes.store';

import { IClothing } from '@root/src/app/interfaces/clothing';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class ClothesFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getClothes({ ...this._filter.value })));

  readonly clothesState$ = combineLatest([
    this.clothesStore.clothesState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private clothesService: ClothesService,
    private clothesStore: ClothesStore
  ) {}

  getClothes(queryParams?: IGetClothesParams) {
    return this.clothesService
      .getClothes(queryParams)
      .pipe(tap((clothes) => this.clothesStore.updateClothes(clothes)));
  }

  getClothingById(id: IClothing['_id']) {
    return this.clothesService
      .getClothingById(id)
      .pipe(tap((clothing) => this.clothesStore.updateClothing(clothing)));
  }

  newClothing(clothing: IClothing) {
    return this.clothesService
      .newClothing(clothing)
      .pipe(tap((clothing) => this.clothesStore.updateClothing(clothing)));
  }

  updateClothing(id: IClothing['_id'], body: IClothing) {
    return this.clothesService
      .updateClothing(id, body)
      .pipe(tap((clothing) => this.clothesStore.updateClothing(clothing)));
  }

  filterClothes(filter: IGetClothesParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
