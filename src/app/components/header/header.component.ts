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
  private readonly compactQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 768px)')
      : null;

  user: IUser | null = null;
  displayName = 'Visitante';
  items: MenuItem[] | undefined;
  compactViewport = false;

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

    if (this.compactQuery) {
      this.compactViewport = this.compactQuery.matches;
      const onViewportChange = (event: MediaQueryListEvent) => {
        this.compactViewport = event.matches;
      };
      this.compactQuery.addEventListener('change', onViewportChange);
      this.subs.add({
        unsubscribe: () =>
          this.compactQuery?.removeEventListener('change', onViewportChange),
      });
    }

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

  onProfileMenuShow(): void {
    this.openHeaderOverlay('profile');
  }

  onProfileMenuHide(): void {
    this.closeHeaderOverlay('profile');
  }

  onYearPanelShow(): void {
    if (!this.compactViewport) {
      return;
    }

    document.documentElement.style.setProperty(
      '--header-overlay-top',
      `${this.getHeaderOverlayTop()}px`
    );
  }

  onYearPanelHide(): void {
    this.closeHeaderOverlay('year');
  }

  private openHeaderOverlay(kind: 'profile' | 'year'): void {
    if (!this.compactQuery?.matches) {
      return;
    }

    document.documentElement.style.setProperty(
      '--header-overlay-top',
      `${this.getHeaderOverlayTop()}px`
    );
    document.body.classList.add(this.getHeaderOverlayClass(kind));
  }

  private closeHeaderOverlay(kind: 'profile' | 'year'): void {
    document.body.classList.remove(this.getHeaderOverlayClass(kind));
  }

  private getHeaderOverlayClass(kind: 'profile' | 'year'): string {
    return kind === 'profile'
      ? 'header-profile-menu-open'
      : 'header-year-panel-open';
  }

  private getHeaderOverlayTop(): number {
    const header = document.querySelector('.app-header') as HTMLElement | null;
    return (header?.getBoundingClientRect().bottom ?? 56) + 8;
  }

  ngOnDestroy(): void {
    this.closeHeaderOverlay('profile');
    this.closeHeaderOverlay('year');
    this.subs.unsubscribe();
  }
}
