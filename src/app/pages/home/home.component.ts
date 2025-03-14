import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, startWith, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SubSink } from 'subsink';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { IDashboard } from '../../interfaces/dashboard';
import { ILook } from '../../interfaces/look';
import { IPlannedLook } from '../../interfaces/plannedLook';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  dashboard!: IDashboard | null;
  loading: boolean = false;
  unusedLooks!: ILook[];
  nextPlannedLook!: IPlannedLook[];

  readonly dashboard$ = this.dashboardFacade.dashboardState$.pipe(
    tap(() => {
      this.loading = true;
    }),
    map((dashboard: IDashboard) => {
      return {
        loading: false,
        data: dashboard,
      };
    }),
    startWith({ loading: true, data: null })
  );

  constructor(
    public _dialogService: DialogService,
    private _router: Router,
    private dashboardFacade: DashboardFacade
  ) {}

  ngOnInit(): void {
    this.dashboardFacade.filter({ year: new Date().getFullYear().toString() });

    this.subs.add(
      this.dashboard$.subscribe((state) => {
        this.dashboard = state.data!;
        this.loading = state.loading;
      })
    );

    this.subs.add(
      this.dashboardFacade
        .getUnusedLooks()
        .subscribe((data) => (this.unusedLooks = data)),
      this.dashboardFacade
        .getNextPlannedLook()
        .subscribe((data) => (this.nextPlannedLook = data))
    );
  }

  ngOnDestroy(): any {}
}
