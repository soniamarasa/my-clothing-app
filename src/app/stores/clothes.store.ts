import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// --- Interfaces ---
import { IClothing } from '@interfaces/clothing';

export const INITIAL_STATE: IClothing[] = [];

@Injectable({
  providedIn: 'root',
})
export class ClothesStore {
  private _clothesState = new BehaviorSubject<IClothing[]>(INITIAL_STATE);
  readonly clothesState$ = this._clothesState.asObservable();

  constructor() {}

  updateClothes(clothes: IClothing[]) {
    let data = [];

    data.push(...clothes);

    this._clothesState.next(data);

    return this._clothesState.asObservable();
  }

  updateClothing(clothing: IClothing) {
    const state = [...this._clothesState.value];
    const index = state.findIndex(({ _id }) => _id === clothing._id);

    if (index >= 0) {
      const updated = { ...state[index], ...clothing };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(clothing);
    }

    this._clothesState.next([...state]);
    return this._clothesState.asObservable();
  }

  deleteClothing(clothing: IClothing) {
    const state = this._clothesState.value;

    const clothingIndex = state.findIndex(({ _id }) => _id === clothing._id);

    state.splice(clothingIndex, 1);

    const data = state;

    this._clothesState.next(data);

    return this._clothesState.asObservable();
  }
}
