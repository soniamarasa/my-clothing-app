import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeComponent } from '../../wardrobe/wardrobe.component';
import { ClothesComponent } from '../../clothes/clothes.component';
import { ShoesComponent } from '../../shoes/shoes.component';
import { HandbagsComponent } from '../../handbags/handbags.component';
import { AccessoriesComponent } from '../../accessories/accessories.component';
import { BandanasComponent } from '../../bandanas/bandanas.component';

const routes: Routes = [
  { path: 'wardrobe', title: 'Meu Armário', component: WardrobeComponent },
  { path: 'clothes', title: 'Roupas', component: ClothesComponent },
  { path: 'shoes', title: 'Sapatos', component: ShoesComponent },
  { path: 'handbags', title: 'Bolsas', component: HandbagsComponent },
  { path: 'accessories', title: 'Acessórios', component: AccessoriesComponent },
  { path: 'bandanas', title: 'Bandanas', component: BandanasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
