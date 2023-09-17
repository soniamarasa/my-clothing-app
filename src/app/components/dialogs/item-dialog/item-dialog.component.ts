import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
import { SubSink } from 'subsink';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { CategoriesFacade } from '@facades/categories.facade';
import { ICategory } from '@root/src/app/interfaces/category';
import { ITag } from '@root/src/app/interfaces/tag';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
})
export class ItemDialog implements OnInit, OnDestroy {
  private subs = new SubSink();

  types: any[] = [];
  showRow2 = false;
  showIcon = false;
  showType = false;
  categories: ICategory[] = [];
  tags: ITag[] = [];

  formHasChanged = false;
  ref?: DynamicDialogRef;

  get dialogData(): any {
    return this._config.data;
  }

  itemForm = this._fb.group({
    name: ['', [Validators.required]],
    color: ['#dd8e58'],
  });

  constructor(
    public _ref: DynamicDialogRef,
    public _config: DynamicDialogConfig,
    public _dialogService: DialogService,
    private _fb: UntypedFormBuilder,
    public categoriesFacade: CategoriesFacade
  ) {}

  ngOnInit(): void {
    this.unboxItemForm();
    this.types = this.dialogData.types;
  }

  get formValue() {
    return this.itemForm?.value;
  }

  private unboxItemForm() {
    return new Promise<void>((resolve) => {
  
      if (this.dialogData) {
        if (this.dialogData.type === 'clothing') {
          this.showRow2 = true;
          this.itemForm.addControl(
            'category',
            this._fb.control(null, [Validators.required])
          );

          this.itemForm.addControl(
            'tag',
            this._fb.control(null, [Validators.required])
          );

          this.itemForm.addControl('inactive', this._fb.control(false));
        }

        if (
          this.dialogData.type === 'accessory' ||
          this.dialogData.type === 'category' ||
          this.dialogData.type === 'clothing' ||
          this.dialogData.type === 'shoe'
        ) {
          this.showType = true;
          this.itemForm.addControl(
            'type',
            this._fb.control(null, [Validators.required])
          );
        }

        if (
          this.dialogData.type === 'accessory' ||
          this.dialogData.type === 'tag'
        ) {
          this.showIcon = true;
          this.itemForm.addControl(
            'icon',
            this._fb.control(null, [Validators.required])
          );
        }

        if (this.dialogData?.item?._id) {
          this.itemForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.itemForm.patchValue(this.dialogData.item);
        }
      }
      resolve();
    });
  }

  onClose(confirmed?: boolean) {
    if (!confirmed) {
      this._ref.close();
    } else {
      let data = this.itemForm.value;
      delete data.isSubitem;

      this._ref.close(data);
    }
  }

  emoji(e: any) {
   this.itemForm.controls['icon'].setValue(e);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
