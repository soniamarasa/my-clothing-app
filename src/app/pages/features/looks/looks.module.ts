import { NgModule } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { ClosetSharedModule } from '../../../shared/closet-shared.module';
import { LooksRoutingModule } from './looks-routing.module';
import { LooksComponent } from '../../looks/looks.component';
import { PlannedLooksComponent } from '../../planned-looks/planned-looks.component';
import { UnusedLooksComponent } from '../../unused-looks/unused-looks.component';

@NgModule({
  declarations: [LooksComponent, PlannedLooksComponent, UnusedLooksComponent],
  imports: [ClosetSharedModule, LooksRoutingModule],
  providers: [DialogService, ConfirmationService],
})
export class LooksModule {}
