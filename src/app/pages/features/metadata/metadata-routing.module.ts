import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from '../../categories/categories.component';
import { TagsComponent } from '../../tags/tags.component';
import { PlacesComponent } from '../../places/places.component';

const routes: Routes = [
  { path: 'categories', title: 'Categorias', component: CategoriesComponent },
  { path: 'tags', title: 'Tags', component: TagsComponent },
  { path: 'places', title: 'Locais', component: PlacesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetadataRoutingModule {}
