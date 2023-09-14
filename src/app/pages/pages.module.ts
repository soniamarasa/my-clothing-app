import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { GravatarModule } from 'ngx-gravatar';
import { MenubarModule } from 'primeng/menubar';

import { UsersFacade } from '@facades/users.facade';

//Paginas
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthComponent } from './auth/auth.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';

//Componentes
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { UserImgComponent } from '../components/user-img/user-img.component';
import { MenuComponent } from '../components/menu/menu.component';

//Dialogs
import { RecoverDialogComponent } from './auth/recover-dialog/recover-dialog.component';


@NgModule({
  declarations: [
    PagesComponent,
    AuthComponent,
    HomeComponent,
    RecoverDialogComponent,
    RegistrationComponent,
    PasswordRecoverComponent,
    AccountComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    UserImgComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    DividerModule,
    SpeedDialModule,
    TooltipModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
    MultiSelectModule,
    CheckboxModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ChartModule,
    MenuModule,
    MenubarModule,
    GravatarModule,
    PagesRoutingModule,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
  bootstrap: [PagesComponent],
})
export class PagesModule {}
