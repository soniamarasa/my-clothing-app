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

import { IGetPlacesParams, PlacesService } from '@services/places.service';

import { PlacesStore } from '@stores/places.store';

import { IPlace } from '@root/src/app/interfaces/place';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class PlacesFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getPlaces({ ...this._filter.value })));

  readonly placesState$ = combineLatest([
    this.placesStore.placesState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true }),
  );

  constructor(
    private placesService: PlacesService,
    private placesStore: PlacesStore,
  ) {}

  getPlaces(queryParams?: IGetPlacesParams) {
    return this.placesService
      .getPlaces(queryParams)
      .pipe(tap((places) => this.placesStore.updatePlaces(places)));
  }

  getPlaceById(id: IPlace['_id']) {
    return this.placesService
      .getPlaceById(id)
      .pipe(tap((place) => this.placesStore.updatePlace(place)));
  }

  newPlace(place: IPlace) {
    return this.placesService
      .newPlace(place)
      .pipe(tap((place) => this.placesStore.updatePlace(place)));
  }

  updatePlace(place: IPlace) {
    return this.placesService
      .updatePlace(place)
      .pipe(tap((place) => this.placesStore.updatePlace(place)));
  }

  delete(place: IPlace) {
    return this.placesService
      .delete(place)
      .pipe(tap(() => this.placesStore.deletePlace(place)));
  }

  filterPlaces(filter: IGetPlacesParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
