import { NgModule } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { ClosetSharedModule } from '../../../shared/closet-shared.module';
import { MetadataRoutingModule } from './metadata-routing.module';
import { CategoriesComponent } from '../../categories/categories.component';
import { TagsComponent } from '../../tags/tags.component';
import { PlacesComponent } from '../../places/places.component';

@NgModule({
  declarations: [CategoriesComponent, TagsComponent, PlacesComponent],
  imports: [ClosetSharedModule, MetadataRoutingModule],
  providers: [DialogService, ConfirmationService],
})
export class MetadataModule {}
