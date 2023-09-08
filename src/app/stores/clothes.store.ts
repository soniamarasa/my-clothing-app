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
    const state = this._clothesState.value;

    const data = {
      ...state,
      ...clothes,
    };

    this._clothesState.next(data);

    return this._clothesState.asObservable();
  }

  updateClothing(clothing: IClothing) {
    const state = this._clothesState.value;

    const clothingIndex = state.findIndex(({ _id }) => _id === clothing._id);

    if (clothingIndex >= 0) {
      state[clothingIndex] = { ...state[clothingIndex], ...clothing };
    } else {
      state.push(clothing);
    }

    const data = state;

    this._clothesState.next(data);

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
