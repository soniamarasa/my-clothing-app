import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UsersFacade } from '@facades/users.facade';
import { LocalStorageService } from '@services/local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private facade: UsersFacade,
    private localStorageService: LocalStorageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.getToken();
    const authorizedRequest = token
      ? this.addTokenToHeader(request, token)
      : request;

    return next.handle(authorizedRequest).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.facade.logout().subscribe(() => {
            this._router.navigate(['/auth']);
          });
        }

        return throwError(() => error);
      })
    );
  }

  private getToken(): string | null {
    const auth = this.localStorageService.get('auth');
    return auth?.user?.token ?? auth?.token ?? null;
  }

  private addTokenToHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }
}
