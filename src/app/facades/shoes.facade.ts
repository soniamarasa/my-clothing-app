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

import { IGetShoesParams, ShoesService } from '@services/shoes.service';

import { ShoesStore } from '@stores/shoes.store';

import { IShoe } from '@root/src/app/interfaces/shoe';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class ShoesFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getShoes({ ...this._filter.value })));

  readonly shoesState$ = combineLatest([
    this.shoesStore.shoesState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private shoesService: ShoesService,
    private shoesStore: ShoesStore
  ) {}

  getShoes(queryParams?: IGetShoesParams) {
    return this.shoesService
      .getShoes(queryParams)
      .pipe(tap((shoes) => this.shoesStore.updateShoes(shoes)));
  }

  getShoeById(id: IShoe['_id']) {
    return this.shoesService
      .getShoeById(id)
      .pipe(tap((shoe) => this.shoesStore.updateShoe(shoe)));
  }

  newShoe(shoe: IShoe) {
    return this.shoesService
      .newShoe(shoe)
      .pipe(tap((shoe) => this.shoesStore.updateShoe(shoe)));
  }

  updateShoe(id: IShoe['_id'], body: IShoe) {
    return this.shoesService
      .updateShoe(id, body)
      .pipe(tap((shoe) => this.shoesStore.updateShoe(shoe)));
  }

  filterShoes(filter: IGetShoesParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
