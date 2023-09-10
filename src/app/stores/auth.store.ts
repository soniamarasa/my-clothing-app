import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuth } from '@interfaces/auth';
import { LocalStorageService } from '../services/local-storage.service';

interface IAuthState extends IAuth {}

const INITIAL_STATE: IAuthState = {
  isAuthenticated: false,
};

@Injectable({
  providedIn: 'root',
})

export class AuthStore {
  private _authState = new BehaviorSubject<IAuthState>(
    this.authStateStorage || INITIAL_STATE
  );
  readonly authState$ = this._authState.asObservable();

  constructor(private localStorageService: LocalStorageService) {}

  get authStateStorage() {
    return this.localStorageService.get('auth');
  }

  login({ user }: IAuthState) {
    const state = this._authState.value;

    const data = {
      ...state,
      ...user,
      isAuthenticated: true,
    };

    this._authState.next(data);

    this.localStorageService.set('auth', data);
    this.localStorageService.set('idUser', data.user?._id);

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
}
