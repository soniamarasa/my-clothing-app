import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { IGetUsersParams, UsersService } from '@services/users.service';

import { UsersStore } from '@stores/users.store';

import { IUser } from '@root/src/app/interfaces/user';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getUsers({ ...this._filter.value })));

  readonly usersState$ = combineLatest([
    this.usersStore.usersState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(
    private usersService: UsersService,
    private usersStore: UsersStore
  ) {}

  getUsers(queryParams?: IGetUsersParams) {
    return this.usersService
      .getUsers(queryParams)
      .pipe(tap((users) => this.usersStore.updateUsers(users)));
  }

  getUserById(id: IUser['_id']) {
    return this.usersService
      .getUserById(id)
      .pipe(tap((user) => this.usersStore.updateUser(user)));
  }

  newUser(user: IUser) {
    return this.usersService
      .newUser(user)
      .pipe(tap((user) => this.usersStore.updateUser(user)));
  }

  updateUser(id: IUser['_id'], body: IUser) {
    return this.usersService
      .updateUser(id, body)
      .pipe(tap((user) => this.usersStore.updateUser(user)));
  }

  updatePassword(password: IUser['password'], token: IUser['token']) {
    return this.usersService.updatePassword(password, token);
  }

  filterUsers(filter: IGetUsersParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
