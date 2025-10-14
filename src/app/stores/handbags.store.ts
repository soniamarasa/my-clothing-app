import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IHandbag } from '@interfaces/handbag';

export const INITIAL_STATE: IHandbag[] = [];

@Injectable({
  providedIn: 'root',
})
export class HandbagsStore {
  private _handbagsState = new BehaviorSubject<IHandbag[]>(INITIAL_STATE);
  readonly handbagsState$ = this._handbagsState.asObservable();

  constructor() {}

  updateHandbags(handbags: IHandbag[]) {
    let data = [];

    data.push(...handbags);

    this._handbagsState.next(data);

    return this._handbagsState.asObservable();
  }

  updateHandbag(handbag: IHandbag) {
    const state = [...this._handbagsState.value];
    const index = state.findIndex(({ _id }) => _id === handbag._id);

    if (index >= 0) {
      const updated = { ...state[index], ...handbag };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(handbag);
    }

    this._handbagsState.next([...state]);
    return this._handbagsState.asObservable();
  }

  deleteHandbag(handbag: IHandbag) {
    const state = this._handbagsState.value;

    const handbagIndex = state.findIndex(({ _id }) => _id === handbag._id);

    state.splice(handbagIndex, 1);

    const data = state;

    this._handbagsState.next(data);

    return this._handbagsState.asObservable();
  }
}
