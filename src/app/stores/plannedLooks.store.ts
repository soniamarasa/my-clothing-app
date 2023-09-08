import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPlannedLook } from '../interfaces/plannedLook';

export const INITIAL_STATE: IPlannedLook[] = [];

@Injectable({
  providedIn: 'root',
})
export class PlannedLooksStore {
  private _plannedLooksState = new BehaviorSubject<IPlannedLook[]>(
    INITIAL_STATE
  );
  readonly plannedLooksState$ = this._plannedLooksState.asObservable();

  constructor() {}

  updatePlannedLooks(plannedLooks: IPlannedLook[]) {
    const state = this._plannedLooksState.value;

    const data = {
      ...state,
      ...plannedLooks,
    };

    this._plannedLooksState.next(data);

    return this._plannedLooksState.asObservable();
  }

  updatePlannedLook(plannedLook: IPlannedLook) {
    const state = this._plannedLooksState.value;

    const plannedLookIndex = state.findIndex(
      ({ _id }) => _id === plannedLook._id
    );

    if (plannedLookIndex >= 0) {
      state[plannedLookIndex] = { ...state[plannedLookIndex], ...plannedLook };
    } else {
      state.push(plannedLook);
    }

    const data = state;

    this._plannedLooksState.next(data);

    return this._plannedLooksState.asObservable();
  }

  deletePlannedLook(plannedLook: IPlannedLook) {
    const state = this._plannedLooksState.value;

    const plannedLookIndex = state.findIndex(
      ({ _id }) => _id === plannedLook._id
    );

    state.splice(plannedLookIndex, 1);

    const data = state;

    this._plannedLooksState.next(data);

    return this._plannedLooksState.asObservable();
  }
}
