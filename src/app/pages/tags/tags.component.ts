import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TagsFacade } from '@facades/tags.facade';
import { ITag } from '@interfaces/tag';
import { tagTypes } from '@utils/valueTypes';
import { ItemDialog } from '../../components/dialogs/item-dialog/item-dialog.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class TagsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  ref?: DynamicDialogRef;
  total: number = 0;
  tags: ITag[] = [];
  loading: boolean = true;

  @ViewChild('table', { static: false }) table!: Table;

  readonly tags$ = this.tagsFacade.tagsState$.pipe(
    map((tags: ITag[]) => {
      return tags;
    }),
  );

  constructor(
    public _dialogService: DialogService,
    private _cdr: ChangeDetectorRef,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private tagsFacade: TagsFacade,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.tags$.subscribe((tags: ITag[]) => {
        this.tags = tags;
        this.loading = false;
        this.total = tags.length;
      }),
    );
  }

  openDialog(tag?: ITag) {
    const ref = this._dialogService.open(ItemDialog, {
      header: tag ? ' Editar' : 'Nova' + ' tag',
      width: '450px',
      data: { type: 'tag', item: tag, types: tagTypes },
      appendTo: 'body',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((tagObj) => {
        if (tagObj) {
          this.loading = true;
          tagObj._id ? this.updateTag(tagObj) : this.newTag(tagObj);
        }
      }),
    );
  }

  newTag(tag: ITag) {
    this.subs.add(
      this.tagsFacade.newTag(tag).subscribe({
        next: (tag) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Tag criada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível criar essa tag. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  updateTag(tag: ITag) {
    this.subs.add(
      this.tagsFacade.updateTag(tag).subscribe({
        next: (tag) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Tag atualizada com sucesso!',
          });
        },
        error: () => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'Houve um problema!',
            detail:
              'Não foi possível atualizar essa tag. Tente novamente mais tarde.',
          });
        },
      }),
    );
  }

  confirm(tag: ITag) {
    this._confirmationService.confirm({
      message: 'Tem certeza que você deseja exluir essa tag?',
      header: 'Excluir',
      accept: () => {
        this.subs.add(
          this.tagsFacade.delete(tag).subscribe({
            next: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Tag excluída.',
                detail: 'A tag foi deletada com sucesso!',
              });
            },
            error: () => {
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'Houve um problema!',
                detail:
                  'Não foi possível deletar a tag. Tente novamente mais tarde.',
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
