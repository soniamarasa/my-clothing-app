import { Component, OnInit } from '@angular/core';
import { UsersFacade } from '@facades/users.facade';
import { IUser } from '../../interfaces/user';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PlannedLooksFacade } from '../../facades/plannedLooks.facade';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { FilterFacade } from '../../facades/filter.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  todayIs = new Date();
  isHome = window.location.pathname === '/' ? true : false;
  $user = this.userFacade.authState$;
  user!: IUser | any;
  items: MenuItem[] | undefined;

  constructor(
    private userFacade: UsersFacade,
    public filterFacade: FilterFacade,
    private plannedLooksFacade: PlannedLooksFacade,
    private dashboardFacade: DashboardFacade,
    private _router: Router,
  ) {
    this.$user.subscribe((user) => {
      this.user = user.user;
      this.user.userName = this.user?.name?.split(' ');
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Conta',
        icon: 'fa-solid fa-user',
        routerLink: '/account',
      },
      {
        label: 'Sair',
        icon: 'pi pi-times',
        command: () => {
          this.userFacade
            .logout()
            .subscribe(() => this._router.navigate(['/auth']));
        },
      },
    ];
  }

  setYear(event: any) {
    this.filterFacade.setFilter(event.getFullYear().toString());
  }
}
