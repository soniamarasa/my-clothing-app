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
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private categoriesFacade: CategoriesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.categories$.subscribe((categories: ICategory[]) => {
        this.categories = categories;
        this.loading = false;
        this.total = categories.length;
      })
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
      })
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
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa categoria. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
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
            icon: 'fa-solid fa-check',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa categoria. Tente novamente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
          });
        },
      })
    );
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
