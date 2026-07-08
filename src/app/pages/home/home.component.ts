import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SubSink } from 'subsink';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { IDashboard } from '../../interfaces/dashboard';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  readonly dashboardView$ = this.dashboardFacade.dashboardState$.pipe(
    map((dashboard: IDashboard) => ({
      loading: false,
      data: dashboard,
    })),
    startWith({ loading: true, data: null as IDashboard | null })
  );

  readonly nextPlannedLook$ = this.dashboardFacade.getNextPlannedLook();

  constructor(
    public _dialogService: DialogService,
    private _router: Router,
    private dashboardFacade: DashboardFacade
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
