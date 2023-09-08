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
    const state = this._handbagsState.value;

    const data = {
      ...state,
      ...handbags,
    };

    this._handbagsState.next(data);

    return this._handbagsState.asObservable();
  }

  updateHandbag(handbag: IHandbag) {
    const state = this._handbagsState.value;

    const handbagIndex = state.findIndex(({ _id }) => _id === handbag._id);

    if (handbagIndex >= 0) {
      state[handbagIndex] = { ...state[handbagIndex], ...handbag };
    } else {
      state.push(handbag);
    }

    const data = state;

    this._handbagsState.next(data);

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
