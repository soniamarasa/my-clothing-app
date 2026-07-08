import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersFacade } from '@facades/users.facade';
import { IUser } from '../../interfaces/user';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { FilterFacade } from '../../facades/filter.facade';
import { SubSink } from 'subsink';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  user: IUser | null = null;
  displayName = 'Visitante';
  items: MenuItem[] | undefined;

  constructor(
    private userFacade: UsersFacade,
    public filterFacade: FilterFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.userFacade.authState$.subscribe((auth) => {
        this.user = auth.user ?? null;
        this.displayName =
          this.user?.name?.trim().split(/\s+/)[0] ??
          this.user?.username ??
          'Visitante';
      })
    );

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
            .subscribe(() => this.router.navigate(['/auth']));
        },
      },
    ];
  }

  setYear(event: Date): void {
    this.filterFacade.setFilter(event.getFullYear().toString());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
