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
  IGetAccessoriesParams,
  AccessoriesService,
} from '@services/accessories.service';

import { AccessoriesStore } from '@stores/accessories.store';

import { IAccessory } from '@root/src/app/interfaces/accessory';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class AccessoriesFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getAccessories({ ...this._filter.value })));

  readonly accessoriesState$ = combineLatest([
    this.accessoriesStore.accessoriesState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private accessoriesService: AccessoriesService,
    private accessoriesStore: AccessoriesStore
  ) {}

  getAccessories(queryParams?: IGetAccessoriesParams) {
    return this.accessoriesService
      .getAccessories(queryParams)
      .pipe(
        tap((accessories) =>
          this.accessoriesStore.updateAccessories(accessories)
        )
      );
  }

  getAccessoryById(id: IAccessory['_id']) {
    return this.accessoriesService
      .getAccessoryById(id)
      .pipe(
        tap((accessory) => this.accessoriesStore.updateAccessory(accessory))
      );
  }

  newAccessory(accessory: IAccessory) {
    return this.accessoriesService
      .newAccessory(accessory)
      .pipe(
        tap((accessory) => this.accessoriesStore.updateAccessory(accessory))
      );
  }

  updateAccessory(accessory: IAccessory) {
    return this.accessoriesService
      .updateAccessory(accessory)
      .pipe(
        tap((accessory) => this.accessoriesStore.updateAccessory(accessory))
      );
  }

  filterAccessories(filter: IGetAccessoriesParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
