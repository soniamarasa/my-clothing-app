import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PopoverModule } from 'primeng/popover';
import { FocusTrapModule } from 'primeng/focustrap';
import { StyleClassModule } from 'primeng/styleclass';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PaginatorModule } from 'primeng/paginator';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { EmojiComponent } from '@components/emoji/emoji.component';
import { ItemDialog } from '@components/dialogs/item-dialog/item-dialog.component';
import { LookDialog } from '@components/dialogs/look-dialog/look-dialog.component';
import { PlannedLookDialog } from '@components/dialogs/planned-look-dialog/planned-look-dialog.component';
import { ListDialog } from '@components/dialogs/list-dialog/list-dialog.component';
import { LookCardComponent } from '@components/look-card/look-card.component';
import { PlannedLooksCalendarComponent } from '@components/planned-looks-calendar/planned-looks-calendar.component';
import { UserImgComponent } from '@components/user-img/user-img.component';
import { ListIndicatorComponent } from '../components/list-indicator/list-indicator.component';

const PRIME_MODULES = [
  ButtonModule,
  CardModule,
  DatePickerModule,
  DividerModule,
  SpeedDialModule,
  TooltipModule,
  DialogModule,
  DynamicDialogModule,
  SelectModule,
  InputTextModule,
  IconFieldModule,
  InputIconModule,
  PasswordModule,
  MultiSelectModule,
  CheckboxModule,
  ConfirmDialogModule,
  ToastModule,
  MessageModule,
  MenuModule,
  MenubarModule,
  TableModule,
  TagModule,
  ColorPickerModule,
  PopoverModule,
  FocusTrapModule,
  StyleClassModule,
  ProgressSpinnerModule,
  SelectButtonModule,
  PaginatorModule,
];

const SHARED_COMPONENTS = [
  EmojiComponent,
  ItemDialog,
  LookDialog,
  PlannedLookDialog,
  ListDialog,
  LookCardComponent,
  PlannedLooksCalendarComponent,
  UserImgComponent,
  ListIndicatorComponent,
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PickerComponent,
    ...PRIME_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PickerComponent,
    ...PRIME_MODULES,
    ...SHARED_COMPONENTS,
  ],
})
export class ClosetSharedModule {}
