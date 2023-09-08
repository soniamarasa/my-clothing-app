import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// --- Interfaces ---
import { IBandana } from '@interfaces/bandana';

export const INITIAL_STATE: IBandana[] = [];

@Injectable({
  providedIn: 'root',
})
export class BandanasStore {
  private _bandanasState = new BehaviorSubject<IBandana[]>(INITIAL_STATE);
  readonly bandanasState$ = this._bandanasState.asObservable();

  constructor() {}

  updateBandanas(bandanas: IBandana[]) {
    const state = this._bandanasState.value;

    const data = {
      ...state,
      ...bandanas,
    };

    this._bandanasState.next(data);

    return this._bandanasState.asObservable();
  }

  updateBandana(bandana: IBandana) {
    const state = this._bandanasState.value;

    const bandanaIndex = state.findIndex(({ _id }) => _id === bandana._id);

    if (bandanaIndex >= 0) {
      state[bandanaIndex] = { ...state[bandanaIndex], ...bandana };
    } else {
      state.push(bandana);
    }

    const data = state;

    this._bandanasState.next(data);

    return this._bandanasState.asObservable();
  }

  deleteBandana(bandana: IBandana) {
    const state = this._bandanasState.value;

    const bandanaIndex = state.findIndex(({ _id }) => _id === bandana._id);

    state.splice(bandanaIndex, 1);

    const data = state;

    this._bandanasState.next(data);

    return this._bandanasState.asObservable();
  }
}
