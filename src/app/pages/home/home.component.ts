import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { PlannedLooksFacade } from '../../facades/plannedLooks.facade';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { IDashboard } from '../../interfaces/dashboard';
import { LocalStorageService } from '../../services/local-storage.service';
import { IPlannedLook } from '../../interfaces/plannedLook';
import { statusLook } from '../../utils/valueTypes';
import { isPlannedLookUsed } from '../../utils/planned-look-label';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  accent: string;
}

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  userName = '';
  today = new Date();

  readonly dashboardView$ = this.dashboardFacade.dashboardState$.pipe(
    map((dashboard: IDashboard) => ({
      loading: false,
      data: dashboard,
      stats: this.buildStats(dashboard),
      wardrobeTotal: this.getWardrobeTotal(dashboard),
      insight: this.buildInsight(dashboard),
    })),
    startWith({
      loading: true,
      data: null as IDashboard | null,
      stats: [] as StatCard[],
      wardrobeTotal: 0,
      insight: '',
    })
  );

  readonly nextPlannedLook$ = this.dashboardFacade.getNextPlannedLook();

  constructor(
    private _router: Router,
    private dashboardFacade: DashboardFacade,
    private plannedLooksFacade: PlannedLooksFacade,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.get('auth')?.user;
    this.userName = user?.name || user?.username || '';
  }

  goToLooks(): void {
    this._router.navigate(['/looks']);
  }

  goToPlannedLooks(): void {
    this._router.navigate(['/planned-looks']);
  }

  canMarkAsUsed(plannedLook: IPlannedLook): boolean {
    return !isPlannedLookUsed(plannedLook);
  }

  markAsUsed(plannedLook: IPlannedLook): void {
    const updated: IPlannedLook = {
      ...plannedLook,
      status: statusLook[1],
      date: new Date(),
    };

    this.subs.add(
      this.plannedLooksFacade.updatePlannedLook(updated).subscribe({
        next: () => {
          this.plannedLooksFacade.refresh();
          this.dashboardFacade.refresh();
          this.messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Look marcado como usado!',
          });
        },
        error: () => {
          this.messageService.add({
            key: 'notification',
            severity: 'danger',
            summary: 'Não foi possível marcar o look como usado.',
          });
        },
      })
    );
  }

  private buildStats(dashboard: IDashboard): StatCard[] {
    return [
      {
        label: 'Looks usados',
        value: dashboard.totalLooks.total,
        icon: 'mdi:calendar-check',
        accent: '#de615d',
      },
      {
        label: 'Vestidos',
        value: dashboard.garbs.total,
        icon: 'game-icons:dress',
        accent: '#708a81',
      },
      {
        label: 'Tops',
        value: dashboard.tops.total,
        icon: 'mdi:tshirt-crew',
        accent: '#cda64e',
      },
      {
        label: 'Partes de baixo',
        value: dashboard.bottoms.total,
        icon: 'game-icons:trousers',
        accent: '#77835c',
      },
      {
        label: 'Bolsas',
        value: dashboard.handbags.total,
        icon: 'game-icons:hand-bag',
        accent: '#866d9b',
      },
      {
        label: 'Sapatos',
        value: dashboard.shoes.total,
        icon: 'mdi:shoe-sneaker',
        accent: '#dea37b',
      },
    ];
  }

  private getWardrobeTotal(dashboard: IDashboard): number {
    return (
      dashboard.garbs.total +
      dashboard.tops.total +
      dashboard.bottoms.total +
      dashboard.handbags.total +
      dashboard.shoes.total
    );
  }

  private buildInsight(dashboard: IDashboard): string {
    const usedLooks = dashboard.totalLooks.total;
    const wardrobe = this.getWardrobeTotal(dashboard);

    if (!wardrobe && !usedLooks) {
      return 'Comece cadastrando peças e montando seus primeiros looks.';
    }

    if (!usedLooks) {
      return `Seu closet tem ${wardrobe} peças cadastradas. Que tal montar o primeiro look?`;
    }

    return `${usedLooks} look${usedLooks === 1 ? '' : 's'} usado${usedLooks === 1 ? '' : 's'} este ano · ${wardrobe} peças no armário`;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
