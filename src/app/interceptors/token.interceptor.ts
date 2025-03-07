import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Router } from '@angular/router';

import { UsersFacade } from '@facades/users.facade';

import { Tokens } from '@interfaces/auth';

const INITIAL_STATE = {
  token: null,
};

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private tokens: Tokens = INITIAL_STATE;

  private readonly token$ = this.facade.authState$.pipe(
    map(({ user }) => {
      return {
        token: user?.token,
      };
    }),
  );

  constructor(
    private _router: Router,
    private facade: UsersFacade,
  ) {
    this.token$.subscribe((token) => (this.tokens = token));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const { token } = this.tokens;

    if (!token) return this.interceptWithTimeout(request, next);

    request = this.addTokenToHeader(request, token);

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
          if (error.status === 401) {
            this.facade.logout().subscribe(() => {
              this._router.navigate(['/auth']);
            });
          }
        }

        return throwError(() => error);
      }),
    );
  }

  interceptWithTimeout(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return new Observable((observer) => {
      const { token } = this.tokens;

      setTimeout(() => {
        if (token) request = this.addTokenToHeader(request, token);

        next.handle(request).subscribe({
          next: (event) => observer.next(event),
          error: (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                this.facade.logout();
                this._router.navigate(['/auth']);
              }
            }
            // this._router.navigate(['/auth']);
            return observer.error(error);
          },
          complete: () => observer.complete(),
        });
      });
    });
  }

  addTokenToHeader(request: HttpRequest<any>, token: Tokens['token']) {
    return request.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
  }
}
