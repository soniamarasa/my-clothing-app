import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { LooksFacade } from '@facades/looks.facade';
import { ILook } from '@interfaces/look';

import { IClothing } from '@interfaces/clothing';
import { IShoe } from '@interfaces/shoe';

import { ShoesFacade } from '../../facades/shoes.facade';
import { ClothesFacade } from '../../facades/clothes.facade';
import { TagsFacade } from '../../facades/tags.facade';
import { ITag } from '../../interfaces/tag';
import { FilterFacade } from '../../facades/filter.facade';


@Component({
  selector: 'app-unused-looks',
  templateUrl: './unused-looks.component.html',
  styleUrls: ['./unused-looks.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class UnusedLooksComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  loading: boolean = true;
  total: number = 0;
  looksOriginal: ILook[] = [];
  looks: ILook[] = [];
  clothes: IClothing[] = [];
  tops: IClothing[] = [];
  bottoms: IClothing[] = [];
  garbs: IClothing[] = [];
  shoes: IShoe[] = [];
  tags: ITag[] = [];

  @ViewChild('dt1') tableLooks!: Table;

  readonly looks$ = this.looksFacade.unusedLooksState$.pipe(
    map((looks: ILook[]) => {
      return looks;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private shoesFacade: ShoesFacade,
    private tagsFacade: TagsFacade,
    public filterFacade: FilterFacade,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.looks$.subscribe((looks: ILook[]) => {
        this.looksOriginal = looks;
        this.looks = looks;
        this.loading = false;
        this.total = looks.length;
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

  getSeverity(status: boolean) {
    if (status) return 'error';
    else return 'success';
  }

  clear(table: Table) {
    table.clear();

    this.tableLooks.value = this.looksOriginal;
  }


  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }

  filterGlobal(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value || '';
    this.tableLooks.filterGlobal(filterValue, 'contains');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
