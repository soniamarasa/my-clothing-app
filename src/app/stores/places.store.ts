import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPlace } from '@interfaces/place';

export const INITIAL_STATE: IPlace[] = [];

@Injectable({
  providedIn: 'root',
})
export class PlacesStore {
  private _placesState = new BehaviorSubject<IPlace[]>(INITIAL_STATE);
  readonly placesState$ = this._placesState.asObservable();

  constructor() {}

  updatePlaces(places: IPlace[]) {
    const state = this._placesState.value;

    const data = {
      ...state,
      ...places,
    };

    this._placesState.next(data);

    return this._placesState.asObservable();
  }

  updatePlace(place: IPlace) {
    const state = this._placesState.value;

    const placeIndex = state.findIndex(({ _id }) => _id === place._id);

    if (placeIndex >= 0) {
      state[placeIndex] = { ...state[placeIndex], ...place };
    } else {
      state.push(place);
    }

    const data = state;

    this._placesState.next(data);

    return this._placesState.asObservable();
  }

  deletePlace(place: IPlace) {
    const state = this._placesState.value;

    const placeIndex = state.findIndex(({ _id }) => _id === place._id);

    state.splice(placeIndex, 1);

    const data = state;

    this._placesState.next(data);

    return this._placesState.asObservable();
  }
}
