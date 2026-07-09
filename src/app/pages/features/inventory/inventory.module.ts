import { NgModule } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { ClosetSharedModule } from '../../../shared/closet-shared.module';
import { InventoryRoutingModule } from './inventory-routing.module';
import { WardrobeComponent } from '../../wardrobe/wardrobe.component';
import { ClothesComponent } from '../../clothes/clothes.component';
import { ShoesComponent } from '../../shoes/shoes.component';
import { HandbagsComponent } from '../../handbags/handbags.component';
import { AccessoriesComponent } from '../../accessories/accessories.component';
import { BandanasComponent } from '../../bandanas/bandanas.component';

@NgModule({
  declarations: [
    WardrobeComponent,
    ClothesComponent,
    ShoesComponent,
    HandbagsComponent,
    AccessoriesComponent,
    BandanasComponent,
  ],
  imports: [ClosetSharedModule, InventoryRoutingModule],
  providers: [DialogService, ConfirmationService],
})
export class InventoryModule {}
