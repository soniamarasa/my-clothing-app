import { NgModule } from '@angular/core';

import { ClosetSharedModule } from '../../../shared/closet-shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from '../../account/account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [ClosetSharedModule, AccountRoutingModule],
})
export class AccountModule {}
