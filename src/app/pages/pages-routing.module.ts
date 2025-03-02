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
import { AccessoriesComponent } from './accessories/accessories.component';
import { ShoesComponent } from './shoes/shoes.component';
import { BandanasComponent } from './bandanas/bandanas.component';
import { HandbagsComponent } from './handbags/handbags.component';
import { LooksComponent } from './looks/looks.component';
import { PlannedLooksComponent } from './planned-looks/planned-looks.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    title: 'Meu Closet',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'accessories',
        title: 'Acessórios',
        component: AccessoriesComponent,
      },
      {
        path: 'clothes',
        title: 'Roupas',
        component: ClothesComponent,
      },
      {
        path: 'shoes',
        title: 'Sapatos',
        component: ShoesComponent,
      },
      {
        path: 'bandanas',
        title: 'Bandanas',
        component: BandanasComponent,
      },
      {
        path: 'handbags',
        title: 'Bolsas',
        component: HandbagsComponent,
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
        component: LooksComponent,
      },
      {
        path: 'planned-looks',
        title: 'Looks Planejados',
        component: PlannedLooksComponent,
      },
      {
        path: 'used-looks',
        title: 'Looks Usados',
        component: PlannedLooksComponent,
      },
      {
        path: 'gym',
        title: 'Academia',
        component: PlannedLooksComponent,
      },
      {
        path: 'specials',
        title: 'Especiais',
        component: PlannedLooksComponent,
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
