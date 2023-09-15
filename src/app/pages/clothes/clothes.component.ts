import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';

import { ClothesFacade } from '@facades/clothes.facade';

import { IClothing } from '@interfaces/clothing';
import { Table } from 'primeng/table';
import { ICategory } from '../../interfaces/category';

@Component({
  selector: 'app-clothes',
  templateUrl: './clothes.component.html',
  styleUrls: ['./clothes.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class ClothesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  ref?: DynamicDialogRef;

  clothes: IClothing[] = [];

  categories: string[] = ['saia', 'vestido'];
  status: string[] = ['saia', 'vestido'];
  loading: boolean = true;

  readonly clothes$ = this.clothesFacade.clothesState$.pipe(
    map((clothes: IClothing[]) => {
      return clothes;
    })
  );

  constructor(
    public _dialogService: DialogService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clothesFacade: ClothesFacade
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.clothes$.subscribe((clothes: IClothing[]) => {
        this.clothes = clothes;
        this.loading = false;
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
                detail: 'Peça de roupacom sucesso!',
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
