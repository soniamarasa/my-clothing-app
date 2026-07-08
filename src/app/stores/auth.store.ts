import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuth } from '@interfaces/auth';
import { IUser } from '@interfaces/user';
import { LocalStorageService } from '../services/local-storage.service';

interface IAuthState extends IAuth {}

interface ILoginResponse {
  user: IUser;
}

const INITIAL_STATE: IAuthState = {
  isAuthenticated: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private _authState = new BehaviorSubject<IAuthState>(
    this.normalizeAuthState(this.authStateStorage) ?? INITIAL_STATE
  );
  readonly authState$ = this._authState.asObservable();

  constructor(private localStorageService: LocalStorageService) {}

  get authStateStorage() {
    return this.localStorageService.get('auth');
  }

  login(response: ILoginResponse) {
    const data: IAuthState = {
      user: response.user,
      isAuthenticated: true,
    };

    this._authState.next(data);

    this.localStorageService.set('auth', data);
    this.localStorageService.set('idUser', data.user?._id);

    return this._authState.asObservable();
  }

  patchUser(user: Partial<IUser>) {
    const current = this._authState.value;
    const updatedUser = { ...(current.user ?? {}), ...user } as IUser;

    const data: IAuthState = {
      ...current,
      user: updatedUser,
      isAuthenticated: true,
    };

    this._authState.next(data);
    this.localStorageService.set('auth', data);

    return this._authState.asObservable();
  }

  logout() {
    this._authState.next({
      user: null,
      rememberMe: false,
      isAuthenticated: false,
    });

    this.localStorageService.remove('auth');
    this.localStorageService.remove('idUser');

    return this._authState.asObservable();
  }

  private normalizeAuthState(auth: IAuthState | null): IAuthState | null {
    if (!auth?.user) {
      return auth;
    }

    const nestedUser = (auth.user as IUser & { user?: IUser }).user;
    if (!nestedUser) {
      return auth;
    }

    return {
      ...auth,
      user: nestedUser,
      isAuthenticated: !!nestedUser,
    };
  }
}
