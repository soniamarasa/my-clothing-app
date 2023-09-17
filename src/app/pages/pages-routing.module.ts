import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesComponent } from './pages.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { RegistrationComponent } from './registration/registration.component';
import { ClothesComponent } from './clothes/clothes.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { PlacesComponent } from './places/places.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    title: 'Meu Vestuário',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'accessories',
        title: 'Acessórios',
        component: AccountComponent,
      },
      {
        path: 'clothes',
        title: 'Roupas',
        component: ClothesComponent,
      },
      {
        path: 'shoes',
        title: 'Sapatos',
        component: AccountComponent,
      },
      {
        path: 'bandanas',
        title: 'Bandanas',
        component: AccountComponent,
      },
      {
        path: 'handbags',
        title: 'Bolsas',
        component: AccountComponent,
      },
      {
        path: 'categories',
        title: 'Categorias',
        component: CategoriesComponent,
      },
      {
        path: 'tags',
        title: 'Tags',
        component: TagsComponent,
      },
      {
        path: 'places',
        title: 'Locais',
        component: PlacesComponent,
      },
      {
        path: 'looks',
        title: 'Looks',
        component: AccountComponent,
      },
      {
        path: 'planned-looks',
        title: 'Looks Planejados',
        component: AccountComponent,
      },
      {
        path: 'used-looks',
        title: 'Looks Usados',
        component: AccountComponent,
      },
      {
        path: 'gym',
        title: 'Academia',
        component: AccountComponent,
      },
      {
        path: 'specials',
        title: 'Especiais',
        component: AccountComponent,
      },
    ],
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
