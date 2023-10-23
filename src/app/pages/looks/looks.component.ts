import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { LooksFacade } from '@facades/looks.facade';
import { ILook } from '@interfaces/look';

import { AccessoriesFacade } from '@facades/accessories.facade';
import { IClothing } from '@interfaces/clothing';
import { IAccessory } from '@interfaces/accessory';
import { IShoe } from '@interfaces/shoe';

import { IBandana } from '@interfaces/bandana';
import { BandanasFacade } from '../../facades/bandanas.facade';
import { ShoesFacade } from '../../facades/shoes.facade';
import { ClothesFacade } from '../../facades/clothes.facade';
import { LookDialog } from '../../components/dialogs/look-dialog/look-dialog.component';
// import { FilterUtils } from "primeng/utils";

@Component({
  selector: 'app-looks',
  templateUrl: './looks.component.html',
  styleUrls: ['./looks.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class LooksComponent implements OnInit, OnDestroy {
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
  accessories: IAccessory[] = [];
  shoes: IShoe[] = [];
  bandanas: IBandana[] = [];

  filterAccessories = [];

  @ViewChild('dt1') tableLooks!: Table;

  readonly looks$ = this.looksFacade.looksState$.pipe(
    map((looks: ILook[]) => {
      return looks;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
    private looksFacade: LooksFacade,
    private clothesFacade: ClothesFacade,
    private accessoriesFacade: AccessoriesFacade,
    private bandanasFacade: BandanasFacade,
    private shoesFacade: ShoesFacade
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
        this.tops = clothes.filter((obj) => obj.tag.clothesType === 1);
        this.bottoms = clothes.filter((obj) => obj.tag.clothesType === 2);
        this.garbs = clothes.filter((obj) => obj.tag.clothesType === 3);
      }),

      this.accessoriesFacade
        .getAccessories()
        .subscribe((accessories: IAccessory[]) => {
          this.accessories = accessories;
        }),

      this.bandanasFacade.getBandanas().subscribe((bandanas: IBandana[]) => {
        this.bandanas = bandanas;
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
    this.filterAccessories = [];
    this.tableLooks.value = this.looksOriginal;
  }

  openDialog(look?: ILook) {
    const ref = this._dialogService.open(LookDialog, {
      header: look ? ' Editar' : 'Novo' + 'Look',
      width: '450px',
      data: {
        item: look,
        clothes: [this.tops, this.bottoms, this.garbs],
        shoes: this.shoes,
        bandanas: this.bandanas,
        accessories: this.accessories,
      },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((lookObj) => {
        if (lookObj) {
          lookObj._id ? this.updateLook(lookObj) : this.newLook(lookObj);
        }
      })
    );
  }

  newLook(look: ILook) {
    this.subs.add(
      this.looksFacade.newLook(look).subscribe({
        next: (look) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Roupa criada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa roupa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  updateLook(look: ILook) {
    this.subs.add(
      this.looksFacade.updateLook(look).subscribe({
        next: (look) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Roupa atualizada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa roupa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  filterAccessory(e: any) {
    if (e.value.length) {
      this.looks = this.looksOriginal;

      const selectedIds = e.value.map((el: any) => el._id);

      this.looks = this.looks.filter((look: any) =>
        look.accessories.some((accessory: any) =>
          selectedIds.includes(accessory._id)
        )
      );
    } else {
      this.looks = this.looksOriginal;
    }

    (this.tableLooks.filters['accessories'] as any)[0].value = e.value.map(
      (v: any) => [v]
    );

    this.filterAccessories = e.value;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
