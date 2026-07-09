import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { WardrobeComponent } from '../wardrobe/wardrobe.component';
import { ClothesComponent } from '../clothes/clothes.component';
import { ShoesComponent } from '../shoes/shoes.component';
import { HandbagsComponent } from '../handbags/handbags.component';
import { AccessoriesComponent } from '../accessories/accessories.component';
import { BandanasComponent } from '../bandanas/bandanas.component';
import { LooksComponent } from '../looks/looks.component';
import { PlannedLooksComponent } from '../planned-looks/planned-looks.component';
import { UnusedLooksComponent } from '../unused-looks/unused-looks.component';
import { CategoriesComponent } from '../categories/categories.component';
import { TagsComponent } from '../tags/tags.component';
import { PlacesComponent } from '../places/places.component';
import { AccountComponent } from '../account/account.component';

export const AUTHENTICATED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'wardrobe',
    title: 'Meu Armário',
    component: WardrobeComponent,
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
    path: 'unused-looks',
    title: 'Looks ainda Não Usados Nesse Ano',
    component: UnusedLooksComponent,
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
  {
    path: 'account',
    title: 'Minha Conta',
    component: AccountComponent,
  },
];
