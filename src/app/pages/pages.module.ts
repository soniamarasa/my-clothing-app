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
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ColorPickerModule } from 'primeng/colorpicker';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FocusTrapModule } from 'primeng/focustrap';
import { StyleClassModule } from 'primeng/styleclass';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GravatarModule } from 'ngx-gravatar';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { UsersFacade } from '@facades/users.facade';

//Paginas
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthComponent } from './auth/auth.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClothesComponent } from './clothes/clothes.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { PlacesComponent } from './places/places.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { HandbagsComponent } from './handbags/handbags.component';
import { BandanasComponent } from './bandanas/bandanas.component';
import { ShoesComponent } from './shoes/shoes.component';
import { LooksComponent } from './looks/looks.component';
import { PlannedLooksComponent } from './planned-looks/planned-looks.component';
import { UnusedLooksComponent } from './unused-looks/unused-looks.component';

//Componentes
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { UserImgComponent } from '@components/user-img/user-img.component';
import { MenuComponent } from '@components/menu/menu.component';
import { EmojiComponent } from '@components/emoji/emoji.component';
import { ChartComponent } from '../components/chart/chart.component';
import { PieChartComponent } from '../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { ListIndicatorComponent } from '../components/list-indicator/list-indicator.component';

//Dialogs
import { RecoverDialogComponent } from './auth/recover-dialog/recover-dialog.component';
import { ItemDialog } from '@components/dialogs/item-dialog/item-dialog.component';
import { LookDialog } from '@components/dialogs/look-dialog/look-dialog.component';
import { PlannedLookDialog } from '@components/dialogs/planned-look-dialog/planned-look-dialog.component';
import { ListDialog } from '../components/dialogs/list-dialog/list-dialog.component';

@NgModule({
  declarations: [
    PagesComponent,
    AuthComponent,
    HomeComponent,
    RegistrationComponent,
    PasswordRecoverComponent,
    AccountComponent,
    NotFoundComponent,
    ClothesComponent,
    CategoriesComponent,
    TagsComponent,
    PlacesComponent,
    AccessoriesComponent,
    HandbagsComponent,
    BandanasComponent,
    ShoesComponent,
    LooksComponent,
    UnusedLooksComponent,
    PlannedLooksComponent,
    ChartComponent,
    PieChartComponent,
    BarChartComponent,
    ListIndicatorComponent,

    RecoverDialogComponent,
    ItemDialog,
    LookDialog,
    PlannedLookDialog,
    ListDialog,

    EmojiComponent,
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
    MenuModule,
    MenubarModule,
    TableModule,
    TagModule,
    ColorPickerModule,
    OverlayPanelModule,
    FocusTrapModule,
    StyleClassModule,
    ProgressSpinnerModule,
    GravatarModule,
    PickerComponent,
    EmojiModule,
    PagesRoutingModule,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
  bootstrap: [PagesComponent],
})
export class PagesModule {}
