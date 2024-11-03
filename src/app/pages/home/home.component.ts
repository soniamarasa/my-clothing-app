import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SubSink } from 'subsink';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { IDashboard } from '../../interfaces/dashboard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  dashboard!: IDashboard;
  loading: boolean = false;

  readonly dashboard$ = this.dashboardFacade.dashboardState$.pipe(
    tap(() => (this.loading = true)),
    map((dashboard: IDashboard) => {
      return dashboard;
    })
  );

  ngOnInit(): void {
    this.dashboardFacade.filter({ year: new Date().getFullYear().toString() });

    this.subs.add(
      this.dashboard$.subscribe((dashboard: IDashboard) => {
        this.dashboard = dashboard;
        this.loading = false;
      })
    );
  }

  constructor(
    public _dialogService: DialogService,
    private _router: Router,
    private dashboardFacade: DashboardFacade
  ) {}

  ngOnDestroy(): any {}
}
