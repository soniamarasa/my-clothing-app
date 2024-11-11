import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { ClothesFacade } from '@facades/clothes.facade';
import { IClothing } from '@interfaces/clothing';
import { ItemDialog } from '@components/dialogs/item-dialog/item-dialog.component';
import { CategoriesFacade } from '@facades/categories.facade';
import { TagsFacade } from '@facades/tags.facade';
import { ICategory } from '@interfaces/category';
import { ITag } from '@interfaces/tag';

@Component({
  selector: 'app-clothes',
  templateUrl: './clothes.component.html',
  styleUrls: ['./clothes.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class ClothesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  loading: boolean = true;
  total: number = 0;
  clothes: IClothing[] = [];
  clothesOriginal: IClothing[] = [];
  categories: ICategory[] = [];
  tags: ITag[] = [];

  value: boolean[] = [false, true];
  status = [
    { label: 'Ativo', value: false },
    { label: 'Inativo', value: true },
  ];

  @ViewChild('dt1') tableClothes!: Table;

  readonly clothes$ = this.clothesFacade.clothesState$.pipe(
    map((clothes: IClothing[]) => {
      return clothes;
    })
  );
  filterClothes: any;

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clothesFacade: ClothesFacade,
    private categoriesFacade: CategoriesFacade,
    private tagsFacade: TagsFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.clothes$.subscribe((clothes: IClothing[]) => {
        this.clothes = clothes;
        this.clothesOriginal = clothes;
        this.loading = false;
        this.total = clothes.length;
      }),

      this.categoriesFacade
        .getCategories()
        .subscribe((categories: ICategory[]) => {
          this.categories = categories.filter((obj) => obj.type === 'Roupa');
        }),

      this.tagsFacade.getTags().subscribe((tags: ITag[]) => {
        this.tags = tags.filter((obj) => obj.type === 'Roupa');
      })
    );
  }

  confirm(clothing: IClothing) {
    this.confirmationService.confirm({
      message: 'Tem certeza que você deseja inativar essa peça de roupa?',
      header: 'Inativar Roupa',
      accept: () => {
        this.subs.add(
          this.clothesFacade.inactivate(clothing._id).subscribe({
            next: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Roupa inativada.',
                detail: 'Peça de roupa inativada com sucesso!',
                icon: 'fa-solid fa-check',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível inativar a peça de roupa. Tente novamente mais tarde.',
                icon: 'fa-solid fa-exclamation-circle',
              });
            },
          })
        );
      },
    });
  }

  activate(clothing: IClothing) {
    this.subs.add(
      this.clothesFacade.activate(clothing._id).subscribe({
        next: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Roupa ativado.',
            detail: 'Roupa foi ativada com sucesso!',
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível ativar essa peça de roupa. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }

  getSeverity(status: boolean) {
    if (status) return 'error';
    else return 'success';
  }

  clear(table: Table) {
    table.clear();
  }

  openDialog(clothing?: IClothing) {
    const ref = this._dialogService.open(ItemDialog, {
      header: clothing ? ' Editar ' : 'Nova ' + 'Peça de Roupa',
      width: '450px',
      data: { type: 'clothing', item: clothing, category: 'Roupa' },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((clothingObj) => {
        if (clothingObj) {
          clothingObj._id
            ? this.updateClothing(clothingObj)
            : this.newClothing(clothingObj);
        }
      })
    );
  }

  newClothing(clothing: IClothing) {
    this.subs.add(
      this.clothesFacade.newClothing(clothing).subscribe({
        next: (clothing) => {
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

  updateClothing(clothing: IClothing) {
    this.subs.add(
      this.clothesFacade.updateClothing(clothing).subscribe({
        next: (clothing) => {
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

  filterGlobal(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value || '';
    this.tableClothes.filterGlobal(filterValue, 'contains');
  }

  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
