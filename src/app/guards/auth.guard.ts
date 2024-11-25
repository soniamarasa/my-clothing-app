import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
  CanActivateChild,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { UsersFacade } from '@facades/users.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly isAuthenticated$ = this.usersFacade.authState$.pipe(
    map(({ isAuthenticated }) => isAuthenticated),
  );

  constructor(
    private _router: Router,
    private usersFacade: UsersFacade,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.isAuthenticated$ as Observable<boolean>).pipe(
      tap(
        (isAuthenticated) =>
          !isAuthenticated && this._router.navigate(['/auth']),
      ),
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
