import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { ClosetSharedModule } from '../shared/closet-shared.module';
import { AuthenticatedModule } from './authenticated/authenticated.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthComponent } from './auth/auth.component';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RecoverDialogComponent } from './auth/recover-dialog/recover-dialog.component';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { MenuComponent } from '@components/menu/menu.component';

@NgModule({
  declarations: [
    PagesComponent,
    AuthComponent,
    RegistrationComponent,
    PasswordRecoverComponent,
    NotFoundComponent,
    RecoverDialogComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  imports: [ClosetSharedModule, AuthenticatedModule, RouterModule, PagesRoutingModule],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class PagesModule {}
