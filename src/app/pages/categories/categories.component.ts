import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';

import { CategoriesFacade } from '@facades/categories.facade';

import { ICategory } from '@interfaces/category';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  ref?: DynamicDialogRef;

  categories: ICategory[] = [];

  types: string[] = ['Categoria', 'Sapato', 'Acessory'];
  status: string[] = ['saia', 'vestido'];
  loading: boolean = true;

  readonly categories$ = this.categoriesFacade.categoriesState$.pipe(
    map((categories: ICategory[]) => {
      return categories;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoriesFacade: CategoriesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.categories$.subscribe((categories: ICategory[]) => {
        this.categories = categories;
        this.loading = false;
      })
    );
  }

  // confirm(category: ICategory) {
  //   this.confirmationService.confirm({
  //     message: 'Tem certeza que você deseja inativar essa categoria?',
  //     header: 'Inativar Categoria',
  //     accept: () => {
  //       this.subs.add(
  //         this.categoriesFacade.inactivate(category._id).subscribe({
  //           next: () => {
  //             this._messageService.add({
  //               key: 'notification',
  //               severity: 'success',
  //               summary: 'Categoria inativada.',
  //               detail: 'Categoria inativado com sucesso!',
  //               icon: 'fa-solid fa-check',
  //             });
  //           },
  //           error: () => {
  //             this._messageService.add({
  //               key: 'notification',
  //               severity: 'error',
  //               summary: 'Houve um problema!',
  //               detail:
  //                 'Não foi possível inativar a categoria. Tente novamente mais tarde.',
  //               icon: 'fa-solid fa-exclamation-circle',
  //             });
  //           },
  //         })
  //       );
  //     },
  //   });
  // }

  // activate(category: ICategory) {
  //   this.subs.add(
  //     this.categoriesFacade.activate(category._id).subscribe({
  //       next: () => {
  //         this._messageService.add({
  //           key: 'notification',
  //           severity: 'success',
  //           summary: 'Categoria ativado.',
  //           detail: 'Categoria foi ativada com sucesso!',
  //           icon: 'fa-solid fa-check',
  //         });
  //       },
  //       error: () => {
  //         this._messageService.add({
  //           key: 'notification',
  //           severity: 'error',
  //           summary: 'Houve um problema!',
  //           detail:
  //             'Não foi possível ativar essa categoria. Tente novamente mais tarde.',
  //           icon: 'fa-solid fa-exclamation-circle',
  //         });
  //       },
  //     })
  //   );
  // }

  getSeverity(status: string) {
    if (status.toLowerCase()) return 'success';
    else return 'warning';
  }

  onPageChange(e?: any) {}

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
