import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import '../../config/home-stats-icons.data';

import { ClosetSharedModule } from '../../shared/closet-shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    HomeComponent,
    ChartComponent,
    PieChartComponent,
    BarChartComponent,
  ],
  imports: [ClosetSharedModule, HomeRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
