import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAccessory } from '@interfaces/accessory';

export const INITIAL_STATE: IAccessory[] = [];

@Injectable({
  providedIn: 'root',
})
export class AccessoriesStore {
  private _accessoriesState = new BehaviorSubject<IAccessory[]>(INITIAL_STATE);
  readonly accessoriesState$ = this._accessoriesState.asObservable();

  constructor() {}

  updateAccessories(accessories: IAccessory[]) {
    const data = [];
    data.push(...accessories);

    this._accessoriesState.next(data);

    return this._accessoriesState.asObservable();
  }

  updateAccessory(accessory: IAccessory) {
    const state = [...this._accessoriesState.value];
    const index = state.findIndex(({ _id }) => _id === accessory._id);

    if (index >= 0) {
      const updated = { ...state[index], ...accessory };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(accessory);
    }

    this._accessoriesState.next([...state]);
    return this._accessoriesState.asObservable();
  }

  deleteAccessory(accessory: IAccessory) {
    const state = this._accessoriesState.value;

    const accessoryIndex = state.findIndex(({ _id }) => _id === accessory._id);

    state.splice(accessoryIndex, 1);

    const data = state;

    this._accessoriesState.next(data);

    return this._accessoriesState.asObservable();
  }
}
