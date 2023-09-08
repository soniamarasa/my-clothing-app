import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IShoe } from '@interfaces/shoe';

export const INITIAL_STATE: IShoe[] = [];

@Injectable({
  providedIn: 'root',
})
export class ShoesStore {
  private _shoesState = new BehaviorSubject<IShoe[]>(INITIAL_STATE);
  readonly shoesState$ = this._shoesState.asObservable();

  constructor() {}

  updateShoes(shoes: IShoe[]) {
    const state = this._shoesState.value;

    const data = {
      ...state,
      ...shoes,
    };

    this._shoesState.next(data);

    return this._shoesState.asObservable();
  }

  updateShoe(shoe: IShoe) {
    const state = this._shoesState.value;

    const shoeIndex = state.findIndex(({ _id }) => _id === shoe._id);

    if (shoeIndex >= 0) {
      state[shoeIndex] = { ...state[shoeIndex], ...shoe };
    } else {
      state.push(shoe);
    }

    const data = state;

    this._shoesState.next(data);

    return this._shoesState.asObservable();
  }

  deleteShoe(shoe: IShoe) {
    const state = this._shoesState.value;

    const shoeIndex = state.findIndex(({ _id }) => _id === shoe._id);

    state.splice(shoeIndex, 1);

    const data = state;

    this._shoesState.next(data);

    return this._shoesState.asObservable();
  }
}
