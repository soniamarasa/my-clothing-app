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
    let data = [];

    data.push(...bandanas);

    this._bandanasState.next(data);

    return this._bandanasState.asObservable();
  }

  updateBandana(bandana: IBandana) {
    const state = this._bandanasState.value;
    const index = state.findIndex(({ _id }) => _id === bandana._id);

    if (index >= 0) {
      const updated = { ...state[index], ...bandana };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(bandana);
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
