import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IDashboard } from '@interfaces/dashboard';

export const INITIAL_STATE: IDashboard = {
  handbags: {
    total: 0,
    result: [],
  },
  bottoms: {
    total: 0,
    result: [],
  },
  tops: {
    total: 0,
    result: [],
  },
  shoes: {
    total: 0,
    result: [],
  },
  garbs: {
    total: 0,
    result: [],
  },
  totalLooks: {
    total: 0,
    result: [],
  },
};

@Injectable({
  providedIn: 'root',
})
export class DashboardStore {
  private _dashboardState = new BehaviorSubject<IDashboard>(INITIAL_STATE);
  readonly dashboardState$ = this._dashboardState.asObservable();

  constructor() {}

  updateDashboard(dashboard: IDashboard) {
    this._dashboardState.next(dashboard);
  }
}
