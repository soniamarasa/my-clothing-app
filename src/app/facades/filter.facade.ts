import { Injectable } from '@angular/core';
import { PlannedLooksFacade } from './plannedLooks.facade';
import { DashboardFacade } from './dashboard.facade';
import { LooksFacade } from './looks.facade';

@Injectable({
  providedIn: 'root',
})
export class FilterFacade {
  todayIs = new Date();
  year: Date = new Date(this.todayIs.getFullYear(), 0, 1);
  loading = false;

  constructor(
    private plannedLooksFacade: PlannedLooksFacade,
    private dashboardFacade: DashboardFacade,
    private looksFacade: LooksFacade,
  ) {}

  getYearString(): string {
    if (this.year instanceof Date) {
      return this.year.getFullYear().toString();
    }

    return String(this.year ?? new Date().getFullYear());
  }

  setFilter(year: string | number | Date) {
    const yearStr =
      year instanceof Date
        ? year.getFullYear().toString()
        : String(year ?? new Date().getFullYear());

    this.year = new Date(parseInt(yearStr, 10), 0, 1);
    this.plannedLooksFacade.filterPlannedLooks({ year: yearStr });
    this.looksFacade.filterUnusedLooks({ year: yearStr });
    this.dashboardFacade.filter({ year: yearStr });
  }
}
