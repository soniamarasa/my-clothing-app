import { Injectable } from '@angular/core';
import { PlannedLooksFacade } from './plannedLooks.facade';
import { DashboardFacade } from './dashboard.facade';

@Injectable({
  providedIn: 'root',
})
export class FilterFacade {
  todayIs = new Date();
  year: any = this.todayIs;
  loading = false;

  constructor(
    private plannedLooksFacade: PlannedLooksFacade,
    private dashboardFacade: DashboardFacade
  ) {}

  setFilter(year: string) {
    this.year = year;
    this.plannedLooksFacade.filterPlannedLooks({ year: this.year });
    this.dashboardFacade.filter({ year: this.year });
  }
}
