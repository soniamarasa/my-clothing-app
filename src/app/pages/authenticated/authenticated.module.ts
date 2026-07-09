import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import '../../config/home-stats-icons.data';

import { ClosetSharedModule } from '../../shared/closet-shared.module';

import { HomeComponent } from '../home/home.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';

import { WardrobeComponent } from '../wardrobe/wardrobe.component';
import { ClothesComponent } from '../clothes/clothes.component';
import { ShoesComponent } from '../shoes/shoes.component';
import { HandbagsComponent } from '../handbags/handbags.component';
import { AccessoriesComponent } from '../accessories/accessories.component';
import { BandanasComponent } from '../bandanas/bandanas.component';

import { LooksComponent } from '../looks/looks.component';
import { PlannedLooksComponent } from '../planned-looks/planned-looks.component';
import { UnusedLooksComponent } from '../unused-looks/unused-looks.component';

import { CategoriesComponent } from '../categories/categories.component';
import { TagsComponent } from '../tags/tags.component';
import { PlacesComponent } from '../places/places.component';

import { AccountComponent } from '../account/account.component';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    HomeComponent,
    ChartComponent,
    PieChartComponent,
    BarChartComponent,
    WardrobeComponent,
    ClothesComponent,
    ShoesComponent,
    HandbagsComponent,
    AccessoriesComponent,
    BandanasComponent,
    LooksComponent,
    PlannedLooksComponent,
    UnusedLooksComponent,
    CategoriesComponent,
    TagsComponent,
    PlacesComponent,
    AccountComponent,
  ],
  imports: [ClosetSharedModule],
  providers: [DialogService, ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthenticatedModule {}
