import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { AuthComponent } from './auth/auth.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { RegistrationComponent } from './registration/registration.component';
import { AUTHENTICATED_ROUTES } from './authenticated/authenticated.routes';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    title: 'Meu Closet',
    children: AUTHENTICATED_ROUTES,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'password-reset/:token',
    title: 'Password',
    component: PasswordRecoverComponent,
  },
  {
    path: 'signup',
    title: 'Sign up',
    component: RegistrationComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
