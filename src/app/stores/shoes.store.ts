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
    let data = [];

    data.push(...shoes);

    this._shoesState.next(data);

    return this._shoesState.asObservable();
  }

  updateShoe(shoe: IShoe) {
    const state = [...this._shoesState.value];
    const index = state.findIndex(({ _id }) => _id === shoe._id);

    if (index >= 0) {
      const updated = { ...state[index], ...shoe };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(shoe);
    }

    this._shoesState.next([...state]);
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
