import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CategoriesFacade } from '@facades/categories.facade';
import { categoryTypes } from '@utils/valueTypes';
import { ICategory } from '@interfaces/category';

import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  total: number = 0;
  categories: ICategory[] = [];
  loading: boolean = true;

  readonly categories$ = this.categoriesFacade.categoriesState$.pipe(
    map((categories: ICategory[]) => {
      return categories;
    }),
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private categoriesFacade: CategoriesFacade,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.categories$.subscribe((categories: ICategory[]) => {
        this.categories = categories;
        this.loading = false;
        this.total = categories.length;
      }),
    );
  }

  openDialog(category?: ICategory) {
    const ref = this._dialogService.open(ItemDialog, {
      header: category ? ' Editar' : 'Nova' + ' categoria',
      width: '450px',
      data: { type: 'category', item: category, types: categoryTypes },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((categoryObj) => {
        if (categoryObj) {
          categoryObj._id
            ? this.updateCategory(categoryObj)
            : this.newCategory(categoryObj);
        }
      }),
    );
  }

  newCategory(category: ICategory) {
    this.subs.add(
      this.categoriesFacade.newCategory(category).subscribe({
        next: (category) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Categoria criada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa categoria. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  updateCategory(category: ICategory) {
    this.subs.add(
      this.categoriesFacade.updateCategory(category).subscribe({
        next: (category) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Categoria atualizada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa categoria. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  confirm(category: ICategory) {
    this._confirmationService.confirm({
      message: 'Tem certeza que você deseja exluir essa categoria?',
      header: 'Excluir',
      accept: () => {
        this.subs.add(
          this.categoriesFacade.delete(category).subscribe({
            next: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Categoria excluída.',
                detail: 'A categoria foi deletada com sucesso!',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível deletar a categoria. Tente novamente mais tarde.',
              });
            },
          }),
        );
      },
    });
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
