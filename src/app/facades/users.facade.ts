import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, shareReplay, tap } from 'rxjs';

import { UsersStore } from '@stores/users.store';
import { AuthStore } from '@stores/auth.store';
import { IUser } from '@root/src/app/interfaces/user';

import { ILoginBody, UsersService } from '@services/users.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  readonly authState$ = this.authStore.authState$;
  user = this.localStorageService.get('auth')?.user;

  constructor(
    private usersService: UsersService,
    private localStorageService: LocalStorageService,
    private usersStore: UsersStore,
    private authStore: AuthStore
  ) {}

  login({ email, password }: ILoginBody) {
    return this.usersService
      .login({ email, password })
      .pipe(tap((user) => this.authStore.login({ user })));
  }

  retrievePassword(email: IUser['email'], host: string) {
    return this.usersService.retrievePassword(email, host);
  }

  resetPassword(password: IUser['password'], token: IUser['token']) {
    return this.usersService.resetPassword(password, token);
  }

  logout() {
    return this.usersService
      .logout(this.localStorageService.get('idUser'))
      .pipe(
        shareReplay(),
        tap(() => this.authStore.logout())
      );
  }

  getUserById(id: IUser['_id']) {
    return this.usersService
      .getUser(id)
      .pipe(tap((user: IUser) => this.usersStore.updateUser(user)));
  }

  newUser(user: IUser) {
    return this.usersService
      .newUser(user)
      .pipe(tap((user) => this.usersStore.updateUser(user)));
  }

  updateUser(user: IUser) {
    return this.usersService
      .updateUser(user)
      .pipe(tap((user) => this.usersStore.updateUser(user)));
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
