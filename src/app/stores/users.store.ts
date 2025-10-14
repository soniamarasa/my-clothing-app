import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '@interfaces/user';

export const INITIAL_STATE: IUser[] = [];

@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  private _usersState = new BehaviorSubject<IUser[]>(INITIAL_STATE);
  readonly usersState$ = this._usersState.asObservable();

  constructor() {}

  updateUsers(users: IUser[]) {
    const state = this._usersState.value;

    const data = {
      ...state,
      ...users,
    };

    this._usersState.next(data);

    return this._usersState.asObservable();
  }

  updateUser(user: IUser) {
    const state = this._usersState.value;

    const userIndex = state.findIndex(({ _id }) => _id === user._id);

    if (!userIndex) state[userIndex] = { ...state[userIndex], ...user };
    else state.unshift(user);

    const data = state;

    this._usersState.next(data);

    return this._usersState.asObservable();
  }
}
