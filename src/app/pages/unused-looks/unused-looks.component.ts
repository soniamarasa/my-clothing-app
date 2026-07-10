import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { openClosetDialog } from '../../utils/closet-dialog';
import { Table } from 'primeng/table';

import { LooksFacade } from '@facades/looks.facade';
import { ShoesFacade } from '@facades/shoes.facade';
import { ClothesFacade } from '@facades/clothes.facade';
import { TagsFacade } from '@facades/tags.facade';
import { FilterFacade } from '@facades/filter.facade';
import { ILook } from '@interfaces/look';
import { IClothing } from '@interfaces/clothing';
import { IShoe } from '@interfaces/shoe';
import { ITag } from '@interfaces/tag';
import { LookDialog } from '../../components/dialogs/look-dialog/look-dialog.component';
import { getContrastTextColor } from '../../utils/color-contrast';

type LooksViewMode = 'grid' | 'list';

@Component({
  standalone: false,
  selector: 'app-unused-looks',
  templateUrl: './unused-looks.component.html',
  styleUrls: ['./unused-looks.component.scss'],
  providers: [DialogService],
})
export class UnusedLooksComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  loading = true;
  total = 0;
  looksOriginal: ILook[] = [];
  looks: ILook[] = [];
  filteredLooks: ILook[] = [];
  paginatedLooks: ILook[] = [];
  tops: IClothing[] = [];
  bottoms: IClothing[] = [];
  garbs: IClothing[] = [];
  shoes: IShoe[] = [];
  tags: ITag[] = [];
  searchQuery = '';
  viewMode: LooksViewMode = 'grid';
  gridFirst = 0;
  gridRows = 12;

  readonly viewOptions = [
    { label: 'Cards', value: 'grid' as LooksViewMode, icon: 'pi pi-th-large' },
    { label: 'Lista', value: 'list' as LooksViewMode, icon: 'pi pi-list' },
  ];

  readonly pageReportTemplate =
    'Mostrando {first} a {last} de {totalRecords} looks';

  @ViewChild('dt1') tableLooks!: Table;

  readonly looks$ = this.looksFacade.unusedLooksState$.pipe(
    map((looks: ILook[]) => looks)
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private shoesFacade: ShoesFacade,
    private tagsFacade: TagsFacade,
    public filterFacade: FilterFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.looks$.subscribe((looks: ILook[]) => {
        this.looksOriginal = looks;
        this.looks = looks;
        this.loading = false;
        this.total = looks.length;
        this.applyFilters();
      }),

      this.clothesFacade.getClothes().subscribe((clothes: IClothing[]) => {
        this.tops = clothes.filter(
          (obj) => obj.category.name == 'Peça Superior'
        );
        this.bottoms = clothes.filter(
          (obj) => obj.category.name == 'Peça Inferior'
        );
        this.garbs = clothes.filter(
          (obj) => obj.category.name == 'Traje Completo'
        );
      }),

      this.tagsFacade.getTags().subscribe((tags: ITag[]) => {
        this.tags = tags;
      }),

      this.shoesFacade.getShoes().subscribe((shoes: IShoe[]) => {
        this.shoes = shoes;
      })
    );
  }

  get yearLabel(): string {
    const year = this.filterFacade.year;
    return year instanceof Date
      ? year.getFullYear().toString()
      : String(year ?? new Date().getFullYear());
  }

  getTextColor(bgColor: string): string {
    return getContrastTextColor(bgColor);
  }

  onViewModeChange(): void {
    if (this.viewMode === 'grid') {
      this.applyFilters();
    }
  }

  onSearchChange(): void {
    if (this.viewMode === 'grid') {
      this.applyFilters();
      return;
    }

    this.tableLooks?.filterGlobal(this.searchQuery, 'contains');
  }

  clearFilters(): void {
    this.searchQuery = '';

    if (this.viewMode === 'list' && this.tableLooks) {
      this.tableLooks.clear();
      this.tableLooks.value = this.looksOriginal;
      return;
    }

    this.applyFilters();
  }

  onGridPageChange(event: PaginatorState): void {
    this.gridFirst = event.first ?? 0;
    this.gridRows = event.rows ?? this.gridRows;
    this.updatePaginatedLooks();
  }

  openDialog(look?: ILook): void {
    const ref = openClosetDialog(this._dialogService, LookDialog, {
      header: look ? 'Editar Look' : 'Novo Look',
      width: '520px',
      data: {
        item: look,
        clothes: [this.tops, this.bottoms, this.garbs],
        shoes: this.shoes,
        tags: this.tags,
      },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((lookObj) => {
        if (lookObj?._id) {
          this.updateLook(lookObj);
        }
      })
    );
  }

  updateLook(look: ILook): void {
    this.subs.add(
      this.looksFacade.updateLook(look).subscribe({
        next: () => {
          this.setTableFilters();
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Look atualizado com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'danger',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar esse look. Tente novamente mais tarde.',
          });
        },
      })
    );
  }

  setTableFilters(): void {
    this.looks = [...this.looks];
    this.applyFilters();
  }

  private applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredLooks = !query
      ? [...this.looks]
      : this.looks.filter((look) => this.matchesSearch(look, query));

    this.total = this.filteredLooks.length;
    this.gridFirst = 0;
    this.updatePaginatedLooks();
  }

  private updatePaginatedLooks(): void {
    const end = this.gridFirst + this.gridRows;
    this.paginatedLooks = this.filteredLooks.slice(this.gridFirst, end);
  }

  private matchesSearch(look: ILook, query: string): boolean {
    const parts = [
      look.top?.name,
      look.bottom?.name,
      look.garb?.name,
      look.shoe?.name,
      look.tag?.name,
    ];

    return parts.some((part) => part?.toLowerCase().includes(query));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
