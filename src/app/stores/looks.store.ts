import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILook } from '@interfaces/look';

export const INITIAL_STATE: ILook[] = [];

@Injectable({
  providedIn: 'root',
})
export class LooksStore {
  private _looksState = new BehaviorSubject<ILook[]>(INITIAL_STATE);
  readonly looksState$ = this._looksState.asObservable();

  constructor() {}

  updateLooks(looks: ILook[]) {
    let data = [];

    data.push(...looks);

    this._looksState.next(data);

    return this._looksState.asObservable();
  }

  updateLook(look: ILook) {
    const state = this._looksState.value;

    const lookIndex = state.findIndex(({ _id }) => _id === look._id);

    if (lookIndex >= 0) {
      state[lookIndex] = { ...state[lookIndex], ...look };
    } else {
      state.push(look);
    }

    const data = state;

    this._looksState.next(data);

    return this._looksState.asObservable();
  }

  deleteLook(look: ILook) {
    const state = this._looksState.value;

    const lookIndex = state.findIndex(({ _id }) => _id === look._id);

    state.splice(lookIndex, 1);

    const data = state;

    this._looksState.next(data);

    return this._looksState.asObservable();
  }
}
